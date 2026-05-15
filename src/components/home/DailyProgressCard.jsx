import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Progress } from '../ui/Progress';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useNavigate } from 'react-router-dom';

export function DailyProgressCard({ studyProgress, dailyActivity, loading }) {
  const navigate = useNavigate();

  // 실제 학습 시간을 기반으로 진행률 계산
  const actualStudyTime = dailyActivity?.studyTimeMinutes || 0;
  const dailyGoal = studyProgress.dailyGoal || 30; // 기본 목표 30분
  const progressPercentage = Math.min((actualStudyTime / dailyGoal) * 100, 100);

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-blue-600 to-purple-500">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>오늘의 학습 진행률</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex justify-center items-center h-20">
            <span className="text-white/80">데이터를 불러오는 중...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-purple-500">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>오늘의 학습 진행률</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex justify-end text-lg/8">
          <span>오늘의 학습 시간 {actualStudyTime}분</span>
        </div>
        <Progress value={progressPercentage} className="!bg-white/20" />
        <Button onClick={() => navigate('/dashboard/study')} className="!bg-white/20 !border border-white/30">
          🚀 학습 시작하기
        </Button>
      </CardContent>
    </Card>
  );
}