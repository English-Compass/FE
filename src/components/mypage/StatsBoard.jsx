import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function StatsBoard({ studyStats, weeklyHours, weeklyStats, loading }) {
  
  const { user } = useApp();
  const [error, setError] = useState(null);

  // 로딩 상태
  if (loading) {
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
          </div>
        </CardContent>
      </Card>
    );
  }

  // 데이터가 없을 때
  if (!weeklyStats) {
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
            <p>학습 데이터가 없습니다.</p>
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
        {weeklyStats && weeklyStats.length > 0 ? (
          <>
            {/* 주차 정보 */}
            <div className="bg-blue-50 !p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 !mb-2">📅 이번 주 기간</h4>
              <p className="text-blue-700">
                {weeklyStats[0].weekStartDate} ~ {weeklyStats[0].weekEndDate}
              </p>
            </div>

            {/* 주간 학습량 통계 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="text-center bg-gray-50 !p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 !mb-1">
                  {weeklyStats[0].totalQuestions || 0}개
                </div>
                <p className="text-gray-600 text-sm">총 문제 수</p>
              </div>
              <div className="text-center bg-green-50 !p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-700 !mb-1">
                  {weeklyStats[0].totalCorrectAnswers || 0}개
                </div>
                <p className="text-green-600 text-sm">정답 수</p>
              </div>
              <div className="text-center bg-blue-50 !p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-700 !mb-1">
                  {weeklyStats[0].accuracyRate ? `${weeklyStats[0].accuracyRate.toFixed(1)}%` : '0%'}
                </div>
                <p className="text-blue-600 text-sm">정답률</p>
              </div>
            </div>

            {/* 학습 시간 및 세션 통계 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="text-center bg-purple-50 !p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-700 !mb-1">
                  {weeklyStats[0].formattedLearningTime || '0분'}
                </div>
                <p className="text-purple-600 text-sm">총 학습 시간</p>
              </div>
              <div className="text-center bg-orange-50 !p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-700 !mb-1">
                  {weeklyStats[0].totalSessions || 0}개
                </div>
                <p className="text-orange-600 text-sm">총 세션 수</p>
              </div>
              <div className="text-center bg-indigo-50 !p-4 rounded-lg">
                <div className="text-2xl font-bold text-indigo-700 !mb-1">
                  {weeklyStats[0].completedSessions || 0}개
                </div>
                <p className="text-indigo-600 text-sm">완료된 세션</p>
              </div>
            </div>

            {/* 완료율 */}
            <div className="text-center bg-yellow-50 !p-4 rounded-lg border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-700 !mb-1">
                {weeklyStats[0].completionRate ? `${weeklyStats[0].completionRate.toFixed(1)}%` : '0%'}
              </div>
              <p className="text-yellow-600 text-sm">완료율</p>
            </div>



            {/* 이번 주 분석 */}
            <div className="bg-gray-50 !p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 !mb-4">📈 이번 주 분석</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• 총 {weeklyStats[0].totalQuestions || 0}문제를 풀었습니다</p>
                <p>• 정답률은 {weeklyStats[0].accuracyRate ? weeklyStats[0].accuracyRate.toFixed(1) : 0}%입니다</p>
                <p>• 총 {weeklyStats[0].formattedLearningTime || '0분'} 동안 학습했습니다</p>
                <p>• {weeklyStats[0].totalSessions || 0}개 세션 중 {weeklyStats[0].completedSessions || 0}개를 완료했습니다</p>
                <p>• 세션 완료율은 {weeklyStats[0].completionRate ? weeklyStats[0].completionRate.toFixed(1) : 0}%입니다</p>
                {weeklyStats[0].totalLearningTimeSeconds && (
                  <p>• 일평균 {Math.round(weeklyStats[0].totalLearningTimeSeconds / 60 / 7)}분씩 학습했습니다</p>
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