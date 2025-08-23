import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export function WrongAnswerCard({ navigate }) {
  const wrongQuizzes = [
    { id: 1, question: "What does 'comprehensive' mean?", options: ['simple', 'complete and thorough', 'expensive', 'quick'] },
    { id: 2, question: "Fill in the blank: I _____ to the store yesterday.", options: ['go', 'went', 'going', 'gone'] }
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>❌</span>
          <span>오답 퀴즈</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-lg text-gray-600 !p-4 flex flex-col gap-2">
        <p>틀렸던 문제들을 다시 풀어보세요</p>
        {wrongQuizzes.map((quiz, index) => (
        <div key={quiz.id} className="!p-4 bg-red-50 border border-red-200 rounded-lg">
  <p className="text-lg text-gray-600 !mb-3">
    Q{index + 1}. {quiz.question}
  </p>
  <div className="flex gap-2">
    {quiz.options.slice(0, 2).map((option, optIndex) => (
      <Badge key={optIndex} variant="secondary">
        {option}
      </Badge>
    ))}
    <Badge variant="secondary">...</Badge>
  </div>
</div>
    ))}
{/* <Badge variant="destructive" className="!mb-4">
  {wrongQuizzes.length}문제 대기 중
</Badge> */}
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => navigate('/dashboard/review')}
        >
          오답 풀기
        </Button>
      </CardContent>
    </Card>
  );
}