import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Progress } from '../ui/Progress';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useNavigate } from 'react-router-dom';

export function DailyProgressCard({ studyProgress }) {
  const navigate = useNavigate();
  const progressPercentage = (studyProgress.completed / studyProgress.dailyGoal) * 100;

  return (
    <Card className="daily-progress-card">
      <CardHeader>
        <CardTitle className="card-title-with-badge">
          <span>오늘의 학습 진행률</span>
          <Badge variant="secondary" className="progress-badge">
            {studyProgress.streak}일 연속
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="daily-progress-content">
        <div className="progress-text">
          <span>목표: {studyProgress.dailyGoal}분</span>
          <span>{studyProgress.completed}분 / {studyProgress.dailyGoal}분</span>
        </div>
        <Progress value={progressPercentage} className="progress-bar" />
        <Button onClick={() => navigate('/dashboard/study')} className="progress-start-btn">
          🚀 학습 시작하기
        </Button>
      </CardContent>
    </Card>
  );
}