import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { X, Film, Music, BookOpen, Gamepad2, Heart, Zap, Shield, Eye, Star, Users, Globe, Camera, Tv } from 'lucide-react';

const genreIcons = {
  '액션': Zap,
  '드라마': Heart,
  '코미디': Users,
  '로맨스': Heart,
  '스릴러': Shield,
  '공포': Eye,
  '미스터리': BookOpen,
  'SF': Globe,
  '판타지': Star,
  '범죄': Shield,
  '전쟁': Shield,
  '음악': Music,
  '애니메이션': Camera,
  '다큐멘터리': Tv,
  'EDUCATION': BookOpen,
  'ENTERTAINMENT': Film,
  'GAMING': Gamepad2,
  'TECHNOLOGY': Globe,
  'LIFESTYLE': Heart,
  'SPORTS': Zap,
  'NEWS': BookOpen,
  'TRAVEL': Globe,
  'FOOD': Heart,
  'FASHION': Heart,
  'BUSINESS': BookOpen,
  'SCIENCE': Globe,
  'HISTORY': BookOpen,
  'NATURE': Globe,
  'ARTS': Star,
  'PHILOSOPHY': BookOpen,
  'POLITICS': Shield,
  'ECONOMY': BookOpen,
  'SOCIAL': Users,
  'PSYCHOLOGY': BookOpen,
  'RELIGION': Star,
  'MYTHOLOGY': Star,
  'FANTASY': Star,
  'ADVENTURE': Zap,
  'MYSTERY': BookOpen,
  'HORROR': Eye,
  'ROMANCE': Heart,
  'COMEDY': Users,
  'DRAMA': Heart,
  'ACTION': Zap,
  'CRIME': Shield,
  'WAR': Shield,
  'MUSIC': Music,
  'ANIMATION': Camera,
  'DOCUMENTARY': Tv
};

export function GenreSelection({
  availableGenres,
  selectedGenres,
  onGenreSelection,
  onGenerate,
  onCancel,
  loading
}) {
  const [localSelectedGenres, setLocalSelectedGenres] = useState(selectedGenres);

  const handleGenreToggle = (genre) => {
    setLocalSelectedGenres(prev => {
      if (prev.includes(genre)) {
        return prev.filter(g => g !== genre);
      } else {
        if (prev.length >= 5) {
          alert('최대 5개까지 선택할 수 있습니다.');
          return prev;
        }
        return [...prev, genre];
      }
    });
  };

  const handleGenerate = () => {
    if (localSelectedGenres.length === 0) {
      alert('최소 1개 이상의 장르를 선택해주세요.');
      return;
    }
    console.log('GenreSelection에서 선택된 장르:', localSelectedGenres);
    onGenreSelection(localSelectedGenres);
    // 장르 선택 후 모달을 닫고 추천 생성은 별도로 처리
    onCancel();
  };

  const handleCancel = () => {
    setLocalSelectedGenres(selectedGenres);
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">🎬 장르 선택</h2>
          <Button variant="ghost" size="sm" onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            관심 있는 장르를 선택하세요. (최대 5개)
          </p>
          {localSelectedGenres.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">선택된 장르:</p>
              <div className="flex flex-wrap gap-2">
                {localSelectedGenres.map(genre => {
                  const IconComponent = genreIcons[genre] || Film;
                  return (
                    <Badge
                      key={genre}
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1"
                    >
                      <IconComponent className="w-3 h-3" />
                      {genre}
                      <button
                        onClick={() => handleGenreToggle(genre)}
                        className="ml-1 hover:text-blue-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          {availableGenres.map(genre => {
            const IconComponent = genreIcons[genre] || Film;
            const isSelected = localSelectedGenres.includes(genre);
            
            return (
              <button
                key={genre}
                onClick={() => handleGenreToggle(genre)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="w-6 h-6" />
                <span className="text-sm font-medium">{genre}</span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            취소
          </Button>
          <Button 
            onClick={handleGenerate} 
            disabled={loading || localSelectedGenres.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? '추천 생성 중...' : '추천 받기'}
          </Button>
        </div>
      </div>
    </div>
  );
}
