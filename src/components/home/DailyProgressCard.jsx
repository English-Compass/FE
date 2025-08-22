import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useNavigate } from 'react-router-dom';

export function DailyProgressCard({ studyProgress }) {
  const navigate = useNavigate();
  const progressPercentage = (studyProgress.completed / studyProgress.dailyGoal) * 100;

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-500">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>오늘의 학습 진행률</span>
          <Badge variant="secondary" className="!bg-white/70">
            {studyProgress.streak}일 연속
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex justify-between text-lg/8">
          <span>목표: {studyProgress.dailyGoal}분</span>
          <span>{studyProgress.completed}분 / {studyProgress.dailyGoal}분</span>
        </div>
        <Progress value={progressPercentage} className="!bg-white/20" />
        <Button onClick={() => navigate('/dashboard/study')} className="!bg-white/20 !border border-white/30">
          🚀 학습 시작하기
        </Button>
      </CardContent>
    </Card>
  );
}