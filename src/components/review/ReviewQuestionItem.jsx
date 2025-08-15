import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useApp } from '../../context/AppContext';

export function ReviewQuestionItem({ question, onRetry, showCategory = true }) {
  const { QUESTION_TYPE_MAPPING } = useApp();
  
  return (
    <Card className="!border-l-4 border-gray-400 hover:shadow-md transition-shadow">
      <CardContent className="!p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 !space-y-2">
            {showCategory && (
              <Badge variant="outline" className="text-xs">
                {QUESTION_TYPE_MAPPING[question.category] || question.category}
              </Badge>
            )}
            <p className="font-medium text-gray-800 leading-relaxed">
              {question.question}
            </p>
            <div className="text-sm text-gray-600 !space-y-4">
              <p>
                <span className="font-medium text-red-600">틀린 답안:</span>{' '}
                <span className="bg-red-50 !px-2 !py-1 rounded text-red-700">
                  {question.userAnswer}
                </span>
              </p>
              {/* <p>
                <span className="font-medium text-green-600">정답:</span>{' '}
                <span className="bg-green-50 !px-2 !py-1 rounded text-green-700">
                  {question.correctAnswer}
                </span>
              </p> */}
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span>📅</span> {question.date}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="!ml-4 shrink-0 hover:bg-blue-50 hover:border-blue-300"
          >
            다시 풀기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
