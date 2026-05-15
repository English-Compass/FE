import React, { useEffect, useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import ProfileTab from '../../components/mypage/ProfileTab';
import StatsTab from '../../components/mypage/StatsTab';
import CalendarTab from '../../components/mypage/CalendarTab';
import { useApp } from '../../context/AppContext';
import '../../styles/components/_mypage.scss';

export default function MyPage() {
  const { user, setUser, scrollToTop } = useApp();
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오는 함수
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // 주간 학습량 통계 데이터 가져오기
  const fetchWeeklyStats = useCallback(async () => {
    console.log('🚀 [MyPage] fetchWeeklyStats 함수 호출됨');

    const userId = user?.id;
    if (!userId) {
      console.log('User ID not available, skipping weekly stats fetch');
      setStatsLoading(false);
      return;
    }

    try {
      setStatsLoading(true);
      const today = getTodayDate();
      const apiUrl = `/api/analysis/users/${userId}/weekly-stats/recent?weeks=1`;
      
      console.log('📊 [MyPage WeeklyStats API] 요청 시작:', {
        userId,
        weekStartDate: today,
        apiUrl,
        timestamp: new Date().toISOString()
      });
      
      const response = await fetch(apiUrl, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ [MyPage WeeklyStats API] 응답 성공:', {
          userId,
          weeklyStats: data,
          timestamp: new Date().toISOString()
        });
        
        setWeeklyStats(data);
      } else {
        console.error('❌ [MyPage WeeklyStats API] 응답 실패:', {
          userId,
          status: response.status,
          statusText: response.statusText,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('🚨 [MyPage WeeklyStats API] 요청 에러:', {
        userId,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    } finally {
      setStatsLoading(false);
      console.log('🏁 [MyPage WeeklyStats API] 요청 완료:', {
        userId,
        timestamp: new Date().toISOString()
      });
    }
  }, [user?.id]);

  useEffect(() => {
    scrollToTop();
  }, [scrollToTop]);

  useEffect(() => {
    // URL에 토큰과 사용자 정보가 있으면 저장 (백엔드에서 직접 리다이렉트된 경우)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userId = urlParams.get('userId');
    const username = urlParams.get('username');
    const profileImage = urlParams.get('profileImage');
    
    if (token && userId && username) {
      console.log('MyPage - URL에서 사용자 정보 발견, 저장 중...');
      
      // 토큰 저장
      localStorage.setItem('jwt_token', token);
      sessionStorage.setItem('jwt_token', token);
      
      // 사용자 정보 저장 (전역 상태에만 저장, localStorage에 저장하지 않음)
      const decodedUsername = decodeURIComponent(username || '');
      const decodedProfileImage = decodeURIComponent(profileImage || '');
      
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

  useEffect(() => {
    if (!user?.id) {
      console.log('⏳ [MyPage] 사용자 ID를 기다리는 중...');
      return;
    }

    // 주간 학습량 통계 데이터 가져오기
    console.log('🔄 [MyPage] 사용자 ID 변경으로 fetchWeeklyStats 호출');
    fetchWeeklyStats();
  }, [user?.id, fetchWeeklyStats]);

  // 통계 탭이 선택될 때 API 호출
  useEffect(() => {
    if (activeTab === 'stats') {
      console.log('📊 [MyPage] 통계 탭 선택됨 - API 호출');
      fetchWeeklyStats();
    }
  }, [activeTab, fetchWeeklyStats]);

  return (
    <div className="min-h-screen !p-4 !sm:p-6 !space-y-6">
      <div className="!space-y-2">
        <h1 className='text-3xl font-bold text-gray-800'>👤 마이페이지</h1>
        <p className="text-gray-600">프로필과 학습 현황을 관리하세요</p>
      </div>

      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid !w-full grid-cols-3">
          <TabsTrigger value="profile">프로필</TabsTrigger>
          <TabsTrigger value="stats">통계</TabsTrigger>
          <TabsTrigger value="calendar">학습 달력</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>

        <TabsContent value="stats">
          <StatsTab 
            weeklyStats={weeklyStats}
            loading={statsLoading}
          />
        </TabsContent>

        <TabsContent value="calendar">
          <CalendarTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}