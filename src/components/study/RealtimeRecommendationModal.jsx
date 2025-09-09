import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { X, ExternalLink, Play } from 'lucide-react';

export function RealtimeRecommendationModal({ 
  isOpen, 
  onClose, 
  recommendations = [], 
  loading = false 
}) {
  const [currentRecommendation, setCurrentRecommendation] = useState(0);

  // 유튜브 영상인지 확인
  const isYouTube = (platform) => {
    return platform && platform.toLowerCase().includes('youtube');
  };

  // 유튜브 썸네일 URL 생성
  const getYouTubeThumbnail = (url) => {
    if (!url || url === 'N/A') return null;
    
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (videoIdMatch) {
      const videoId = videoIdMatch[1];
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return null;
  };

  // 난이도 색상 매핑
  const getLevelColor = (level) => {
    const levelMap = {
      'Beginner': 'bg-green-500',
      'Intermediate': 'bg-yellow-500',
      'Advanced': 'bg-red-500',
      'Beginner to Intermediate': 'bg-green-400',
      'Intermediate to Advanced': 'bg-orange-500'
    };
    return levelMap[level] || 'bg-gray-500';
  };

  // 난이도 텍스트 매핑
  const getLevelText = (level) => {
    const levelMap = {
      'Beginner': '초급',
      'Intermediate': '중급',
      'Advanced': '고급',
      'Beginner to Intermediate': '초중급',
      'Intermediate to Advanced': '중고급'
    };
    return levelMap[level] || level || '알 수 없음';
  };

  // 미디어 타입 텍스트 매핑
  const getMediaTypeText = (mediaType) => {
    const typeMap = {
      'VIDEO': '동영상',
      'YOUTUBE_VIDEO': '유튜브',
      'DRAMA': '드라마',
      'MOVIE': '영화',
      'AUDIO': '오디오',
      'PODCAST': '팟캐스트'
    };
    return typeMap[mediaType] || mediaType || '미디어';
  };

  // 콘텐츠 시청 처리
  const handleWatchContent = (content) => {
    const url = content.url;
    
    if (url && url !== 'N/A' && url.includes('youtube.com')) {
      window.open(url, '_blank');
    } else {
      alert(`유튜브에서 "${content.title}" 검색하기\n\n직접 유튜브에 접속하여 검색해보세요.`);
    }
  };

  // 다음 추천으로 이동
  const handleNext = () => {
    if (currentRecommendation < recommendations.length - 1) {
      setCurrentRecommendation(currentRecommendation + 1);
    }
  };

  // 이전 추천으로 이동
  const handlePrevious = () => {
    if (currentRecommendation > 0) {
      setCurrentRecommendation(currentRecommendation - 1);
    }
  };

  // 모달이 열릴 때마다 첫 번째 추천으로 리셋
  useEffect(() => {
    if (isOpen) {
      setCurrentRecommendation(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentContent = recommendations[currentRecommendation];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">🎬 맞춤 추천 영상</h2>
            <p className="text-gray-600 mt-1">
              학습 결과를 바탕으로 추천하는 영상입니다
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">추천을 생성하고 있습니다...</span>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🎬</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                추천할 영상이 없습니다
              </h3>
              <p className="text-gray-500">
                더 많은 학습을 통해 맞춤 추천을 받아보세요
              </p>
            </div>
          ) : currentContent ? (
            <div className="space-y-6">
              {/* 영상 정보 */}
              <div className="flex gap-6">
                {/* 썸네일 또는 플레이스홀더 */}
                <div className="flex-shrink-0">
                  {isYouTube(currentContent.platform) ? (
                    <div className="w-48 h-32 bg-gray-200 rounded-lg overflow-hidden relative">
                      <img
                        src={getYouTubeThumbnail(currentContent.url) || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDE5MiAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9Ijk2IiB5PSI2NCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTlBM0FGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+7J207J207J20PC90ZXh0Pgo8L3N2Zz4K'}
                        alt={currentContent.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDE5MiAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9Ijk2IiB5PSI2NCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTlBM0FGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+7J207J207J20PC90ZXh0Pgo8L3N2Zz4K';
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-red-600 rounded-full p-3">
                          <Play size={24} className="text-white" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-48 h-32 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🎬</div>
                        <div className="text-sm text-gray-600">
                          {getMediaTypeText(currentContent.mediaType)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 영상 정보 */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                      {currentContent.title}
                    </h3>
                    <div className="flex space-x-2 ml-4">
                      <Badge className={`${getLevelColor(currentContent.difficultyLevel)} text-white border-0`}>
                        {getLevelText(currentContent.difficultyLevel)}
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-600 text-white border-0">
                        {getMediaTypeText(currentContent.mediaType)}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-gray-600 line-clamp-3">
                    {currentContent.description || '설명이 없습니다.'}
                  </p>

                  {currentContent.recommendationReason && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-1">추천 이유</p>
                      <p className="text-sm text-blue-700">{currentContent.recommendationReason}</p>
                    </div>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>⏱️ {currentContent.estimatedDuration || '알 수 없음'}분</span>
                    <span>📺 {currentContent.platform || '플랫폼'}</span>
                  </div>
                </div>
              </div>

              {/* 네비게이션 및 액션 버튼 */}
              <div className="flex justify-between items-center">
                {/* 네비게이션 */}
                <div className="flex space-x-2">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentRecommendation === 0}
                    variant="outline"
                    size="sm"
                  >
                    이전
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={currentRecommendation === recommendations.length - 1}
                    variant="outline"
                    size="sm"
                  >
                    다음
                  </Button>
                </div>

                {/* 시청 버튼 */}
                {isYouTube(currentContent.platform) ? (
                  <Button
                    onClick={() => handleWatchContent(currentContent)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    유튜브에서 시청하기
                  </Button>
                ) : (
                  <div className="text-sm text-gray-500">
                    {currentContent.platform}에서 시청 가능
                  </div>
                )}
              </div>

              {/* 추천 인디케이터 */}
              {recommendations.length > 1 && (
                <div className="flex justify-center space-x-2">
                  {recommendations.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentRecommendation(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentRecommendation ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* 푸터 */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <Button
            onClick={onClose}
            variant="outline"
          >
            닫기
          </Button>
          {recommendations.length > 0 && (
            <Button
              onClick={() => {
                // 미디어 페이지로 이동
                window.location.href = '/dashboard/media';
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              더 많은 추천 보기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
