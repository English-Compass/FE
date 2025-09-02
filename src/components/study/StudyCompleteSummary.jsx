import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { useApp } from '../../context/AppContext';

// 새로 추가된 추천 미디어 카드 컴포넌트
function RecommendedMediaCard({ media }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="!p-4">
        <div className="aspect-w-16 aspect-h-9 !mb-4">
          <img 
            src={`https://via.placeholder.com/300x170.png?text=${media.title}`} 
            alt={media.title} 
            className="rounded-lg object-cover w-full h-full"
          />
        </div>
        <h4 className="font-bold text-gray-800 !mb-1">{media.title}</h4>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{media.platform}</span>
          <Badge variant="secondary">{media.genre}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export function StudyCompleteSummary({ studyResults, onRestart, onGoHome }) {
  const { selectedType, STUDY_TYPES, getDifficultyText, formData } = useApp();
  const [recommendations, setRecommendations] = useState([]);
  
  // 결과 통계 계산
  const totalQuestions = studyResults?.totalQuestions || 0;
  const correctAnswers = studyResults?.correctAnswers || 0;
  const wrongAnswers = totalQuestions - correctAnswers;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
  // 선택된 학습 유형 정보
  const studyType = STUDY_TYPES.find(type => type.id === selectedType);

  useEffect(() => {
    // API: 사용자의 키워드와 난이도에 맞는 미디어 추천을 요청합니다.
    // 이 예제에서는 더미 데이터를 사용합니다.
    const fetchRecommendations = () => {
        const allMedia = [
            { id: 1, title: 'The Office', platform: 'Netflix', genre: 'Business', level: 'B' },
            { id: 2, title: 'Friends', platform: 'HBO Max', genre: 'Daily', level: 'A' },
            { id: 3, title: 'Silicon Valley', platform: 'HBO Max', genre: 'Business', level: 'C' },
            { id: 4, title: 'Emily in Paris', platform: 'Netflix', genre: 'Travel', level: 'A' },
            { id: 5, title: 'The Crown', platform: 'Netflix', genre: 'History', level: 'C' },
            { id: 6, title: 'Modern Family', platform: 'Disney+', genre: 'Daily', level: 'B' },
            { id: 7, title: 'House of Cards', platform: 'Netflix', genre: 'Business', level: 'C' },
            { id: 8, title: 'Rick and Morty', platform: 'HBO Max', genre: 'Academic', level: 'C' },
        ];

        const userKeywords = formData.keywords || [];
        const userLevel = formData.level || 'B';

        // 키워드와 레벨을 기반으로 미디어 필터링
        const filteredMedia = allMedia.filter(media => {
            const hasKeyword = userKeywords.some(keyword => media.genre.toLowerCase().includes(keyword.toLowerCase()));
            const isLevelMatch = media.level === userLevel;
            return hasKeyword || isLevelMatch;
        });

        // 중복을 제거하고 3개만 선택
        const uniqueRecommendations = [...new Map(filteredMedia.map(item => [item.id, item])).values()];
        setRecommendations(uniqueRecommendations.slice(0, 3));
    };

    fetchRecommendations();
  }, [formData.keywords, formData.level]);
  
  return (
    <div className="!p-4 !sm:p-6 !space-y-6 max-w-3xl !mx-auto">
      {/* 헤더 */}
      <div className="text-center !space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">🎉 학습 완료!</h1>
        <p className="text-gray-600">
          수고하셨습니다! 학습 결과를 확인해보세요.
        </p>
      </div>

      {/* 학습 정보 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {studyType?.icon} {studyType?.title} 학습
          </CardTitle>
        </CardHeader>
        <CardContent className="!space-y-4">
          <div className="grid grid-cols-2 gap-4 text-ml">
            <div>
              <span className="text-gray-600">난이도 : </span>
              <Badge variant="outline" className="ml-2">
                {getDifficultyText(formData.level)}
              </Badge>
            </div>
            <div>
              <span className="text-gray-600">선택 키워드 : </span>
              <span className="ml-2 text-gray-800">
                {formData.keywords.join(', ') || '없음'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 결과 통계 */}
      <Card>
        <CardHeader>
          <CardTitle>📊 학습 결과</CardTitle>
        </CardHeader>
        <CardContent className="!space-y-6">
          {/* 정확도 */}
          <div>
            <div className="flex justify-between items-center !mb-2">
              <span className="text-ml font-medium">정확도</span>
              <span className="text-2xl font-bold text-blue-600">{accuracy}%</span>
            </div>
            <Progress value={accuracy} className="h-3" />
          </div>

          {/* 상세 통계 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center !p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{totalQuestions}</div>
              <div className="text-ml text-gray-700">총 문제</div>
            </div>
            <div className="text-center !p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{correctAnswers}</div>
              <div className="text-ml text-gray-700">정답</div>
            </div>
            <div className="text-center !p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{wrongAnswers}</div>
              <div className="text-ml text-red-700">오답</div>
            </div>
          </div>

          {/* 성과 메시지 */}
          <div className={`!p-4 rounded-lg text-center ${
            accuracy >= 80 
              ? 'bg-green-50 border border-green-200' 
              : accuracy >= 60 
                ? 'bg-yellow-50 border border-yellow-200'
                : 'bg-red-50 border border-red-200'
          }`}>
            <div className="text-2xl !mb-2">
              {accuracy >= 80 ? '🌟' : accuracy >= 60 ? '👍' : '💪'}
            </div>
            <p className={`font-medium ${
              accuracy >= 80 
                ? 'text-green-800' 
                : accuracy >= 60 
                  ? 'text-yellow-800'
                  : 'text-red-800'
            }`}>
              {accuracy >= 80 
                ? '훌륭합니다! 매우 잘하셨어요!' 
                : accuracy >= 60 
                  ? '좋아요! 조금만 더 노력하면 완벽해요!'
                  : '다시 한번 도전해보세요! 연습하면 늘어요!'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 액션 버튼 */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onRestart}
          className="flex-1"
        >
          다시 학습하기
        </Button>
        <Button
          onClick={onGoHome}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          홈으로 가기
        </Button>
      </div>

      {/* 추천 미디어 섹션 */}
      {recommendations.length > 0 && (
        <Card className="!mt-6">
          <CardHeader>
            <CardTitle>🎬 다음 학습으로 추천하는 미디어</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map(media => (
              <RecommendedMediaCard key={media.id} media={media} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
