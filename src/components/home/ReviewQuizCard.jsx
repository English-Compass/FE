import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export function ReviewQuizCard({ quiz, navigate }) {

  return (
    <Card className="bg-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🔄</span>
          <span>복습 퀴즈</span>
          <Badge variant="outline">{quiz.length}문제</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-lg text-gray-600 !p-4 flex flex-col gap-2">
        <p>이전에 학습한 내용을 복습해보세요</p>
        {quiz.slice(0, 2).map((q, index) => (
          <div key={q.id} className="!p-4 bg-gray-50 border border-gray-300 rounded-lg">
            <p className="text-lg text-gray-600 !mb-3">
              Q{index + 1}. {q.question}
            </p>
            <div className="flex gap-2">
              {q.options.slice(0, 2).map((option, optIndex) => (
                <Badge key={optIndex} variant="secondary">
                  {option}
                </Badge>
              ))}
                <Badge variant="secondary">...</Badge>
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => navigate('/dashboard/review')}
        >
          복습 퀴즈 풀러가기
        </Button>
      </CardContent>
    </Card>
  );
}