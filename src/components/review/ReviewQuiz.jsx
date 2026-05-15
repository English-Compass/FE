import React from 'react';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';

import { Word } from '../question-types/Word';
import { Sentence } from '../question-types/Sentence';
import { Conversation } from '../question-types/Conversation';

export function ReviewQuiz({ 
  question, 
  currentIndex, 
  totalQuestions, 
  selectedAnswer, 
  showResult, 
  onAnswerSelect, 
  onSubmit, 
  onNext, 
  onBackToList 
}) {
  const safeTotal = totalQuestions > 0 ? totalQuestions : 1;
  const progress = ((currentIndex + 1) / safeTotal) * 100;

  
  // 문제 타입에 따른 컴포넌트 매핑
  const getQuestionComponent = () => {
    const questionType = question.questionType || question.category || question.type || 'word';
    
    const commonProps = {
      question,
      selectedAnswer,
      showResult,
      onAnswerSelect
    };
    
    switch (questionType) {
      case 'word':
        return <Word {...commonProps} />;
      case 'sentence':
        return <Sentence {...commonProps} />;
      case 'conversation':
        return <Conversation {...commonProps}/>;
      default:
        return <Word {...commonProps} />; // 기본값
    }
  };

  return (
    <div className="!p-4 !sm:p-6 !space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">📝 복습 퀴즈</h1>
                <p className="text-lg text-gray-600">
                {currentIndex + 1} / {totalQuestions} 문제
                </p>
            </div>
            <Button
                variant="outline"
                onClick={onBackToList}
            >
                목록으로 돌아가기
            </Button>
          </div>
          
          {/* 진행도 바 */}
          <div className="w-full">
            <div className="flex items-center justify-between text-sm text-gray-600 !mb-2">
              <span>진행률</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3 w-full" />
          </div>
        </div>

      
        <div className="flex flex-col items-center !pt-4 !space-y-8">
        {/* 동적 문제 컴포넌트 */}
        {getQuestionComponent()}
        
        {/* 버튼 */}  
        {!showResult ? (
            <Button 
            onClick={onSubmit}
            disabled={!selectedAnswer}
            className="w-1/2 !px-4 !py-6 bg-blue-600 hover:bg-blue-700 text-white"
            >
            답안 제출
            </Button>
        ) : (
            <Button 
            onClick={onNext}
            className="w-1/2 !px-4 !py-6 bg-green-600 hover:bg-green-700 text-white"
            >
            {currentIndex < safeTotal - 1 ? '다음 문제' : '복습 완료'}
            </Button>
        )}
        </div>
    </div>
  );
}