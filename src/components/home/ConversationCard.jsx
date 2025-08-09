import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export function ConversationCard({ user, navigate }) {
  const conversationTopics = [
    '면접 상황', '레스토랑', '여행 상황', '비즈니스 미팅'
  ];
  return (
    <Card className="conversation-card">
      <CardHeader>
        <CardTitle className="conversation-title">
          <span>💬</span>
          <span>회화 학습</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="conversation-description">
        <p>AI와 함께 실전 회화를 연습하세요</p>
        <div className="conversation-topics">
          {conversationTopics.map((topic) => (
            <Badge key={topic} variant="outline" className="conversation-topic">
              {topic}
            </Badge>
          ))}
        </div>
        <Badge variant="outline" className="conversation-level">Level {user?.level}</Badge>
        <Button
          variant="outline"
          size="sm"
          className="conversation-button"
          onClick={() => navigate('/dashboard/conversation')}
        >
          회화 시작
        </Button>
      </CardContent>
    </Card>
  );
}