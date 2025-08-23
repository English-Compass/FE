import React from 'react';
import { Card, CardContent } from '../../components/ui/card';

export default function StatsGrid({ studyProgress, monthlyStats }) {
  return (
    <div className="!mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="!mt-3 !p-4 text-center">
          <div className="text-3xl font-bold !mb-1">{studyProgress.completed || 0}</div>
          <div className="text-sm text-gray-600">연속 학습일</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="!mt-3 !p-4 text-center">
          <div className="text-3xl font-bold !mb-1">{monthlyStats.totalMinutes}</div>
          <div className="text-sm text-gray-600">총 학습시간(분)</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="!mt-3 !p-4 text-center">
          <div className="text-3xl font-bold !mb-1">{monthlyStats.averageAccuracy}%</div>
          <div className="text-sm text-gray-600">평균 정답률</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="!mt-3 !p-4 text-center">
          <div className="text-3xl font-bold !mb-1">{monthlyStats.completedLessons}</div>
          <div className="text-sm text-gray-600">완료한 레슨</div>
        </CardContent>
      </Card>
    </div>
  );
}