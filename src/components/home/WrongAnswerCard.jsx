import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export function WrongAnswerCard({ navigate }) {
  const [wrongQuizzes, setWrongQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // API: 서버에서 사용자가 틀린 문제 목록을 가져옵니다.
  useEffect(() => {
    const fetchWrongAnswers = async () => {
      try {
        // 오답노트 세션 생성을 위한 API 호출 (실제로는 기존 오답 문제들을 조회)
        const response = await fetch('http://localhost:8080/api/learning-sessions/wrong-answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: 'user_123',
            sessionType: 'WRONG_ANSWER_REVIEW',
            metadata: {
              questionCount: 5
            }
          })
        });

        if (response.ok) {
          const sessionData = await response.json();
          const sessionId = sessionData.sessionId;
          
          // 세션의 문제들 조회
          const questionsResponse = await fetch(`http://localhost:8080/api/learning-sessions/${sessionId}/questions`);
          
          if (questionsResponse.ok) {
            const sessionQuestions = await questionsResponse.json();
            const formattedQuizzes = sessionQuestions.slice(0, 2).map(sq => ({
              id: sq.question.questionId,
              question: sq.question.content,
              options: sq.question.choices || ['옵션 1', '옵션 2', '옵션 3', '옵션 4']
            }));
            setWrongQuizzes(formattedQuizzes);
          }
        }
      } catch (error) {
        console.error('오답 문제 조회 실패:', error);
        // 실패 시 더미 데이터 사용
        setWrongQuizzes([
          { id: 1, question: "What does 'comprehensive' mean?", options: ['simple', 'complete and thorough', 'expensive', 'quick'] },
          { id: 2, question: "Fill in the blank: I _____ to the store yesterday.", options: ['go', 'went', 'going', 'gone'] }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWrongAnswers();
  }, []);
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>❌</span>
            <span>오답 퀴즈</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center !py-8">
          <p>오답 문제 로딩 중...</p>
        </CardContent>
      </Card>
    );
  }

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