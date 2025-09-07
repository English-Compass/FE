import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export function MediaCard({ content, getLevelColor, getLevelText, onWatchContent }) {
  // API 응답 형식에 맞게 필드 매핑
  const title = content.title || content.name || '제목 없음';
  const description = content.description || content.summary || '설명 없음';
  const thumbnail = content.thumbnailUrl || content.thumbnail || 'https://via.placeholder.com/300x200?text=No+Image';
  const platform = content.platform || content.source || 'Unknown';
  const mediaType = content.mediaType || content.type || 'VIDEO';
  const difficultyLevel = content.difficultyLevel || content.level || '중급';
  const recommendationReason = content.recommendationReason || content.reason || '추천 이유 없음';
  const estimatedDuration = content.estimatedDuration || content.duration || 0;
  const category = content.category || content.genre || '기타';
  const playUrl = content.playUrl || content.url || null;

  const formatDuration = (minutes) => {
    if (!minutes) return '시간 정보 없음';
    if (minutes < 60) return `${minutes}분`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gray-200 relative overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        <div className="absolute top-2 left-2">
          <Badge className={`${getLevelColor(difficultyLevel)} text-white border-0`}>
            {getLevelText(difficultyLevel)}
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-black/50 text-white border-0">
            {mediaType}
          </Badge>
        </div>
      </div>
      
      <CardContent className="!p-4 !space-y-3">
        <div className="!space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 line-clamp-1">{title}</h3>
            <Badge variant="outline" className="platform-badge text-xs">
              {platform}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="bg-blue-50 !p-2 rounded-lg">
            <p className="text-xs font-medium text-blue-800">추천 이유</p>
            <p className="text-xs text-blue-700 !mt-1 line-clamp-2">{recommendationReason}</p>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">⏱️ {formatDuration(estimatedDuration)}</span>
            <span className="flex items-center gap-1">📂 {category}</span>
          </div>
        </div>

        <Button 
          onClick={() => onWatchContent(content)}
          className="w-full border-0 cursor-pointer transition-colors duration-200 ease-in-out !p-4 bg-blue-600 hover:bg-blue-700"
        >
          {playUrl ? `${platform}에서 시청하기` : `${platform} 링크 확인`}
        </Button>
      </CardContent>
    </Card>
  );
}
