import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

import { MediaHeader } from '../../components/media/MediaHeader';
import { LearningTips } from '../../components/media/LearningTips';
import { MediaGrid } from '../../components/media/MediaGrid';
import GenreSelection from '../../components/media/GenreSelection';

export default function MediaPage() {
  const { user, formData, scrollToTop } = useApp();

  useEffect(() => {
    scrollToTop();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentRecommendations, setCurrentRecommendations] = useState([]); // 현재 표시할 추천 (최신)
  const [recommendationHistory, setRecommendationHistory] = useState([]); // 전체 히스토리
  const [loading, setLoading] = useState(false);
  const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false); // 히스토리 표시 여부

  // 사용자 추천 히스토리 조회 (전체 히스토리)
  const fetchHistory = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      // 실시간 추천도 포함된 전체 히스토리 조회
      const response = await fetch(`/api/recommendations/history/${user.id}`);
      if (!response.ok) {
        throw new Error('추천 히스토리를 불러올 수 없습니다.');
      }
      const data = await response.json();
      console.log('전체 히스토리 응답:', data);
      setRecommendationHistory(data.recommendations || []);
    } catch (error) {
      console.error('추천 히스토리 조회 오류:', error);
      setRecommendationHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // 최신 추천만 조회 (페이지 로드 시)
  const fetchLatestRecommendations = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/recommendations/user-requested/${user.id}`);
      if (!response.ok) {
        throw new Error('추천을 불러올 수 없습니다.');
      }
      const data = await response.json();
      // 최신 5개 추천만 표시 (API에서 최신순으로 정렬되어 있다고 가정)
      const latestRecommendations = (data.recommendations || []).slice(0, 5);
      setCurrentRecommendations(latestRecommendations);
    } catch (error) {
      console.error('최신 추천 조회 오류:', error);
      setCurrentRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  // 장르 기반 추천 생성
  const handleGenerateRecommendationsWithGenres = async (genres) => {
    if (!user?.id) {
      alert('사용자 정보가 없습니다.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/recommendations/user-requested', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          selectedGenres: genres
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '추천 생성에 실패했습니다.');
      }

      const data = await response.json();
      console.log('추천 생성 결과:', data);
      
      // 추천 생성 성공 시 최신 추천만 다시 조회
      if (data.status === 'SUCCESS') {
        // 새로 생성된 추천을 현재 추천으로 설정
        setCurrentRecommendations(data.recommendations || []);
        // 히스토리도 업데이트
        await fetchHistory();
        alert(`${data.totalRecommendations}개의 추천이 생성되었습니다!`);
      } else {
        alert('추천 생성에 실패했습니다.');
      }
      
    } catch (error) {
      console.error('추천 생성 오류:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestRecommendations(); // 페이지 로드 시 최신 추천만 조회
  }, [user?.id]);

  // 히스토리 보기 모드에 따라 표시할 콘텐츠 결정
  const displayContent = showHistory ? recommendationHistory : currentRecommendations;
  
  const filteredContent = displayContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (content.description && content.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const getLevelColor = (level) => {
    const levelMap = {
      'Beginner': 'level-color-1',
      'Intermediate': 'level-color-3',
      'Advanced': 'level-color-5',
      'Beginner to Intermediate': 'level-color-2',
      'Intermediate to Advanced': 'level-color-4',
      '초급': 'level-color-1',
      '중급': 'level-color-3',
      '고급': 'level-color-5',
      '초중급': 'level-color-2',
      '중고급': 'level-color-4'
    };
    return levelMap[level] || 'bg-gray-500';
  };

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

  const handleWatchContent = (content) => {
    const title = content.title || '해당 콘텐츠';
    const url = content.url;
    
    // 유튜브 URL이 유효한 경우 새 탭에서 열기
    if (url && url !== 'N/A' && url.includes('youtube.com')) {
      window.open(url, '_blank');
    } else {
      // URL이 유효하지 않은 경우 검색 안내
      alert(`유튜브에서 "${title}" 검색하기\n\n직접 유튜브에 접속하여 검색해보세요.`);
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleViewHistory = async () => {
    if (!showHistory) {
      // 히스토리 보기 모드로 전환
      await fetchHistory();
    }
    setShowHistory(!showHistory);
  };

  return (
    <div className="media-page">
      <MediaHeader 
        user={user}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        getLevelText={getLevelText}
        onGenerateRecommendations={() => setIsGenreModalOpen(true)}
        onViewHistory={handleViewHistory}
        loading={loading}
        showHistory={showHistory}
      />
      
      <LearningTips />
      
      <MediaGrid 
        filteredContent={filteredContent}
        getLevelColor={getLevelColor}
        getLevelText={getLevelText}
        onWatchContent={handleWatchContent}
        loading={loading}
        isSearch={searchTerm.length > 0}
      />

      <GenreSelection
        isOpen={isGenreModalOpen}
        onClose={() => setIsGenreModalOpen(false)}
        onConfirm={handleGenerateRecommendationsWithGenres}
      />
    </div>
  );
}