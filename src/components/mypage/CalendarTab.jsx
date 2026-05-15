import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function LearningCalendarTab() {
  const { user } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newDate);
  };

  // 색상 강도 계산 함수 (activityLevel 또는 questionsAnswered 기준)
  const getColorIntensity = (activityLevel, questionsAnswered) => {
    // activityLevel이 있으면 우선 사용, 없으면 questionsAnswered 사용
    const level = activityLevel !== undefined ? activityLevel : (questionsAnswered > 0 ? Math.min(Math.ceil(questionsAnswered / 5), 4) : 0);
    
    if (level === 0) return '#e5e7eb'; // 회색 (학습 없음) - 더 진하게
    if (level === 1) return '#86efac'; // 연한 녹색 - 더 진하게
    if (level === 2) return '#4ade80'; // 중간 녹색 - 더 진하게
    if (level === 3) return '#22c55e'; // 진한 녹색
    return '#16a34a'; // 가장 진한 녹색 (level 4 이상)
  };

  // API에서 캘린더 데이터 가져오기
  const fetchCalendarData = useCallback(async () => {
    const userId = user?.id;
    
    if (!userId) {
      setError('사용자 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1; // JavaScript month는 0부터 시작
      const apiUrl = `/api/analysis/users/${userId}/calendar-heatmap?year=${year}&month=${month}`;
      
      console.log('📅 [Calendar API] 요청 시작:', {
        userId,
        year,
        month,
        apiUrl,
        timestamp: new Date().toISOString()
      });
      
      const response = await fetch(apiUrl, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ [Calendar API] 응답 성공:', {
          userId,
          calendarData: data,
          timestamp: new Date().toISOString()
        });
        
        setCalendarData(data);
      } else {
        console.error('❌ [Calendar API] 응답 실패:', {
          userId,
          status: response.status,
          statusText: response.statusText,
          timestamp: new Date().toISOString()
        });
        setError('캘린더 데이터를 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('🚨 [Calendar API] 요청 에러:', {
        userId,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      setError('캘린더 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [currentMonth, user?.id]);

  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  // 달력 그리드를 생성하는 함수
  const generateCalendarGrid = (date, apiData) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    const calendarGrid = [];
    
    // 달의 시작 요일 전까지 빈 칸 채우기
    for (let i = 0; i < startDayOfWeek; i++) {
      calendarGrid.push(null);
    }
    
    // API 데이터를 날짜별로 매핑
    const dataByDate = {};
    if (apiData && Array.isArray(apiData)) {
      apiData.forEach(item => {
        const day = parseInt(item.date.split('-')[2]);
        dataByDate[day] = item;
      });
    }
    
    // 해당 월의 날짜 채우기
    for (let day = 1; day <= daysInMonth; day++) {
      const dayData = dataByDate[day];
      const questionsAnswered = dayData?.questionsAnswered || 0;
      const activityLevel = dayData?.activityLevel !== undefined ? dayData.activityLevel : (questionsAnswered > 0 ? Math.min(Math.ceil(questionsAnswered / 5), 4) : 0);
      const hasActivity = dayData?.hasActivity || questionsAnswered > 0;
      
      calendarGrid.push({
        day,
        questionsAnswered: questionsAnswered,
        activityLevel: activityLevel,
        correctAnswers: dayData?.correctAnswers || 0,
        accuracyRate: dayData?.accuracyRate || 0,
        studyTimeMinutes: dayData?.studyTimeMinutes || 0,
        hasActivity: hasActivity
      });
    }
    
    return calendarGrid;
  };

  const calendarGrid = generateCalendarGrid(currentMonth, calendarData);
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // 로딩 상태
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>📅</span>
            <span>학습 달력</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">캘린더 데이터를 불러오는 중...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>📅</span>
            <span>학습 달력</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchCalendarData}
              className="mt-4"
            >
              다시 시도
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="calendar-tab">
          <CardTitle className="calendar-tab-title">
            <span className="calendar-tab-title-icon">📅</span>
            <span className="calendar-tab-title-text">학습 달력</span>
          </CardTitle>
          <div className="calendar-tab-button">
            <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="calendar-tab-button-text">
              {currentMonth.getFullYear()}년 {monthNames[currentMonth.getMonth()]}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* 달력 그리드와 범례 JSX */}
        <div className="calendar-tab-content">
          <div className="calendar-tab-content-grid">
            {dayNames.map((day) => (
              <div key={day} className="calendar-tab-content-grid-item">
                {day}
              </div>
            ))}
          </div>
          {/* 달력 날짜 그리드 */}
          <div className="calendar-tab-content-day">
            {calendarGrid.map((dayData, index) => (
              <div key={index} className="calendar-tab-content-day-item">
                {dayData ? (
                  <div
                    className="calendar-tab-content-day-cell"
                    style={{ 
                      backgroundColor: getColorIntensity(dayData.activityLevel, dayData.questionsAnswered)
                    }}
                    title={dayData.hasActivity 
                      ? `${dayData.day}일: ${dayData.questionsAnswered}문제 풀이, 정답률 ${dayData.accuracyRate?.toFixed(1) || 0}%, 학습시간 ${dayData.studyTimeMinutes || 0}분` 
                      : `${dayData.day}일: 학습 없음`}
                  >
                    <span className={`calendar-tab-content-day-cell-number${
                      !dayData.hasActivity
                      ? ' calendar-tab-content-day-cell-number--inactive' 
                      : ' calendar-tab-content-day-cell-number--active'
                    }`}>
                      {dayData.day}
                    </span>
                  </div>
                ) : (
                  <div className="calendar-tab-content-day-empty"></div>
                )}
              </div>
            ))}
          </div>

          <div className="calendar-tab-legend">
            <div className="calendar-tab-legend-activity">
              <span>적음</span>
              <div className="calendar-tab-legend-activity-scale">
                <div className="calendar-tab-legend-activity-scale-item" style={{backgroundColor: '#e5e7eb'}}></div>
                <div className="calendar-tab-legend-activity-scale-item" style={{backgroundColor: '#86efac'}}></div>
                <div className="calendar-tab-legend-activity-scale-item" style={{backgroundColor: '#4ade80'}}></div>
                <div className="calendar-tab-legend-activity-scale-item" style={{backgroundColor: '#22c55e'}}></div>
                <div className="calendar-tab-legend-activity-scale-item" style={{backgroundColor: '#16a34a'}}></div>
              </div>
              <span>많음</span>
            </div>
            <div className="calendar-tab-legend-summary">
              이번 달 총 {calendarGrid.filter(d => d?.hasActivity).length}일 학습
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}