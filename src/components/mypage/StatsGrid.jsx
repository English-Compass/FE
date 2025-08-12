import React from 'react';
import { Card, CardContent } from '../../components/ui/card';

export default function StatsGrid({ studyProgress, monthlyStats }) {
  return (
    <div className="stats-grid">
      <Card>
        <CardContent className="stats-grid__content">
          <div className="stats-grid__content-value">{studyProgress.completed || 0}</div>
          <div className="stats-grid__content-label">연속 학습일</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="stats-grid__content">
          <div className="stats-grid__content-value">{monthlyStats.totalMinutes}</div>
          <div className="stats-grid__content-label">총 학습시간(분)</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="stats-grid__content">
          <div className="stats-grid__content-value">{monthlyStats.averageAccuracy}%</div>
          <div className="stats-grid__content-label">평균 정답률</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="stats-grid__content">
          <div className="stats-grid__content-value">{monthlyStats.completedLessons}</div>
          <div className="stats-grid__content-label">완료한 레슨</div>
        </CardContent>
      </Card>
    </div>
  );
}