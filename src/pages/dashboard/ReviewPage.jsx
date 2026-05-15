import React, { useEffect } from 'react';
import { ReviewStats } from '../../components/review/ReviewStats';
import { QuickReview } from '../../components/review/QuickReview';
import { ReviewList } from '../../components/review/ReviewList';
import { ReviewQuiz } from '../../components/review/ReviewQuiz';
import { useApp } from '../../context/AppContext';
import { fetchWrongQuestions, fetchReviewQuiz, createQuestionAnswer, createLearningSessionWithQuestions } from '../../services/api.js';

export default function ReviewPage() {
  const {
    user,
    formData,
    buildSessionMetadata,
    reviewMode,
    setReviewMode,
    currentReviewIndex,
    setCurrentReviewIndex,
    reviewSelectedAnswer,
    setReviewSelectedAnswer,
    reviewShowResult,
    setReviewShowResult,
    reviewQuestions,
    setReviewQuestions,
    REVIEW_MODES,
    scrollToTop
  } = useApp();

  // 실제 세션 동기화용 상태
  const [sessionId, setSessionId] = React.useState(null);
  const [initialQuestionCount, setInitialQuestionCount] = React.useState(0);
  const [reviewQuestionStartTime, setReviewQuestionStartTime] = React.useState(null);

  // 컴포넌트 마운트 시 복습 문제 데이터 로드 및 스크롤 리셋
  useEffect(() => {
    let isMounted = true;
    scrollToTop();

    const loadReviewData = async () => {
      const userId = user?.id;
      if (!userId) {
        console.warn('⚠️ [ReviewPage] 사용자 정보를 찾을 수 없습니다.');
        return;
      }

      const mapQuestionData = (q, idx) => {
          // 응답 구조가 question 객체가 중첩되어 있는 경우 처리
          const questionData = q.question || q;
          
          // 옵션 배열 생성 (optionA, optionB, optionC 또는 option1, option2, option3)
          const options = [
            questionData.optionA || questionData.option1 || q.optionA || q.option1,
            questionData.optionB || questionData.option2 || q.optionB || q.option2,
            questionData.optionC || questionData.option3 || q.optionC || q.option3
          ].filter(Boolean);
          
          // 정답 처리 (correctAnswer가 "1", "2", "3" 또는 "A", "B", "C" 형태)
          let correctValue = '';
          const correctAnswer = questionData.correctAnswer || q.correctAnswer;
          if (correctAnswer) {
            const answerStr = correctAnswer.toString();
            if (['1', '2', '3'].includes(answerStr)) {
              const answerIndex = parseInt(answerStr) - 1;
              correctValue = options[answerIndex] || '';
            } else if (['A', 'B', 'C'].includes(answerStr.toUpperCase())) {
              const letterToIndex = { A: 0, B: 1, C: 2 };
              const answerIndex = letterToIndex[answerStr.toUpperCase()];
              correctValue = options[answerIndex] || '';
            } else {
              correctValue = answerStr;
            }
          }
          
          // 문제 유형 변환 (WORD -> word, SENTENCE -> sentence, CONVERSATION -> conversation)
          const typeMap = {
            'WORD': 'word',
            'SENTENCE': 'sentence',
            'CONVERSATION': 'conversation'
          };
          const questionTypeUpper = (questionData.questionType || questionData.type || q.questionType || q.type || 'word').toUpperCase();
          const typeLower = typeMap[questionTypeUpper] || questionTypeUpper.toLowerCase() || 'word';
          
          // 대화 맥락 처리 (CONVERSATION 타입인 경우)
          let conversationData = undefined;
          if (typeLower === 'conversation') {
            // conversation이 이미 올바른 배열 형태인 경우
            if (questionData.conversation && Array.isArray(questionData.conversation) && questionData.conversation.length > 0) {
              conversationData = questionData.conversation;
            } 
            else if (q.conversation && Array.isArray(q.conversation) && q.conversation.length > 0) {
              conversationData = q.conversation;
            }
            // conversationContext나 dialogueContext 같은 다른 필드명으로 올 수 있음
            else if (questionData.conversationContext && Array.isArray(questionData.conversationContext) && questionData.conversationContext.length > 0) {
              conversationData = questionData.conversationContext;
            }
            else if (q.conversationContext && Array.isArray(q.conversationContext) && q.conversationContext.length > 0) {
              conversationData = q.conversationContext;
            }
            else if (questionData.dialogueContext && Array.isArray(questionData.dialogueContext) && questionData.dialogueContext.length > 0) {
              conversationData = questionData.dialogueContext;
            }
            else if (q.dialogueContext && Array.isArray(q.dialogueContext) && q.dialogueContext.length > 0) {
              conversationData = q.dialogueContext;
            }
            // questionText에서 대화 맥락 추출 (fallback)
            else if (questionData.questionText || q.questionText) {
              const questionText = questionData.questionText || q.questionText;
              // 간단한 fallback: A가 질문, B가 빈칸 형태로 구성
              conversationData = [
                { speaker: 'A', dialogue: questionText.replace('___', '___________') || '...' },
                { speaker: 'B', dialogue: '___' }
              ];
            }
            // 완전히 없으면 기본 구조
            else {
              conversationData = [
                { speaker: 'A', dialogue: '...' },
                { speaker: 'B', dialogue: '___' }
              ];
            }
          }
          
        return {
          id: questionData.questionId || q.questionId || q.id || `q-${idx + 1}`,
          question: questionData.questionText || questionData.question || q.questionText || q.question || '',
          options,
          correctAnswer: correctValue,
          type: typeLower,
          questionType: typeLower,
          category: typeLower,
          date: q.date || questionData.answeredAt || q.answeredAt || questionData.createdAt || q.createdAt || '',
          conversation: conversationData,
          explanation: questionData.explanation || q.explanation || undefined,
          difficulty: questionData.difficultyLevel || questionData.level || q.difficultyLevel || q.level || undefined,
          // 새로 추가된 필드들 (question 객체 내부 또는 최상위 레벨에서 찾기)
          userAnswer: questionData.userAnswer || q.userAnswer || undefined,
          userAnswerText: questionData.userAnswerText || q.userAnswerText || undefined,
          correctAnswerText: questionData.correctAnswerText || q.correctAnswerText || undefined,
          isCorrect: questionData.isCorrect !== undefined ? questionData.isCorrect : (q.isCorrect !== undefined ? q.isCorrect : undefined),
          answeredAt: questionData.answeredAt || q.answeredAt || undefined,
          timeSpent: questionData.timeSpent || q.timeSpent || undefined, // 문제를 푸는 데 걸린 시간 (초)
          // 카테고리 정보 (majorCategory, minorCategory)
          majorCategory: questionData.majorCategory || q.majorCategory || undefined,
          minorCategory: questionData.minorCategory || q.minorCategory || undefined
        };
      };

      try {
        console.log('📖 [ReviewPage] 틀린 문제 데이터 요청');
        const data = await fetchWrongQuestions(userId);
        const list = Array.isArray(data) ? data : (data?.questions || []);
        
        console.log('📖 [ReviewPage] API 응답 전체 문제 개수:', list.length);
        
        // isCorrect 필드가 있는 경우, 틀린 문제만 필터링 (isCorrect === false)
        // question 객체가 중첩되어 있는 경우도 처리
        const wrongQuestionsOnly = list.filter(q => {
          const questionData = q.question || q;
          const isCorrect = questionData.isCorrect !== undefined ? questionData.isCorrect : q.isCorrect;
          
          if (isCorrect !== undefined && isCorrect !== null) {
            return isCorrect === false;
          }
          // isCorrect 필드가 없으면 일단 포함 (백엔드가 틀린 문제만 반환한다고 가정)
          return true;
        });
        
        console.log('📖 [ReviewPage] 필터링 후 틀린 문제 개수:', wrongQuestionsOnly.length);
        console.log('📖 [ReviewPage] 필터링된 문제들의 isCorrect 값:', wrongQuestionsOnly.map(q => {
          const questionData = q.question || q;
          return { 
            questionId: questionData.questionId || q.questionId || q.id, 
            isCorrect: questionData.isCorrect !== undefined ? questionData.isCorrect : q.isCorrect,
            hasQuestionObject: !!q.question
          };
        }));
        
        let mapped = wrongQuestionsOnly.map((q, idx) => mapQuestionData(q, idx));

        console.log('📖 [ReviewPage] 매핑된 문제 개수:', mapped.length);
        if (mapped.length === 0) {
          console.log('📖 [ReviewPage] 틀린 문제가 없어 리뷰 퀴즈 API 호출');
          const quiz = await fetchReviewQuiz(userId);
          const quizList = Array.isArray(quiz) ? quiz : [];
          mapped = quizList.map((q, idx) => mapQuestionData(q, idx));
        }

        if (!isMounted) return;
        setReviewQuestions(mapped);

        const questionCountForSession = mapped.length > 0 ? mapped.length : 5;
        const sessionMetadata = buildSessionMetadata({
          keywords: formData?.keywords || [],
          selectedCategories: formData?.selectedCategories || [],
          level: formData?.level || 'B',
          questionCount: questionCountForSession
        });

        try {
          const session = await createLearningSessionWithQuestions({
            userId,
            sessionType: 'REVIEW',
            sessionMetadata
          });
          if (!isMounted) return;
          if (session?.sessionId) setSessionId(session.sessionId);
        } catch (sessionErr) {
          console.warn('세션 생성 실패, 로컬 세션 ID 사용:', sessionErr);
          if (!isMounted) return;
          setSessionId(`review-${userId}-${Date.now()}`);
        }
      } catch (err) {
        console.error('❌ [ReviewPage] 데이터 로드 실패:', err);
        if (user?.id) setSessionId(`review-${user.id}-${Date.now()}`);
      }
    };

    loadReviewData();

    return () => {
      isMounted = false;
    };
  }, [user?.id]); // 초기 마운트 시에만 실행

  useEffect(() => {
    if (reviewMode === REVIEW_MODES.QUIZ && reviewQuestions.length > 0) {
      setReviewQuestionStartTime(Date.now());
    } else {
      setReviewQuestionStartTime(null);
    }
  }, [reviewMode, currentReviewIndex, reviewQuestions.length]);

  // 퀴즈 시작
  const startReview = () => {
    setInitialQuestionCount(reviewQuestions.length);
    setReviewMode(REVIEW_MODES.QUIZ);
    setCurrentReviewIndex(0);
    setReviewSelectedAnswer('');
    setReviewShowResult(false);
  };

  // 답안 제출
  const submitReviewAnswer = async () => {
    setReviewShowResult(true);
    const currentQuestion = reviewQuestions[currentReviewIndex];
    if (!currentQuestion) return;
    try {
      // 선택지 값을 A/B/C로 변환
      const options = currentQuestion.options || [];
      const selectedAnswerText = (reviewSelectedAnswer || '').trim();
      const correctAnswerText = (currentQuestion.correctAnswer || '').trim();
      
      // 텍스트 비교로 정답 여부 확인
      const isCorrect = selectedAnswerText === correctAnswerText;
      
      const idx = options.findIndex(o => (o || '').trim() === selectedAnswerText);
      const indexToLetter = ['A','B','C'];
      const userAnswerLetter = indexToLetter[idx] || 'A';
      const timeSpentSeconds = reviewQuestionStartTime ? Math.max(1, Math.round((Date.now() - reviewQuestionStartTime) / 1000)) : 0;
      
      // 디버깅 로그
      console.log('✏️ [ReviewPage] 답변 제출 시작:', {
        questionId: currentQuestion.id,
        selectedAnswer: selectedAnswerText,
        correctAnswer: correctAnswerText,
        options: options,
        userAnswerLetter,
        isCorrect,
        timeSpent: timeSpentSeconds,
        comparison: `${selectedAnswerText} === ${correctAnswerText} = ${isCorrect}`
      });

      const effectiveSessionId = sessionId || (() => {
        const uid = user?.id || 'unknown';
        return `review-${uid}`;
      })();
      const questionId = currentQuestion.id?.toString() || '';

      // 백엔드가 correctAnswer와 userAnswer를 비교해서 isCorrect를 계산하도록 userAnswer만 전송
      const response = await createQuestionAnswer({
        sessionId: effectiveSessionId,
        questionId,
        sessionType: 'REVIEW',
        userAnswer: userAnswerLetter,
        isCorrect,
        timeSpent: timeSpentSeconds,
        solveCount: 1
      });

      // 백엔드 응답에서 isCorrect를 받아옴 (백엔드가 correctAnswer와 userAnswer를 비교해서 계산)
      const backendIsCorrect = response?.isCorrect !== undefined ? response.isCorrect : isCorrect;
      
      console.log('✏️ [ReviewPage] 백엔드 응답:', {
        backendIsCorrect,
        frontendIsCorrect: isCorrect,
        response
      });

      // 정답이면 목록에서 제거하고 상태 초기화 (다음 문제가 깨끗하게 보이도록)
      if (backendIsCorrect) {
        setReviewQuestions(prev => prev.filter(q => (q.id?.toString() || '') !== questionId));
        setReviewSelectedAnswer('');
        setReviewShowResult(false);
      }
      setReviewQuestionStartTime(Date.now());
    } catch (e) {
      // 최소 처리: 콘솔만
      console.error('정답 기록 실패:', e);
    }
  };

  // 다음 문제 또는 완료
  const nextReviewQuestion = () => {
    if (currentReviewIndex < reviewQuestions.length - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1);
      setReviewSelectedAnswer('');
      setReviewShowResult(false);
    } else {
      setReviewMode(REVIEW_MODES.LIST);
      setCurrentReviewIndex(0);
      setReviewSelectedAnswer('');
      setReviewShowResult(false);
      setReviewQuestionStartTime(null);
    }
  };

  // 답안 선택
  const handleAnswerSelect = (answer) => {
    setReviewSelectedAnswer(answer);
  };

  // 목록으로 돌아가기
  const backToList = () => {
    setReviewMode(REVIEW_MODES.LIST);
    setCurrentReviewIndex(0);
    setReviewSelectedAnswer('');
    setReviewShowResult(false);
  };

  // 특정 문제 다시 풀기
  const handleQuestionRetry = (index) => {
    setCurrentReviewIndex(index);
    setReviewMode(REVIEW_MODES.QUIZ);
    setReviewSelectedAnswer('');
    setReviewShowResult(false);
  };

  // 정답 처리 API는 백엔드 확정 후 연동 예정

  // 새로고침 API는 필요 시 별도 구현

  // 약점 유형 집중 복습 시작
  const startWeakTypeReview = (questionType) => {
    const filteredQuestions = reviewQuestions.filter(q => {
      const mappedType = q.questionType || q.category || q.type || 'word';
      return mappedType === questionType;
    });
    
    if (filteredQuestions.length === 0) {
      alert('해당 유형의 문제가 없습니다.');
      return;
    }

    setReviewQuestions(filteredQuestions);
    setReviewMode(REVIEW_MODES.QUIZ);
    setCurrentReviewIndex(0);
    setReviewSelectedAnswer('');
    setReviewShowResult(false);
  };

  // 퀴즈 모드일 때
  if (reviewMode === REVIEW_MODES.QUIZ) {
    const currentQuestion = reviewQuestions[currentReviewIndex];
    
    return (
      <ReviewQuiz
        question={currentQuestion}
        currentIndex={currentReviewIndex}
        totalQuestions={reviewQuestions.length}
        selectedAnswer={reviewSelectedAnswer}
        showResult={reviewShowResult}
        onAnswerSelect={handleAnswerSelect}
        onSubmit={submitReviewAnswer}
        onNext={nextReviewQuestion}
        onBackToList={backToList}
      />
    );
  }

  // 목록 모드일 때
  return (
    <div className="min-h-screen !p-4 !sm:p-6 !space-y-6">
      {/* Header */}
      <div className="!space-y-2">
        <h1 className="text-2xl font-bold text-gray-800">📝 복습하기</h1>
        <p className="text-gray-600">
          틀린 문제들을 복습하고 실력을 향상시키세요
        </p>
      </div>

      {/* 리뷰 통계 */}
      <ReviewStats reviewQuestions={reviewQuestions} />

      {/* 리뷰 바로가기 */}
      <QuickReview 
        reviewQuestions={reviewQuestions} 
        onStartReview={startReview} 
        onStartWeakTypeReview={startWeakTypeReview}
      />

      {/* 리뷰 문제 목록 */}
      <ReviewList 
        reviewQuestions={reviewQuestions}
        onQuestionRetry={handleQuestionRetry}
      />
    </div>
  );
}