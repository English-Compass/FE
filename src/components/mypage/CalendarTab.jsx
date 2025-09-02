import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function LearningCalendarTab() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newDate);
  };
  
  // API: 해당 월의 학습 기록 데이터를 서버에서 가져와야 합니다.
  // useEffect(() => { fetch(`/api/calendar-data?month=${currentMonth}`).then(res => res.json()).then(data => setCalendarData(data)); }, [currentMonth]);

  // 달력 데이터를 생성하는 함수
  const generateCalendarData = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    const calendarData = [];
    
    // 달의 시작 요일 전까지 빈 칸 채우기
    for (let i = 0; i < startDayOfWeek; i++) {
      calendarData.push(null);
    }
    
    // 해당 월의 날짜 채우기 (학습 활동은 랜덤으로 생성)
    for (let day = 1; day <= daysInMonth; day++) {
      const activity = Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0;
      calendarData.push({
        day,
        activity,
        studyTime: activity * 15
      });
    }
    
    return calendarData;
  };

  // 학습량에 따라 칸의 색상을 반환하는 함수
  const getActivityLevel = (activity) => {
    return activity; // 0, 1, 2, 3, 4 반환
  };

  const calendarData = generateCalendarData(currentMonth);
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
            {calendarData.map((dayData, index) => (
              <div key={index} className="calendar-tab-content-day-item">
                {dayData ? (
                  <div
                    className={`calendar-tab-content-day-cell calendar-tab-content-day-cell--level-${getActivityLevel(dayData.activity)}`}
                    title={dayData.activity > 0 
                      ? `${dayData.day}일: ${dayData.studyTime}분 학습` 
                      : `${dayData.day}일: 학습 없음`}
                  >
                    <span className={`calendar-tab-content-day-cell-number${
                      dayData.activity === 0
                      ? 'calendar-tab-content-day-cell-number--inactive' 
                      : 'calendar-tab-content-day-cell-number--active'
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
                <div className="calendar-tab-legend-activity-scale-item"style={{backgroundColor: '#f3f4f6'}}></div>
                <div className="calendar-tab-legend-activity-scale-item"style={{backgroundColor: '#bbf7d0'}}></div>
                <div className="calendar-tab-legend-activity-scale-item"style={{backgroundColor: '#86efac'}}></div>
                <div className="calendar-tab-legend-activity-scale-item"style={{backgroundColor: '#4ade80'}}></div>
                <div className="calendar-tab-legend-activity-scale-item"style={{backgroundColor: '#22c55e'}}></div>
              </div>
              <span>많음</span>
            </div>
            <div className="calendar-tab-legend-summary">
              이번 달 총 {calendarData.filter(d => d?.activity > 0).length}일 학습
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}