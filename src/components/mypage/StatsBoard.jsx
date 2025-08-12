// src/components/mypage/stats/StatsBoard.js
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Clock } from 'lucide-react';

export default function StatsBoard({ studyStats, weeklyHours }) {
  return (
    <Card className="stats-board">
      <CardHeader>
        <CardTitle className="stats-board__title">
          <Clock className="stats-board__title-icon" />
          <span>학습 시간 통계</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="stats-board__content">
        <div className="stats-board__content-total">
            <div className="stats-board__content-total-item">
                <div className="stats-board__content-total-item-value">{studyStats.totalHours}시간</div>
                <p className="stats-board__content-total-item-label">총 학습 시간</p>
            </div>
            <div className="stats-board__content-total-item">
                <div className="stats-board__content-total-item-value">
                {(studyStats.totalHours / 7).toFixed(1)}시간
                </div>
                <p className="stats-board__content-total-item-label">일평균 학습 시간</p>
            </div>
        </div>
        <div className="stats-board__content-weekly">
            <h4 className="stats-board__content-weekly-title">이번 주 학습 시간</h4>
            <div className="stats-board__content-weekly-chart">
                {weeklyHours.map((day, index) => (
                <div key={index} className="day-item">
                    <div className="day-label">{day.day}</div>
                    <div className="day-bar">
                    <div className="day-value">{day.hours}h</div>
                    </div>
                </div>
                ))}
            </div>
        </div>
        <div className="stats-board__analysis">
            <h4 className="stats-board__analysis-title">📊 이번 주 분석</h4>
            {/* ... (JSX for weekly analysis) ... */}
        </div>
      </CardContent>
    </Card>
  );
}
// Note: For brevity, the detailed JSX within CardContent is omitted but should be pasted from your original file.