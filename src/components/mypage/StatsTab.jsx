import React from 'react';
import { useApp } from '../../context/AppContext';
import StatsGrid from './StatsGrid';
import StatsBoard from './StatsBoard';

export default function StatsTab() {
  const { studyProgress, monthlyStats, studyStats, weeklyHours } = useApp();

  return (
    <>
      <StatsGrid studyProgress={studyProgress} monthlyStats={monthlyStats} />
      <StatsBoard studyStats={studyStats} weeklyHours={weeklyHours} />
    </>
  );
}