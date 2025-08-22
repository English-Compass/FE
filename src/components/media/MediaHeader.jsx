import React from 'react';
import { Input } from '../ui/input';

export function MediaHeader({ user, searchTerm, onSearchChange, getLevelText }) {
  return (
    <div className="!space-y-4 !m-2">
      <h1 className="text-2xl font-bold text-gray-800">🎬 맞춤 미디어 추천</h1>
      <p className="text-gray-600">
        {user?.name}님의 {getLevelText(user?.level || 1)} 수준에 맞는 영상 콘텐츠를 추천해드려요
      </p>

      {/* Search Bar */}
      <div className="relative !w-full !pl-12">
        <Input
          placeholder=" 제목이나 내용으로 검색하세요..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="!border border-gray-300 h-12 transition-all duration-200 ease-in-out"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
