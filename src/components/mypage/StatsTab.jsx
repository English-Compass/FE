import React from 'react';
import { useApp } from '../../context/AppContext';
import StatsGrid from './StatsGrid';
import StatsBoard from './StatsBoard';

export default function StatsTab() {
  const { studyProgress } = useApp();

  // Mock data can live here or be passed from a higher level
  const monthlyStats = {
    totalMinutes: 680,
    averageAccuracy: 87,
    completedLessons: 45,
  };
  const studyStats = { totalHours: 24.5 };
  const weeklyHours = [
    { day: 'Mon', hours: 2.5 }, { day: 'Tue', hours: 3.0 }, { day: 'Wed', hours: 2.0 },
    { day: 'Thu', hours: 4.5 }, { day: 'Fri', hours: 5.0 }, { day: 'Sat', hours: 3.5 },
    { day: 'Sun', hours: 4.0 }
  ];

  return (
    <>
      <StatsGrid studyProgress={studyProgress} monthlyStats={monthlyStats} />
      <StatsBoard studyStats={studyStats} weeklyHours={weeklyHours} />
    </>
  );
}