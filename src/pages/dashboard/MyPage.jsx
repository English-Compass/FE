import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import ProfileTab from '../../components/mypage/ProfileTab';
import StatsTab from '../../components/mypage/StatsTab';
import CalendarTab from '../../components/mypage/CalendarTab';
import { useApp } from '../../context/AppContext';
import '../../styles/components/_mypage.scss';

export default function MyPage() {
  const { scrollToTop } = useApp();

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <div className="!p-4 !sm:p-6 !space-y-6">
      <div className="!space-y-2">
        <h1 className='text-3xl font-bold text-gray-800'>👤 마이페이지</h1>
        <p className="text-gray-600">프로필과 학습 현황을 관리하세요</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid !w-full grid-cols-3">
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