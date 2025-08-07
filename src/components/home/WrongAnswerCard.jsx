import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function WrongAnswerCard({ navigate }) {
  const wrongQuizzes = [
    { id: 1, question: "What does 'comprehensive' mean?", options: ['simple', 'complete and thorough', 'expensive', 'quick'] },
    { id: 2, question: "Fill in the blank: I _____ to the store yesterday.", options: ['go', 'went', 'going', 'gone'] }
  ];
  return (
    <Card className="wrong-quiz-card">
      <CardHeader>
        <CardTitle className="wrong-quiz-title">
          <span>❌</span>
          <span>오답 퀴즈</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="wrong-quiz-description">
        <p>틀렸던 문제들을 다시 풀어보세요</p>
        {wrongQuizzes.map((quiz, index) => (
        <div key={quiz.id} className="wrong-quiz-item">
  <p className="wrong-quiz-question">
    Q{index + 1}. {quiz.question}
  </p>
  <div className="wrong-quiz-options">
    {quiz.options.slice(0, 2).map((option, optIndex) => (
      <Badge key={optIndex} variant="secondary">
        {option}
      </Badge>
    ))}
    <Badge variant="secondary">...</Badge>
  </div>
</div>
    ))}
<Badge variant="destructive" className="wrong-quiz-badge">
  {wrongQuizzes.length}문제 대기 중
</Badge>
        <Button
          variant="outline"
          size="sm"
          className="wrong-quiz-button"
          onClick={() => navigate('/dashboard/review')}
        >
          오답 풀기
        </Button>
      </CardContent>
    </Card>
  );
}