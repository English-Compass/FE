import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export function MediaCard({ content, getLevelColor, getLevelText, onWatchContent }) {
  // 백엔드 응답 구조에 맞게 필드 매핑
  const formatDuration = (duration) => {
    if (!duration) return '알 수 없음';
    if (typeof duration === 'number') {
      return `${duration}분`;
    }
    return duration;
  };

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

  const getButtonText = (content) => {
    const platform = content.platform || '플랫폼';
    
    // 모든 플랫폼에 대해 "찾아보기"로 통일
    if (platform.toLowerCase().includes('youtube')) {
      return '유튜브에서 찾아보기';
    } else {
      return `${platform}에서 찾아보기`;
    }
  };

  // 유튜브 영상인지 확인
  const isYouTube = content.platform && content.platform.toLowerCase().includes('youtube');

  // 유튜브 썸네일 URL 생성
  const getYouTubeThumbnail = (url) => {
    if (!url || url === 'N/A') return null;
    
    // YouTube URL에서 video ID 추출
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (videoIdMatch) {
      const videoId = videoIdMatch[1];
      // YouTube 썸네일 URL 생성 (고화질)
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return null;
  };

  // 썸네일 URL 결정
  const thumbnailUrl = content.thumbnailUrl || 
                      (isYouTube ? getYouTubeThumbnail(content.url) : null) ||
                      content.thumbnail;

  // 디버깅용 로그 (개발 환경에서만)
  if (isYouTube && process.env.NODE_ENV === 'development') {
    console.log('YouTube 썸네일 디버깅:', {
      title: content.title,
      url: content.url,
      thumbnailUrl: content.thumbnailUrl,
      generatedThumbnail: getYouTubeThumbnail(content.url),
      finalThumbnail: thumbnailUrl
    });
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {isYouTube ? (
        // 유튜브 영상: 썸네일 표시
        <div className="aspect-video bg-gray-200 relative overflow-hidden">
          <img 
            src={thumbnailUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Q0EzQUYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7snbTsnbTsnbQg7J207J207J20PC90ZXh0Pgo8L3N2Zz4K'} 
            alt={content.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // 썸네일 로드 실패 시 기본 이미지로 대체
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Q0EzQUYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7snbTsnbTsnbQg7J207J207J20PC90ZXh0Pgo8L3N2Zz4K';
            }}
          />
          <div className="absolute top-2 left-2">
            <Badge className={`${getLevelColor(content.difficultyLevel)} text-white border-0`}>
              {getLevelText(content.difficultyLevel)}
            </Badge>
          </div>
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-black/50 text-white border-0">
              {getMediaTypeText(content.mediaType)}
            </Badge>
          </div>
        </div>
      ) : (
        // 다른 콘텐츠: 이미지 없이 헤더만 표시
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 !p-4 border-b">
          <div className="flex justify-between items-center">
            <div className="flex !space-x-2">
              <Badge className={`${getLevelColor(content.difficultyLevel)} text-white border-0`}>
                {getLevelText(content.difficultyLevel)}
              </Badge>
              <Badge variant="secondary" className="bg-gray-600 text-white border-0">
                {getMediaTypeText(content.mediaType)}
              </Badge>
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {content.platform || '플랫폼'}
            </div>
          </div>
        </div>
      )}
      <CardContent className="!p-4 !space-y-3">
        <div className="!space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800">{content.title}</h3>
            {isYouTube && (
              <Badge variant="outline" className="platform-badge text-xs">
                {content.platform || 'Unknown'}
              </Badge>
            )}
          </div>         
          <p className="text-sm text-gray-600 line-clamp-2">
            {content.description || '설명이 없습니다.'}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {content.recommendationReason && (
            <div className="bg-blue-50 !p-2 rounded-lg">
              <p className="text-xs font-medium text-blue-800">추천 이유</p>
              <p className="text-xs text-blue-700 !mt-1">{content.recommendationReason}</p>
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">⏱️ {formatDuration(content.estimatedDuration)}</span>
            <span className="flex items-center gap-1">📂 {content.category || '기타'}</span>
          </div>
        </div>

        {content.platform && content.platform.toLowerCase().includes('youtube') ? (
          <Button 
            onClick={() => onWatchContent(content)}
            className="w-full border-0 cursor-pointer transition-colors duration-200 ease-in-out !p-4 bg-blue-600 hover:bg-blue-700"
          >
            {getButtonText(content)}
          </Button>
        ) : (
          <div className="w-full !p-4 bg-gray-100 rounded-lg text-center">
            <span className="text-sm text-gray-600">
              {content.platform || '플랫폼'}에서 시청 가능
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
