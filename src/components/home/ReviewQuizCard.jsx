import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export function ReviewQuizCard({ quiz, navigate }) {

  return (
    <Card className="review-quiz-card">
      <CardHeader>
        <CardTitle className="review-quiz-title">
          <span>🔄</span>
          <span>복습 퀴즈</span>
          <Badge variant="outline">{quiz.length}문제</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="review-quiz-description">
        <p>이전에 학습한 내용을 복습해보세요</p>
        {quiz.slice(0, 2).map((q, index) => (
          <div key={q.id} className="review-quiz-item">
            <p className="review-quiz-question">
              Q{index + 1}. {q.question}
            </p>
            <div className="review-quiz-options">
              {q.options.slice(0, 2).map((option, optIndex) => (
                <Badge key={optIndex} variant="secondary" className="review-quiz-option">
                  {option}
                </Badge>
              ))}
              <Badge variant="secondary" className="review-quiz-option">...</Badge>
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          className="review-quiz-more-button"
          onClick={() => navigate('/dashboard/review')}
        >
          복습 퀴즈 풀러가기
        </Button>
      </CardContent>
    </Card>
  );
}