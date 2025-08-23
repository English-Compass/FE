import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export function MediaCard({ content, getLevelColor, getLevelText, onWatchContent }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gray-200 relative overflow-hidden">
        <img 
          src={content.thumbnail} 
          alt={content.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge className={`${getLevelColor(content.level)} text-white border-0`}>
            {getLevelText(content.level)}
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-black/50 text-white border-0">
            {content.type}
          </Badge>
        </div>
      </div>
      
      <CardContent className="!p-4 !space-y-3">
        <div className="!space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800">{content.title}</h3>
            <Badge variant="outline" className="platform-badge text-xs">
              {content.platform}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2">
            {content.description}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="bg-blue-50 !p-2 rounded-lg">
            <p className="text-xs font-medium text-blue-800">추천 이유</p>
            <p className="text-xs text-blue-700 !mt-1">{content.reason}</p>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">⏱️ {content.duration}</span>
            <span className="flex items-center gap-1">📂 {content.category}</span>
          </div>
        </div>

        <Button 
          onClick={() => onWatchContent(content)}
          className="w-full border-0 cursor-pointer transition-colors duration-200 ease-in-out !p-4 bg-blue-600 hover:bg-blue-700"
        >
          {content.platform}에서 시청하기
        </Button>
      </CardContent>
    </Card>
  );
}
