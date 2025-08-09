import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export function MediaCard({ content, getLevelColor, getLevelText, onWatchContent }) {
  return (
    <Card className="media-card overflow-hidden hover:shadow-lg transition-shadow">
      <div className="media-thumbnail aspect-video bg-gray-200 relative overflow-hidden">
        <img 
          src={content.thumbnail} 
          alt={content.title}
          className="thumbnail-image w-full h-full object-cover"
        />
        <div className="level-badge absolute top-2 left-2">
          <Badge className={`${getLevelColor(content.level)} text-white border-0`}>
            {getLevelText(content.level)}
          </Badge>
        </div>
        <div className="type-badge absolute top-2 right-2">
          <Badge variant="secondary" className="bg-black/50 text-white border-0">
            {content.type}
          </Badge>
        </div>
      </div>
      
      <CardContent className="media-content p-4 space-y-3">
        <div className="content-header space-y-2">
          <div className="title-row flex items-center justify-between">
            <h3 className="content-title font-bold text-gray-800">{content.title}</h3>
            <Badge variant="outline" className="platform-badge text-xs">
              {content.platform}
            </Badge>
          </div>
          
          <p className="content-description text-sm text-gray-600 line-clamp-2">
            {content.description}
          </p>
        </div>

        <div className="content-details space-y-2">
          <div className="recommendation-reason bg-blue-50 p-2 rounded-lg">
            <p className="reason-label text-xs font-medium text-blue-800">추천 이유</p>
            <p className="reason-text text-xs text-blue-700">{content.reason}</p>
          </div>
          
          <div className="content-meta flex items-center justify-between text-xs text-gray-500">
            <span className="duration">⏱️ {content.duration}</span>
            <span className="category">📂 {content.category}</span>
          </div>
        </div>

        <Button 
          onClick={() => onWatchContent(content)}
          className="watch-button w-full bg-blue-600 hover:bg-blue-700"
        >
          {content.platform}에서 시청하기
        </Button>
      </CardContent>
    </Card>
  );
}
