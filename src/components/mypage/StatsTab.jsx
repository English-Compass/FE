import React from 'react';
import { useApp } from '../../context/AppContext';
import StatsGrid from './StatsGrid';
import StatsBoard from './StatsBoard';

export default function StatsTab({ weeklyStats, loading }) {
  const { studyProgress, monthlyStats, studyStats, weeklyHours } = useApp();

  // 주간 학습량 API 데이터에서 통계 정보 추출
  const getStatsFromWeeklyData = () => {
    if (!weeklyStats || !weeklyStats.length || weeklyStats.length === 0) {
      return {
        totalLearningTimeMinutes: 0,
        averageAccuracy: 0,
        completedSessions: 0,
        consecutiveDays: 0
      };
    }

    const data = weeklyStats[0]; // 첫 번째 주차 데이터 사용
    return {
      totalLearningTimeMinutes: data.totalLearningTimeSeconds ? Math.round(data.totalLearningTimeSeconds / 60) : 0,
      averageAccuracy: data.accuracyRate || 0,
      completedSessions: data.completedSessions || 0,
      consecutiveDays: 0 // 연속 학습일은 현재 API에서 제공하지 않음
    };
  };


  const statsData = getStatsFromWeeklyData();

  return (
    <>
      <StatsGrid 
        studyProgress={studyProgress} 
        monthlyStats={{
          ...monthlyStats,
          totalMinutes: statsData.totalLearningTimeMinutes,
          averageAccuracy: Math.round(statsData.averageAccuracy),
          completedLessons: statsData.completedSessions,
          consecutiveDays: statsData.consecutiveDays
        }} 
        loading={loading}
      />
      <StatsBoard 
        studyStats={studyStats} 
        weeklyHours={weeklyHours} 
        weeklyStats={weeklyStats}
        loading={loading}
      />
    </>
  );
}