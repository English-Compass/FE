import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Clock } from 'lucide-react';

// API: 서버에서 사용자의 학습 통계 데이터(총 학습 시간, 주간 학습 시간 등)를 가져와야 합니다.
// 예: useEffect(() => { fetch('/api/user/stats').then(res => res.json()).then(data => setStudyStats(data)); }, []);

export default function StatsBoard({ studyStats, weeklyHours }) {
  return (
    <Card className='!mt-6'>
      <CardHeader>
        <CardTitle className="flex items-center !space-x-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <span>학습 시간 통계</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="!space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 !mb-2">{studyStats.totalHours}시간</div>
                <p className="text-gray-600">총 학습 시간</p>
            </div>
            <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 !mb-2">
                {(studyStats.totalHours / 7).toFixed(1)}시간
                </div>
                <p className="text-gray-600">일평균 학습 시간</p>
            </div>
        </div>
        <div>
            <h4 className="font-medium text-gray-900 !mb-4">이번 주 학습 시간</h4>
            <div className="grid grid-cols-7 gap-2">
                {weeklyHours.map((day, index) => (
                <div key={index} className="text-center">
                    <div className="text-xs text-gray-600 !mb-2">{day.day}</div>
                    <div className="bg-gray-100 rounded-lg !p-3">
                    <div className="text-sm font-medium text-gray-900">{day.hours}h</div>
                    </div>
                </div>
                ))}
            </div>
        </div>
        <div className="bg-gray-50 !p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 !mb-4">📊 이번 주 분석</h4>
            {/* ... (JSX for weekly analysis) ... */}
        </div>
      </CardContent>
    </Card>
  );
}
// Note: For brevity, the detailed JSX within CardContent is omitted but should be pasted from your original file.