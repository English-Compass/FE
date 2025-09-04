import React, { useEffect, useState } from 'react';
import { ReviewStats } from '../../components/review/ReviewStats';
import { QuickReview } from '../../components/review/QuickReview';
import { ReviewList } from '../../components/review/ReviewList';
import { ReviewQuiz } from '../../components/review/ReviewQuiz';
import { useApp } from '../../context/AppContext';

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
  const [reviewNoDataMessage, setReviewNoDataMessage] = useState('');

  // 컴포넌트 마운트 시 복습 문제 데이터 로드 및 스크롤 리셋
  useEffect(() => {
    scrollToTop();
    
    // API: 서버에서 복습 문제 목록을 가져옵니다.
    const fetchReviewQuestions = async () => {
      try {
        // 1. 복습 퀴즈 문제들을 가져옵니다.
        const response = await fetch('http://localhost:8081/api/quiz/review?userId=user_123');
        
        if (response.status === 422) {
          // HTTP 422: 복습할 문제가 없음
          setReviewNoDataMessage('복습할 문제가 없습니다.');
          setReviewQuestions([]);
          return;
        } else if (!response.ok) {
          throw new Error(`서버 응답 오류: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 2. 데이터를 프론트엔드 형식으로 변환
        const formattedQuestions = data.map((quiz, index) => ({
          id: quiz.id,
          question: quiz.question,
          correctAnswer: quiz.correctAnswer,
          options: quiz.options || [],
          date: new Date().toISOString().split('T')[0], // 현재 날짜
          questionType: quiz.questionType || quiz.type || 'word',
          userAnswer: null // 복습에서는 이전 답안이 없음
        }));
        
        setReviewQuestions(formattedQuestions);
        
      } catch (error) {
        console.error('복습 문제 로드 실패:', error);
        // 에러 발생 시 더미 데이터 사용 (wrong answer와 동일한 접근 방식)
        const testReviewQuestions = [
          {
            id: 1,
            question: "What does 'comprehensive' mean?",
            userAnswer: "simple",
            correctAnswer: "complete and thorough",
            options: ["simple", "complete and thorough", "expensive", "quick"],
            date: "2025-08-05",
            questionType: "word"
          },
          {
            id: 2,
            question: "She went to the library to study for her exams.",
            userAnswer: "그녀는 도서관에서 책을 읽었다.",
            correctAnswer: "그녀는 시험 공부를 하기 위해 도서관에 갔다.",
            options: ["그녀는 도서관에서 책을 읽었다.", "그녀는 시험 공부를 하기 위해 도서관에 갔다.", "그녀는 친구와 만나기 위해 도서관에 갔다."],
            date: "2025-08-04",
            questionType: "sentence"
          },
          {
            id: 3,
            question: "The weather was _____ cold yesterday.",
            userAnswer: "much",
            correctAnswer: "extremely",
            options: ["much", "extremely", "very much"],
            date: "2025-08-03",
            questionType: "word"
          },
          {
            id: 4,
            question: "The task was ___difficult___ for everyone to complete.",
            userAnswer: "The work was simple for all to finish.",
            correctAnswer: "The assignment was challenging for everyone to finish.",
            options: ["The work was simple for all to finish.", "The assignment was challenging for everyone to finish.", "The job was easy for all to complete."],
            date: "2025-08-02",
            questionType: "sentence"
          },
          {
            id: 5,
            question: "Choose the word that means the same as 'happy':",
            userAnswer: "sad",
            correctAnswer: "joyful",
            options: ["sad", "joyful", "angry"],
            date: "2025-08-01",
            questionType: "synonym"
          }
        ];
        setReviewQuestions(testReviewQuestions);
      }
    };
    
    fetchReviewQuestions();

    // 임시 테스트 데이터 (개발용)
    const testReviewQuestions = [
      {
        id: 1,
        question: "What does 'comprehensive' mean?",
        userAnswer: "simple",
        correctAnswer: "complete and thorough",
        options: ["simple", "complete and thorough", "expensive", "quick"],
        date: "2025-08-05",
        questionType: "word"
      },
      {
        id: 2,
        question: "She went to the library to study for her exams.",
        userAnswer: "그녀는 도서관에서 책을 읽었다.",
        correctAnswer: "그녀는 시험 공부를 하기 위해 도서관에 갔다.",
        options: ["그녀는 도서관에서 책을 읽었다.", "그녀는 시험 공부를 하기 위해 도서관에 갔다.", "그녀는 친구와 만나기 위해 도서관에 갔다."],
        date: "2025-08-04",
        questionType: "sentence"
      },
      {
        id: 3,
        question: "The weather was _____ cold yesterday.",
        userAnswer: "much",
        correctAnswer: "extremely",
        options: ["much", "extremely", "very much"],
        date: "2025-08-03",
        questionType: "word"
      },
      {
        id: 4,
        question: "The task was ___difficult___ for everyone to complete.",
        userAnswer: "The work was simple for all to finish.",
        correctAnswer: "The assignment was challenging for everyone to finish.",
        options: ["The work was simple for all to finish.", "The assignment was challenging for everyone to finish.", "The job was easy for all to complete."],
        date: "2025-08-02",
        questionType: "sentence"
      },
      {
        id: 5,
        question: "Choose the word that means the same as 'happy':",
        userAnswer: "sad",
        correctAnswer: "joyful",
        options: ["sad", "joyful", "angry"],
        date: "2025-08-01",
        questionType: "synonym"
      }
    ];
    setReviewQuestions(testReviewQuestions);
  }, [setReviewQuestions, scrollToTop]);

  // 퀴즈 시작
  const startReview = () => {
    setReviewMode(REVIEW_MODES.QUIZ);
    setCurrentReviewIndex(0);
    setReviewSelectedAnswer('');
    setReviewShowResult(false);
  };

  // 답안 제출
  const submitReviewAnswer = () => {
    setReviewShowResult(true);
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

  // API: 문제 정답 처리 시 복습 목록에서 제거
  // const handleCorrectAnswer = async (questionId) => {
  //   try {
  //     const response = await fetch(`http://localhost:8080/api/review/questions/${questionId}/correct`, {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });
  //     
  //     if (response.ok) {
  //       setReviewQuestions(prev => prev.filter(q => q.id !== questionId));
  //     }
  //   } catch (error) {
  //     console.error('정답 처리 실패:', error);
  //   }
  // };

  // API: 복습 문제 새로고침
  // const refreshReviewQuestions = async () => {
  //   try {
  //     const response = await fetch('http://localhost:8080/api/review/wrong-questions', {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });
  //     
  //     if (response.ok) {
  //       const data = await response.json();
  //       setReviewQuestions(data.questions || []);
  //     }
  //   } catch (error) {
  //     console.error('복습 문제 새로고침 실패:', error);
  //   }
  // };

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

    // 임시로 해당 유형 문제들만 설정
    setReviewQuestions(filteredQuestions);
    setReviewMode(REVIEW_MODES.QUIZ);
    setCurrentReviewIndex(0);
    setReviewSelectedAnswer('');
    setReviewShowResult(false);

    // 복습 완료 후 원래 문제들로 복구하는 로직은 별도 구현 필요
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
    <div className="h-screen overflow-y-auto !p-4 !sm:p-6 !space-y-6">
      {/* Header */}
      <div className="!space-y-2">
        <h1 className="text-2xl font-bold text-gray-800">📝 복습하기</h1>
        <p className="text-gray-600">
          틀린 문제들을 복습하고 실력을 향상시키세요
        </p>
      </div>

      {/* 복습할 문제가 없을 때 메시지 표시 */}
      {reviewNoDataMessage && (
        <div className="text-center !py-12">
          <div className="!space-y-4">
            <div className="text-6xl">📚</div>
            <h2 className="text-xl font-semibold text-gray-700">{reviewNoDataMessage}</h2>
            <p className="text-gray-500">더 많은 문제를 맞춰서 복습 문제를 만들어보세요!</p>
            <button 
              onClick={() => window.location.href = '/dashboard/study'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              학습하러 가기
            </button>
          </div>
        </div>
      )}

      {/* 복습 문제가 있을 때만 표시 */}
      {!reviewNoDataMessage && (
        <>
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
        </>
      )}
    </div>
  );
}