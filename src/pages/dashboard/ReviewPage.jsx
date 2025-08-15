import React, { useEffect } from 'react';
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
    REVIEW_MODES
  } = useApp();

  // 컴포넌트 마운트 시 복습 문제 데이터 로드
  useEffect(() => {
    // TODO: 실제 프로덕션에서는 아래의 API 호출로 대체
    // const fetchReviewQuestions = async () => {
    //   try {
    //     const response = await fetch('/api/review/wrong-questions', {
    //       method: 'GET',
    //       headers: {
    //         'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //         'Content-Type': 'application/json'
    //       }
    //     });
    //     const data = await response.json();
    //     setReviewQuestions(data.questions);
    //   } catch (error) {
    //     console.error('복습 문제 로드 실패:', error);
    //   }
    // };
    // fetchReviewQuestions();

    // 임시 테스트 데이터 (개발용)
    const testReviewQuestions = [
      {
        id: 1,
        question: "What does 'comprehensive' mean?",
        userAnswer: "simple",
        correctAnswer: "complete and thorough",
        options: ["simple", "complete and thorough", "expensive", "quick"],
        date: "2025-08-05",
        category: "word"
      },
      {
        id: 2,
        question: "Fill in the blank: I _____ to the store yesterday.",
        userAnswer: "go",
        correctAnswer: "went",
        options: ["go", "went", "going", "gone"],
        date: "2025-08-04",
        category: "sentence"
      },
      {
        id: 3,
        question: "Choose the correct sentence:",
        userAnswer: "He don't like coffee",
        correctAnswer: "He doesn't like coffee",
        options: ["He don't like coffee", "He doesn't like coffee", "He not like coffee", "He no like coffee"],
        date: "2025-08-03",
        category: "sentence"
      }
    ];
    setReviewQuestions(testReviewQuestions);
  }, [setReviewQuestions]);

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

  // TODO: 향후 구현 예정 - 문제 정답 처리 시 복습 목록에서 제거
  // const handleCorrectAnswer = async (questionId) => {
  //   try {
  //     await fetch(`/api/review/questions/${questionId}/correct`, {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });
  //     setReviewQuestions(prev => prev.filter(q => q.id !== questionId));
  //   } catch (error) {
  //     console.error('정답 처리 실패:', error);
  //   }
  // };

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
    <div className="!p-4 !sm:p-6 !space-y-6">
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
      />

      {/* 리뷰 문제 목록 */}
      <ReviewList 
        reviewQuestions={reviewQuestions}
        onQuestionRetry={handleQuestionRetry}
      />
    </div>
  );
}