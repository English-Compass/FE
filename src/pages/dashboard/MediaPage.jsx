import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

import { MediaHeader } from '../../components/media/MediaHeader';
import { LearningTips } from '../../components/media/LearningTips';
import { MediaGrid } from '../../components/media/MediaGrid';
import { GenreSelection } from '../../components/media/GenreSelection';

const API_BASE_URL = '/api/recommendations'; // Vite proxy 사용

export default function MediaPage() {
  const { user, formData, scrollToTop } = useApp();

  useEffect(() => {
    scrollToTop();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [mediaContent, setMediaContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showGenreSelection, setShowGenreSelection] = useState(false);
  const [recommendationHistory, setRecommendationHistory] = useState([]);

  // 사용 가능한 장르 목록 조회
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/genres`);
        if (response.ok) {
          const data = await response.json();
          setAvailableGenres(data.genres || []);
        }
      } catch (error) {
        console.error('장르 목록 조회 실패:', error);
      }
    };
    fetchGenres();
  }, []);

  // 사용자 추천 히스토리 조회
  useEffect(() => {
    if (user?.id) {
      const fetchHistory = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/user-requested/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            setRecommendationHistory(data.recommendations || []);
          }
        } catch (error) {
          console.error('추천 히스토리 조회 실패:', error);
        }
      };
      fetchHistory();
    }
  }, [user?.id]);

  // 장르를 직접 받아서 추천 생성하는 함수
  const handleGenerateRecommendationsWithGenres = async (genres) => {
    console.log('사용자 정보:', user);
    console.log('전달받은 장르:', genres);
    
    if (!user?.id) {
      alert('사용자 정보가 없습니다. 로그인 상태를 확인해주세요.');
      return;
    }
    
    if (!genres || genres.length === 0) {
      alert('장르를 선택해주세요.');
      return;
    }

    setLoading(true);
    try {
      // 실제 사용자 ID 사용
                   const requestBody = {
               userId: user.id, // 문자열 사용자 ID 사용
               selectedGenres: genres,
             };
      
      console.log('요청 데이터:', requestBody);
      
      const response = await fetch(`${API_BASE_URL}/user-requested`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('응답 상태:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('추천 생성 응답:', data);
        
        if (data.status === 'SUCCESS') {
          alert('추천이 성공적으로 생성되었습니다!');
          setShowGenreSelection(false);
          setSelectedGenres([]);
          // 추천 히스토리 새로고침 (실제 사용자 ID로)
          const historyResponse = await fetch(`${API_BASE_URL}/user-requested/${user.id}`);
          if (historyResponse.ok) {
            const historyData = await historyResponse.json();
            console.log('추천 히스토리 응답:', historyData);
            setRecommendationHistory(historyData.recommendations || []);
          }
        } else {
          alert(data.message || '추천 생성에 실패했습니다.');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API 오류:', errorData);
        alert(`추천 생성에 실패했습니다. (${response.status})`);
      }
    } catch (error) {
      console.error('추천 생성 오류:', error);
      alert('추천 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = recommendationHistory.filter(content => {
    const matchesSearch = content.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getLevelColor = (level) => {
    // 문자열 난이도도 처리
    if (typeof level === 'string') {
      const levelMap = {
        '초급': 'level-color-1',
        '중급': 'level-color-3',
        '고급': 'level-color-5'
      };
      return levelMap[level] || 'bg-gray-500';
    }
    
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
    // 문자열 난이도도 처리
    if (typeof level === 'string') {
      return level;
    }
    
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
    if (content.playUrl) {
      window.open(content.playUrl, '_blank');
    } else if (content.url) {
      window.open(content.url, '_blank');
    } else {
      alert(`${content.platform}에서 "${content.title}" 시청하기`);
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleGenreSelection = (genres) => {
    setSelectedGenres(genres);
  };

  return (
    <div className="media-page">
      <MediaHeader 
        user={user}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        getLevelText={getLevelText}
        onGenerateRecommendations={() => setShowGenreSelection(true)}
      />
      
      {showGenreSelection && (
        <GenreSelection
          availableGenres={availableGenres}
          selectedGenres={selectedGenres}
          onGenreSelection={handleGenreSelection}
          onGenerate={handleGenerateRecommendationsWithGenres}
          onCancel={() => setShowGenreSelection(false)}
          loading={loading}
        />
      )}
      
      <LearningTips />
      
      {recommendationHistory.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <p className="text-lg font-medium mb-2">🎬 맞춤 미디어 추천</p>
            <p>장르를 선택하여 맞춤형 미디어 콘텐츠를 받아보세요!</p>
          </div>
          <button
            onClick={() => setShowGenreSelection(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            추천 받기
          </button>
        </div>
      ) : (
        <MediaGrid 
          filteredContent={filteredContent}
          getLevelColor={getLevelColor}
          getLevelText={getLevelText}
          onWatchContent={handleWatchContent}
        />
      )}
    </div>
  );
}