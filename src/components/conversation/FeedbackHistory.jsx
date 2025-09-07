import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, Star, Clock, MessageCircle, Calendar } from 'lucide-react';

const API_BASE_URL = '/api/v1';

export function FeedbackHistory({ user, onBack }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeedbackHistory();
  }, []);

  const fetchFeedbackHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/speech-sessions/evaluations?page=0&size=20`);
      
      if (!response.ok) {
        throw new Error('피드백 히스토리를 불러올 수 없습니다.');
      }

      const data = await response.json();
      setFeedbacks(data.content || []);
    } catch (error) {
      console.error('피드백 히스토리 로드 오류:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'INTERMEDIATE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ADVANCED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTopicDisplayName = (topic) => {
    if (topic?.startsWith('role-playing:')) {
      const scenarioId = topic.replace('role-playing:', '');
      const scenarioNames = {
        'cafe': '카페',
        'restaurant': '식당',
        'hotel': '호텔',
        'shop': '상점',
        'doctor': '병원',
        'airport': '공항',
        'bank': '은행',
        'custom': '커스텀 롤플레잉'
      };
      return scenarioNames[scenarioId] || '롤플레잉';
    }
    return topic || '일반 회화';
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 !p-4 !md:px-6 !md:py-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="ml"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 !mr-2" />
            뒤로 가기
          </Button>
        </div>
        
        <Card className="flex h-[26rem] flex-col rounded-lg border bg-white shadow-sm">
          <CardContent className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">피드백 히스토리를 불러오는 중...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 !p-4 !md:px-6 !md:py-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="ml"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 !mr-2" />
            뒤로 가기
          </Button>
        </div>
        
        <Card className="flex h-[26rem] flex-col rounded-lg border bg-white shadow-sm">
          <CardContent className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchFeedbackHistory} variant="outline">
                다시 시도
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 !p-4 !md:px-6 !md:py-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="ml"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 !mr-2" />
          뒤로 가기
        </Button>
        <Badge variant="outline">Level {user?.level}</Badge>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-800">피드백 히스토리</h2>
        </div>

        {feedbacks.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">아직 피드백이 없습니다</h3>
            <p className="text-gray-500">회화 연습을 시작해서 첫 번째 피드백을 받아보세요!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((feedback, index) => (
              <Card key={feedback.id || index} className="border border-gray-200 hover:border-blue-300 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {formatDate(feedback.createdAt)}
                        </span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={getDifficultyColor(feedback.recommendedDifficulty || 'INTERMEDIATE')}
                      >
                        {feedback.recommendedDifficulty || 'INTERMEDIATE'}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      세션: {feedback.sessionId?.substring(0, 8)}...
                    </Badge>
                  </div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    {getTopicDisplayName(feedback.topic)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {feedback.feedback ? (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-gray-700 leading-relaxed">{feedback.feedback}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-500 italic">피드백 내용이 없습니다.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
