import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { createReviewSession } from '../../services/api.js';
import { useApp } from '../../context/AppContext';

export function ReviewQuizCard({ quiz, navigate }) {
  const { user, formData, buildSessionMetadata } = useApp();

  return (
    <Card>
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
          onClick={async () => {
            try {
              const userId = user?.id;
              if (!userId) {
                alert('로그인이 필요합니다.');
                return;
              }

              const sessionMetadata = buildSessionMetadata({
                keywords: formData?.keywords || [],
                selectedCategories: formData?.selectedCategories || [],
                level: formData?.level || 'B',
                questionCount: quiz?.length > 0 ? quiz.length : 5
              });

              // 복습세션 생성
              const session = await createReviewSession({ 
                userId,
                sessionMetadata
              });
              
              if (session.sessionId) {
                navigate(`/dashboard/review?sessionId=${session.sessionId}&type=review`);
              } else {
                navigate('/dashboard/review');
              }
            } catch (error) {
              console.error('복습세션 생성 실패:', error);
              // 사용자에게 구체적인 에러 메시지 표시
              if (error.message.includes('422')) {
                alert('복습할 문제가 없습니다. 먼저 문제를 풀어주세요!');
              } else {
                alert(`복습세션 생성 실패: ${error.message}`);
              }
              // 실패 시 기본 리뷰 페이지로
              navigate('/dashboard/review');
            }
          }}
        >
          복습 퀴즈 풀러가기
        </Button>
      </CardContent>
    </Card>
  );
}