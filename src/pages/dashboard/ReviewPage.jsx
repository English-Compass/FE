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
    REVIEW_MODES,
    scrollToTop
  } = useApp();

  // 컴포넌트 마운트 시 복습 문제 데이터 로드 및 스크롤 리셋
  useEffect(() => {
    scrollToTop();
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
        questionType: "word"
      },
      {
        id: 2,
        question: "She went to the library to study for her exams.",
        userAnswer: "그녀는 도서관에서 책을 읽었다.",
        correctAnswer: "그녀는 시험 공부를 하기 위해 도서관에 갔다.",
        options: ["그녀는 도서관에서 책을 읽었다.", "그녀는 시험 공부를 하기 위해 도서관에 갔다.", "그녀는 친구와 만나기 위해 도서관에 갔다."],
        date: "2025-08-04",
        questionType: "sentence-interpretation"
      },
      {
        id: 3,
        question: "The weather was _____ cold yesterday.",
        userAnswer: "much",
        correctAnswer: "extremely",
        options: ["much", "extremely", "very much"],
        date: "2025-08-03",
        questionType: "fill-in-blank"
      },
      {
        id: 4,
        question: "The task was ___difficult___ for everyone to complete.",
        userAnswer: "The work was simple for all to finish.",
        correctAnswer: "The assignment was challenging for everyone to finish.",
        options: ["The work was simple for all to finish.", "The assignment was challenging for everyone to finish.", "The job was easy for all to complete."],
        date: "2025-08-02",
        questionType: "synonym-sentence"
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

  // 문제 정답 처리 시 복습 목록에서 제거
  const handleCorrectAnswer = async (questionId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/review/questions/${questionId}/correct`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setReviewQuestions(prev => prev.filter(q => q.id !== questionId));
      }
    } catch (error) {
      console.error('정답 처리 실패:', error);
    }
  };

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
    const originalQuestions = [...reviewQuestions];
    setReviewQuestions(filteredQuestions);
    setReviewMode(REVIEW_MODES.QUIZ);
    setCurrentReviewIndex(0);
    setReviewSelectedAnswer('');
    setReviewShowResult(false);

    // 복습 완료 후 원래 문제들로 복구하는 로직은 별도 구현 필요
  };

  // 복습 문제 새로고침
  const refreshReviewQuestions = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/review/wrong-questions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setReviewQuestions(data.questions || []);
      }
    } catch (error) {
      console.error('복습 문제 새로고침 실패:', error);
    }
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