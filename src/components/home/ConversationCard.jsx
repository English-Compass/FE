import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export function ConversationCard({ user, navigate }) {
  const conversationTopics = [
    '면접 상황', '레스토랑', '여행 상황', '비즈니스 미팅'
  ];
  return (
    <Card className="bg-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>💬</span>
          <span>회화 학습</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-lg !p-4 flex flex-col gap-2">
        <p>AI와 함께 실전 회화를 연습하세요</p>
        <div className="flex gap-2">
          {conversationTopics.map((topic) => (
            <Badge key={topic} variant="outline" className="text-lg !mb-3">
              {topic}
            </Badge>
          ))}
        </div>
        <Badge variant="outline" className="text-lg !mb-3">Level {user?.level}</Badge>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => navigate('/dashboard/conversation')}
        >
          회화 시작
        </Button>
      </CardContent>
    </Card>
  );
}