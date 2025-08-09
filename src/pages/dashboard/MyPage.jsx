import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Clock, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MyPage() {
  const { 
    user, 
    setUser, 
    studyProgress,
    KEYWORDS_BY_CATEGORY,
    getDifficultyText 
  } = useApp();
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    learningGoal: user?.learningGoal || '',
    level: user?.level || 'B',
    keywords: user?.keywords || []
  });

  // 목업 데이터
  const studyStats = {
    totalHours: 24.5
  };

  const weeklyHours = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.0 },
    { day: 'Wed', hours: 2.0 },
    { day: 'Thu', hours: 4.5 },
    { day: 'Fri', hours: 5.0 },
    { day: 'Sat', hours: 3.5 },
    { day: 'Sun', hours: 4.0 }
  ];

  const monthlyStats = {
    totalDays: 23,
    totalMinutes: 680,
    averageAccuracy: 87,
    completedLessons: 45
  };

  const generateCalendarData = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    const calendarData = [];
    
    for (let i = 0; i < startDayOfWeek; i++) {
      calendarData.push(null);
    }
    
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

  const calendarData = generateCalendarData(currentMonth);
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleKeywordToggle = (keyword) => {
    setEditForm(prev => ({
      ...prev,
      keywords: prev.keywords.includes(keyword)
        ? prev.keywords.filter(k => k !== keyword)
        : [...prev.keywords, keyword]
    }));
  };

  const handleSaveProfile = () => {
    if (user) {
      setUser({
        ...user,
        name: editForm.name,
        learningGoal: editForm.learningGoal,
        level: editForm.level,
        keywords: editForm.keywords
      });
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    console.log('Logout requested');
  };

  const getActivityColor = (activity) => {
    if (activity === 0) return 'bg-gray-100';
    if (activity === 1) return 'bg-green-200';
    if (activity === 2) return 'bg-green-300';
    if (activity === 3) return 'bg-green-400';
    return 'bg-green-500';
  };

  const getGoalText = (goal) => {
    const goals = {
      'conversation': '회화 능력 향상',
      'grammar': '어휘 및 문법 학습',
      'listening': '리스닝·스피킹 연습',
      'travel': '해외여행 준비',
      'business': '비즈니스 영어',
      'test': '시험 준비',
      'general': '종합적인 영어 학습'
    };
    return goals[goal] || goal;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newDate);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-800">👤 마이페이지</h1>
        <p className="text-gray-600">프로필과 학습 현황을 관리하세요</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">프로필</TabsTrigger>
          <TabsTrigger value="stats">통계</TabsTrigger>
          <TabsTrigger value="calendar">학습 달력</TabsTrigger>
          <TabsTrigger value="settings">설정</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                프로필 정보
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? '취소' : '편집'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user?.profileImage} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-2">
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label htmlFor="name">닉네임</Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="w-48"
                      />
                    </div>
                  ) : (
                    <h3 className="text-2xl font-bold text-gray-800">{user?.name}</h3>
                  )}
                  <p className="text-gray-600">{user?.email}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Level {user?.level}</Badge>
                    <Badge variant="secondary">{getDifficultyText(user?.level)}</Badge>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="goal">학습 목적</Label>
                    <Select
                      value={editForm.learningGoal}
                      onValueChange={(value) => setEditForm({...editForm, learningGoal: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="학습 목적을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">종합적인 영어 학습</SelectItem>
                        <SelectItem value="conversation">회화 능력 향상</SelectItem>
                        <SelectItem value="grammar">어휘 및 문법 학습</SelectItem>
                        <SelectItem value="listening">리스닝·스피킹 연습</SelectItem>
                        <SelectItem value="travel">해외여행 준비</SelectItem>
                        <SelectItem value="business">비즈니스 영어</SelectItem>
                        <SelectItem value="test">시험 준비</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">실력 수준</Label>
                    <Select
                      value={editForm.level}
                      onValueChange={(value) => setEditForm({...editForm, level: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Level A - 초급</SelectItem>
                        <SelectItem value="B">Level B - 중급</SelectItem>
                        <SelectItem value="C">Level C - 상급</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>관심 키워드</Label>
                    {editForm.keywords.length > 0 && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800 mb-2">
                          선택된 키워드 ({editForm.keywords.length}개)
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {editForm.keywords.map((keyword) => (
                            <Badge
                              key={keyword}
                              variant="default"
                              className="bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                              onClick={() => handleKeywordToggle(keyword)}
                            >
                              {keyword}
                              <X className="w-3 h-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      {Object.entries(KEYWORDS_BY_CATEGORY).map(([categoryKey, keywords]) => {
                        const categoryTitles = {
                          travel: '🧳 여행',
                          business: '💼 비즈니스', 
                          academic: '🎓 학업',
                          daily: '🏠 일상생활'
                        };
                        
                        return (
                          <div key={categoryKey}>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              {categoryTitles[categoryKey]}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {keywords.map((keyword) => (
                                <Badge
                                  key={keyword}
                                  variant={editForm.keywords.includes(keyword) ? "default" : "outline"}
                                  className={`cursor-pointer text-xs ${
                                    editForm.keywords.includes(keyword)
                                      ? 'bg-blue-600 text-white'
                                      : 'hover:bg-gray-100'
                                  }`}
                                  onClick={() => handleKeywordToggle(keyword)}
                                >
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
                    저장
                  </Button>
                </div>
              )}

              {!isEditing && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">학습 목적</h4>
                    <p className="text-gray-600">{getGoalText(user?.learningGoal || '')}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">현재 실력</h4>
                    <p className="text-gray-600">Level {user?.level} - {getDifficultyText(user?.level)}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">관심 키워드</h4>
                    <div className="flex flex-wrap gap-2">
                      {user?.keywords?.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">계정 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  className="w-full justify-start text-gray-700"
                >
                  로그아웃
                </Button>
                
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                  onClick={() => {
                    if (window.confirm('정말로 회원 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.')) {
                      console.log('Account deletion requested');
                    }
                  }}
                >
                  회원 탈퇴
                </Button>
              </div>
              
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                회원 탈퇴 시 모든 학습 데이터가 영구적으로 삭제되며, 복구할 수 없습니다.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{studyProgress.completed || 0}</div>
                <div className="text-sm text-gray-600">연속 학습일</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{monthlyStats.totalMinutes}</div>
                <div className="text-sm text-gray-600">총 학습시간(분)</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">{monthlyStats.averageAccuracy}%</div>
                <div className="text-sm text-gray-600">평균 정답률</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-orange-600">{monthlyStats.completedLessons}</div>
                <div className="text-sm text-gray-600">완료한 레슨</div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-gray-200 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <span>학습 시간 통계</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{studyStats.totalHours}시간</div>
                  <p className="text-gray-600">총 학습 시간</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {(studyStats.totalHours / 7).toFixed(1)}시간
                  </div>
                  <p className="text-gray-600">일평균 학습 시간</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">이번 주 학습 시간</h4>
                <div className="grid grid-cols-7 gap-2">
                  {weeklyHours.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-gray-600 mb-2">{day.day}</div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-900">{day.hours}h</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">📊 이번 주 분석</h4>
                <p className="text-sm text-gray-600">
                  금요일에 가장 많이 학습했네요! 주말에도 꾸준히 학습하면 더 좋은 결과를 얻을 수 있어요.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <span>📅</span>
                  <span>학습 달력</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth(-1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="font-medium min-w-20 text-center">
                    {currentMonth.getFullYear()}년 {monthNames[currentMonth.getMonth()]}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth(1)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-2 text-center">
                  {dayNames.map((day) => (
                    <div key={day} className="text-xs font-medium text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {calendarData.map((dayData, index) => (
                    <div key={index} className="aspect-square">
                      {dayData ? (
                        <div
                          className={`w-full h-full rounded-lg border transition-colors ${getActivityColor(dayData.activity)} flex items-center justify-center cursor-pointer hover:opacity-80`}
                          title={dayData.activity > 0 
                            ? `${dayData.day}일: ${dayData.studyTime}분 학습` 
                            : `${dayData.day}일: 학습 없음`}
                        >
                          <span className={`text-sm font-medium ${
                            dayData.activity === 0 ? 'text-gray-500' : 'text-white'
                          }`}>
                            {dayData.day}
                          </span>
                        </div>
                      ) : (
                        <div className="w-full h-full"></div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span>적음</span>
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
                      <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
                      <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                    </div>
                    <span>많음</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    이번 달 총 {calendarData.filter(d => d?.activity > 0).length}일 학습
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}