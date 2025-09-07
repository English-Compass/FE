import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Film } from 'lucide-react';

export function MediaHeader({ user, searchTerm, onSearchChange, getLevelText, onGenerateRecommendations }) {
  return (
    <div className="!space-y-4 !m-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🎬 맞춤 미디어 추천</h1>
          <p className="text-gray-600">
            {user?.name}님의 {getLevelText(user?.level || 1)} 수준에 맞는 영상 콘텐츠를 추천해드려요
          </p>
        </div>
        {onGenerateRecommendations && (
          <Button
            onClick={onGenerateRecommendations}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Film className="w-4 h-4" />
            추천 받기
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative !w-full !pl-12">
        <Input
          placeholder="  제목이나 내용으로 검색하세요..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="!border border-gray-300 h-12 transition-all duration-200 ease-in-out"
        />
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
