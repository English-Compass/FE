import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import ProfileTab from '../../components/mypage/ProfileTab';
import StatsTab from '../../components/mypage/StatsTab';
import CalendarTab from '../../components/mypage/CalendarTab';
import { useApp } from '../../context/AppContext';
import '../../styles/components/_mypage.scss';

export default function MyPage() {
  const { user, setUser, scrollToTop } = useApp();

  useEffect(() => {
    scrollToTop();
    
    // URL에 토큰과 사용자 정보가 있으면 저장 (백엔드에서 직접 리다이렉트된 경우)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userId = urlParams.get('userId');
    const username = urlParams.get('username');
    const profileImage = urlParams.get('profileImage');
    
    if (token && userId && username) {
      console.log('MyPage - URL에서 사용자 정보 발견, 저장 중...');
      
      // 토큰 저장
      localStorage.setItem('token', token);
      sessionStorage.setItem('token', token);
      
      // 사용자 정보 저장
      const decodedUsername = decodeURIComponent(username || '');
      const decodedProfileImage = decodeURIComponent(profileImage || '');
      
      localStorage.setItem('user', JSON.stringify({
        userId: userId === 'null' ? null : userId,
        username: decodedUsername,
        profileImage: decodedProfileImage
      }));
      
      // AppContext 업데이트
      const userData = {
        id: userId === 'null' ? null : userId,
        name: decodedUsername,
        profileImage: decodedProfileImage,
        level: 'B',
        joinDate: '2024-01-15',
        streak: 7
      };
      
      setUser(userData);
      
      // URL에서 쿼리 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [setUser]);

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