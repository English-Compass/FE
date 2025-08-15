import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useApp } from '../../context/AppContext';

export function Word({ 
  question, 
  selectedAnswer, 
  showResult, 
  onAnswerSelect 
}) {
  const { REVIEW_MESSAGES } = useApp();
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <Card className="w-full max-w-4xl !px-4 !py-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="outline">{question.category}</Badge>
          <Badge variant="secondary">{question.date}</Badge>
        </div>
        <CardTitle className="text-lg leading-relaxed !mt-4">
          {question.question}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="!space-y-4">
        {/* 이전 틀린 답안 - 답변 후에만 표시 */}
        {showResult && (
          <div className="bg-red-50 !p-3 rounded-lg border border-red-200">
            <p className="text-sm text-red-700">
              <span className="font-medium">이전 틀린 답안:</span> {question.userAnswer}
            </p>
          </div>
        )}

        {/* 답변 옵션 */}
        <div className="!space-y-2">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswerSelect(option)}
              disabled={showResult}
              className={`w-full !p-4 text-left rounded-lg border-2 transition-all ${
                selectedAnswer === option
                  ? showResult
                    ? option === question.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : 'border-red-500 bg-red-50 text-red-800'
                    : 'border-blue-500 bg-blue-50'
                  : showResult && option === question.correctAnswer
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center !space-x-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswer === option
                    ? showResult
                      ? option === question.correctAnswer
                        ? 'border-green-500 bg-green-500'
                        : 'border-red-500 bg-red-500'
                      : 'border-blue-500 bg-blue-500'
                    : showResult && option === question.correctAnswer
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300'
                }`}>
                  {(selectedAnswer === option || (showResult && option === question.correctAnswer)) && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                  )}
                </div>
                <span className="font-medium">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* 결과 */}
        {showResult && (
          <div className={`!p-4 rounded-lg ${
            isCorrect 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center !space-x-2 !mb-2">
              {isCorrect ? (
                <>
                  <span className="text-2xl">{REVIEW_MESSAGES.CORRECT.emoji}</span>
                  <span className="font-semibold text-green-800">{REVIEW_MESSAGES.CORRECT.title}</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">{REVIEW_MESSAGES.INCORRECT.emoji}</span>
                  <span className="font-semibold text-red-800">{REVIEW_MESSAGES.INCORRECT.title}</span>
                </>
              )}
            </div>
            <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect 
                ? REVIEW_MESSAGES.CORRECT.description
                : REVIEW_MESSAGES.INCORRECT.description(question.correctAnswer)
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}