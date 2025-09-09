import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const GenreSelection = ({ isOpen, onClose, onConfirm }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [loading, setLoading] = useState(false);

  // 사용 가능한 장르 목록 조회
  const fetchGenres = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/recommendations/genres');
      if (!response.ok) {
        throw new Error('장르 목록을 불러올 수 없습니다.');
      }
      const data = await response.json();
      setAvailableGenres(data.genres || []);
    } catch (error) {
      console.error('장르 목록 조회 오류:', error);
      // 백엔드에서 제공하는 기본 장르 목록 사용
      setAvailableGenres([
        '액션', '드라마', '코미디', '로맨스', '스릴러',
        '공포', '미스터리', 'SF', '판타지', '범죄',
        '전쟁', '음악', '애니메이션', '다큐멘터리'
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchGenres();
    }
  }, [isOpen]);

  const handleGenreToggle = (genre) => {
    setSelectedGenres(prev => {
      if (prev.includes(genre)) {
        return prev.filter(g => g !== genre);
      } else if (prev.length < 5) {
        return [...prev, genre];
      }
      return prev;
    });
  };

  const handleConfirm = () => {
    if (selectedGenres.length === 0) {
      alert('최소 1개 이상의 장르를 선택해주세요.');
      return;
    }
    onConfirm(selectedGenres);
    setSelectedGenres([]);
    onClose();
  };

  const handleClose = () => {
    setSelectedGenres([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">장르 선택</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          관심 있는 장르를 선택해주세요. (최대 5개)
        </p>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 mb-6 max-h-60 overflow-y-auto">
            {availableGenres.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreToggle(genre)}
                className={`p-3 text-sm rounded-lg border transition-colors ${
                  selectedGenres.includes(genre)
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            선택된 장르: {selectedGenres.length}/5
          </span>
          <div className="flex space-x-2" style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              style={{ display: 'block' }}
            >
              취소
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              style={{ display: 'block', backgroundColor: '#2563eb', color: 'white' }}
            >
              추천받기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenreSelection;
