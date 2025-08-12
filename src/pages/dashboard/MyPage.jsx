import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import ProfileTab from '../../components/mypage/ProfileTab';
import StatsTab from '../../components/mypage/StatsTab';
import CalendarTab from '../../components/mypage/CalendarTab';
import '../../styles/components/_mypage.scss';

export default function MyPage() {
  return (
    <div className="my-page">
      <div className="my-page__header">
        <h1>👤 마이페이지</h1>
        <p>프로필과 학습 현황을 관리하세요</p>
      </div>

      <Tabs defaultValue="profile" className="my-page__tabs">
        <TabsList className="my-page__tabs-list">
          <TabsTrigger value="profile">프로필</TabsTrigger>
          <TabsTrigger value="stats">통계</TabsTrigger>
          <TabsTrigger value="calendar">학습 달력</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>

        <TabsContent value="stats">
          <StatsTab />
        </TabsContent>

        <TabsContent value="calendar">
          <CalendarTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}