import React, { useEffect } from 'react';
import { ReviewStats } from '../../components/review/ReviewStats';
import { QuickReview } from '../../components/review/QuickReview';
import { ReviewList } from '../../components/review/ReviewList';
import { ReviewQuiz } from '../../components/review/ReviewQuiz';
import { useApp } from '../../context/AppContext';
import { fetchWrongQuestions, fetchReviewQuiz, createQuestionAnswer, createReviewSession } from '../../services/api.js';

export default function ReviewPage() {
  const {
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

  // 컴포넌트 마운트 시 복습 문제 데이터 로드 및 스크롤 리셋
  useEffect(() => {
    scrollToTop();
    // 백엔드에서 틀린 문제 목록 가져오기
    const storedUser = localStorage.getItem('user');
    const userId = storedUser ? JSON.parse(storedUser).userId : null;
    if (!userId) return;

    // 리뷰 세션 생성 (실세션 동기화)
    createReviewSession({ userId })
      .then((session) => {
        if (session?.sessionId) setSessionId(session.sessionId);
      })
      .catch(() => {});
    fetchWrongQuestions(userId)
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.questions || []);
        const mapped = list.map((q, idx) => ({
          id: q.id || q.questionId || idx + 1,
          question: q.question || q.questionText || '',
          options: q.options || [q.optionA, q.optionB, q.optionC].filter(Boolean),
          date: q.date || q.answeredAt || '',
          questionType: q.questionType || q.type || 'word'
        }));
        if (mapped.length > 0) {
          setReviewQuestions(mapped);
          return;
        }
        // 폴백: 리뷰 퀴즈 API
        return fetchReviewQuiz(userId).then((quiz) => {
          const quizMapped = (Array.isArray(quiz) ? quiz : []).map((q, idx) => ({
            id: q.id || idx + 1,
            question: q.question,
            options: q.options || [q.optionA, q.optionB, q.optionC].filter(Boolean),
            questionType: q.type || 'word'
          }));
          setReviewQuestions(quizMapped);
        });
      })
      .catch(() => {})
  }, [setReviewQuestions, scrollToTop]);

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
      const idx = options.findIndex(o => o === reviewSelectedAnswer);
      const indexToLetter = ['A','B','C'];
      const userAnswerLetter = indexToLetter[idx] || 'A';
      const isCorrect = reviewSelectedAnswer === currentQuestion.correctAnswer;

      const effectiveSessionId = sessionId || (() => {
        const storedUser = localStorage.getItem('user');
        const uid = storedUser ? JSON.parse(storedUser).userId : 'unknown';
        return `review-${uid || 'unknown'}`;
      })();
      const questionId = currentQuestion.id?.toString() || '';

      await createQuestionAnswer({
        sessionId: effectiveSessionId,
        questionId,
        sessionType: 'REVIEW',
        userAnswer: userAnswerLetter,
        isCorrect,
        timeSpent: 0,
        solveCount: 1
      });

      // 정답이면 목록에서 제거
      if (isCorrect) {
        setReviewQuestions(prev => prev.filter(q => (q.id?.toString() || '') !== questionId));
      }
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
      const mappedType = q.questionType || q.category || 'word';
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
        totalQuestions={initialQuestionCount}
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