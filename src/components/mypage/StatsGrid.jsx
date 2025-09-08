import React from 'react';
import { Card, CardContent } from '../../components/ui/card';

export default function StatsGrid({ studyProgress, monthlyStats, loading }) {
  if (loading) {
    return (
      <div className="!mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((index) => (
          <Card key={index}>
            <CardContent className="!mt-3 !p-4 text-center">
              <div className="text-3xl font-bold !mb-1 text-gray-300">---</div>
              <div className="text-sm text-gray-400">로딩 중...</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="!mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="!mt-3 !p-4 text-center">
          <div className="text-3xl font-bold !mb-1">{monthlyStats.totalMinutes || 0}</div>
          <div className="text-sm text-gray-600">총 학습시간(분)</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="!mt-3 !p-4 text-center">
          <div className="text-3xl font-bold !mb-1">{monthlyStats.averageAccuracy || 0}%</div>
          <div className="text-sm text-gray-600">평균 정답률</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="!mt-3 !p-4 text-center">
          <div className="text-3xl font-bold !mb-1">{monthlyStats.completedLessons || 0}</div>
          <div className="text-sm text-gray-600">완료한 레슨</div>
        </CardContent>
      </Card>
    </div>
  );
}