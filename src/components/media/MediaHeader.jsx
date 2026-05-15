import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export function MediaHeader({ user, searchTerm, onSearchChange, getLevelText, onGenerateRecommendations, onViewHistory, loading, showHistory }) {
  return (
    <div className="!space-y-4 !m-2">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {showHistory ? '📚 추천 히스토리' : '🎬 맞춤 미디어 추천'}
          </h1>
          <p className="text-gray-600">
            {showHistory 
              ? '이전에 받은 모든 추천을 확인할 수 있습니다'
              : `${user?.name}님의 ${getLevelText(user?.level || 1)} 수준에 맞는 영상 콘텐츠를 추천해드려요`
            }
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={onViewHistory}
            className={showHistory ? "bg-blue-500 hover:bg-blue-600 text-white !px-4 !py-2" : "bg-gray-500 hover:bg-gray-600 text-white !px-4 !py-2"}
          >
            {showHistory ? '최신 추천 보기' : '히스토리 보기'}
          </Button>
          <Button
            onClick={onGenerateRecommendations}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white !px-6 !py-2"
          >
            {loading ? '추천 생성 중...' : '추천 받기'}
          </Button>
        </div>
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
