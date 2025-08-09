import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

import { MediaHeader } from '../../components/media/MediaHeader';
import { LearningTips } from '../../components/media/LearningTips';
import { MediaGrid } from '../../components/media/MediaGrid';

const MEDIA_CONTENT = [
  {
    id: 1,
    title: 'Friends',
    type: 'TV Series',
    platform: 'Netflix',
    thumbnail: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=200&fit=crop',
    level: 2,
    category: 'Comedy',
    description: '일상 영어와 친구들 간의 대화를 자연스럽게 배울 수 있어요',
    reason: '초중급 수준에 맞는 친근한 일상 대화',
    duration: '22분/에피소드'
  },
  {
    id: 2,
    title: 'Ted Talks',
    type: 'Educational',
    platform: 'YouTube',
    thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=300&h=200&fit=crop',
    level: 5,
    category: 'Education',
    description: '다양한 주제의 프레젠테이션으로 고급 영어를 학습하세요',
    reason: '논리적 구조와 고급 어휘 사용',
    duration: '10-20분'
  },
  {
    id: 3,
    title: 'Stranger Things',
    type: 'TV Series',
    platform: 'Netflix',
    thumbnail: 'https://images.unsplash.com/photo-1489599063534-ba63ce831ac7?w=300&h=200&fit=crop',
    level: 3,
    category: 'Sci-Fi',
    description: '흥미진진한 스토리와 함께 미국 문화를 이해할 수 있어요',
    reason: '감정 표현과 일상적인 대화',
    duration: '45분/에피소드'
  },
  {
    id: 4,
    title: 'The Crown',
    type: 'TV Series',
    platform: 'Netflix',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
    level: 4,
    category: 'Drama',
    description: '품격 있는 영국 영어와 격식있는 표현을 배워보세요',
    reason: '정확한 발음과 우아한 표현들',
    duration: '55분/에피소드'
  }
];

export default function MediaPage() {
  const { user } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContent = MEDIA_CONTENT.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getLevelColor = (level) => {
    const colors = {
      1: 'level-color-1',
      2: 'level-color-2', 
      3: 'level-color-3',
      4: 'level-color-4',
      5: 'level-color-5',
      6: 'level-color-6'
    };
    return colors[level] || 'bg-gray-500';
  };

  const getLevelText = (level) => {
    const levels = {
      1: '초급',
      2: '초중급',
      3: '중급',
      4: '중상급',
      5: '상급',
      6: '최상급'
    };
    return levels[level] || '알 수 없음';
  };

  const handleWatchContent = (content) => {
    // 실제로는 외부 OTT 링크로 연결
    alert(`${content.platform}에서 "${content.title}" 시청하기`);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  return (
    <div className="media-page">
      <MediaHeader 
        user={user}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        getLevelText={getLevelText}
      />
      
      <LearningTips />
      
      <MediaGrid 
        filteredContent={filteredContent}
        getLevelColor={getLevelColor}
        getLevelText={getLevelText}
        onWatchContent={handleWatchContent}
      />
    </div>
  );
}