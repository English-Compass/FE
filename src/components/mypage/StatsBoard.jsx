import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function StatsBoard({ studyStats, weeklyHours }) {
  const { user } = useApp();
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 이번주 학습량 통계 조회
  const fetchWeeklyStats = async () => {
    if (!user?.id) {
      console.log('StatsBoard - 사용자 ID가 없습니다.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('StatsBoard - 토큰이 없습니다.');
        setIsLoading(false);
        return;
      }

      console.log('StatsBoard - 이번주 학습량 통계 조회 시작');
      
      // 현재 주차의 월요일 계산
      const today = new Date();
      const dayOfWeek = today.getDay();
      const monday = new Date(today);
      monday.setDate(today.getDate() - dayOfWeek + 1);
      const weekStartDate = monday.toISOString().split('T')[0];

      const response = await fetch(`learning-analytics/users/${user.id}/weekly-stats?weekStartDate=${weekStartDate}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('StatsBoard - API 응답 상태:', response.status, response.statusText);

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const responseData = await response.json();
          console.log('StatsBoard - 이번주 학습량 통계 응답:', responseData);
          setWeeklyStats(responseData);
        } else {
          console.log('StatsBoard - JSON이 아닌 응답입니다.');
        }
      } else {
        console.error('StatsBoard - 이번주 학습량 통계 조회 실패:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('StatsBoard - 에러 응답:', errorText);
        setError('학습량 통계를 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('StatsBoard - 이번주 학습량 통계 조회 오류:', error);
      setError('학습량 통계 조회 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyStats();
  }, [user?.id]);

  // 로딩 상태
  if (isLoading) {
    return (
      <Card className='!mt-6'>
        <CardHeader>
          <CardTitle className="flex items-center !space-x-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <span>학습 시간 통계</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="!space-y-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">학습량 통계를 불러오는 중...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Card className='!mt-6'>
        <CardHeader>
          <CardTitle className="flex items-center !space-x-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <span>학습 시간 통계</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="!space-y-6">
          <div className="text-center py-8 text-gray-500">
            <p>{error}</p>
            <button 
              onClick={fetchWeeklyStats}
              className="mt-2 text-blue-600 hover:text-blue-800 underline"
            >
              다시 시도
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className='!mt-6'>
      <CardHeader>
        <CardTitle className="flex items-center !space-x-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <span>이번 주 학습량 통계</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="!space-y-6">
        {weeklyStats ? (
          <>
            {/* 주차 정보 */}
            <div className="bg-blue-50 !p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 !mb-2">📅 이번 주 기간</h4>
              <p className="text-blue-700">
                {weeklyStats.weekStartDate} ~ {weeklyStats.weekEndDate}
              </p>
            </div>

            {/* 주간 학습량 통계 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center bg-gray-50 !p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 !mb-1">
                  {weeklyStats.totalProblems || 0}
                </div>
                <p className="text-gray-600 text-sm">총 문제 수</p>
              </div>
              <div className="text-center bg-green-50 !p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-700 !mb-1">
                  {weeklyStats.totalCorrectAnswers || 0}
                </div>
                <p className="text-green-600 text-sm">정답 수</p>
              </div>
              <div className="text-center bg-blue-50 !p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-700 !mb-1">
                  {weeklyStats.accuracyRate ? `${weeklyStats.accuracyRate.toFixed(1)}%` : '0%'}
                </div>
                <p className="text-blue-600 text-sm">정답률</p>
              </div>
              <div className="text-center bg-purple-50 !p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-700 !mb-1">
                  {weeklyStats.totalStudyTime ? `${weeklyStats.totalStudyTime}분` : '0분'}
                </div>
                <p className="text-purple-600 text-sm">총 학습 시간</p>
              </div>
            </div>

            {/* 문제 유형별 정답률 */}
            {weeklyStats.problemTypeAccuracy && weeklyStats.problemTypeAccuracy.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 !mb-4">📊 문제 유형별 정답률</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {weeklyStats.problemTypeAccuracy.map((type, index) => (
                    <div key={index} className="bg-gray-50 !p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">{type.problemType}</span>
                        <span className="text-gray-900 font-bold">{type.accuracyRate.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${type.accuracyRate}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 세션별 완료 정보 */}
            {weeklyStats.sessionCompletion && weeklyStats.sessionCompletion.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 !mb-4">🎯 세션별 완료 현황</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {weeklyStats.sessionCompletion.map((session, index) => (
                    <div key={index} className="bg-gray-50 !p-3 rounded-lg">
                      <div className="flex justify-between items-center !mb-2">
                        <span className="text-gray-700 font-medium">{session.sessionType}</span>
                        <span className="text-gray-900 font-bold">
                          {session.completedSessions}/{session.totalSessions}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${session.completionRate}%` }}
                        ></div>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        완료율: {session.completionRate.toFixed(1)}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 이번 주 분석 */}
            <div className="bg-gray-50 !p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 !mb-4">📈 이번 주 분석</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• 총 {weeklyStats.totalProblems || 0}문제를 풀었습니다</p>
                <p>• 정답률은 {weeklyStats.accuracyRate ? weeklyStats.accuracyRate.toFixed(1) : 0}%입니다</p>
                <p>• 총 {weeklyStats.totalStudyTime || 0}분 동안 학습했습니다</p>
                {weeklyStats.totalStudyTime && (
                  <p>• 일평균 {Math.round(weeklyStats.totalStudyTime / 7)}분씩 학습했습니다</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>이번 주 학습 데이터가 없습니다.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
// Note: For brevity, the detailed JSX within CardContent is omitted but should be pasted from your original file.