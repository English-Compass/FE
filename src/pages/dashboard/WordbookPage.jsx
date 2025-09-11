import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, BookOpen, Search, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fetchRecommendedWords } from '../../services/api.js';
import { wordDatabase } from '../../data/wordDatabase.js';

export default function WordbookPage() {
  const navigate = useNavigate();
  const { formData, KEYWORDS_BY_CATEGORY, STUDY_TYPES, scrollToTop } = useApp();

  useEffect(() => {
    scrollToTop();
  }, []);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  // 추천 단어 API 연동으로 대체됨

  // 키워드 기반 단어 추천 (로컬 더미 + API 결과 병합)
  const generateRecommendedWords = (keywords) => {
    let recommendedWords = [];
    
    keywords.forEach(keyword => {
      if (wordDatabase[keyword]) {
        recommendedWords = [...recommendedWords, ...wordDatabase[keyword]];
      }
    });

    // 중복 제거
    const uniqueWords = recommendedWords.filter((word, index, arr) => 
      arr.findIndex(w => w.word === word.word) === index
    );

    return uniqueWords.slice(0, 60); // 최대 60개 단어로 증가
  };

  useEffect(() => {
    const run = async () => {
      setLoading(true);

      // 로컬 더미 추천
      const localRecommended = generateRecommendedWords(formData.keywords || []);

      // 백엔드 추천 호출
      try {
        const storedUser = localStorage.getItem('user');
        const userId = storedUser ? JSON.parse(storedUser).userId : null;
        const level = (formData.level || 'B');
        const apiRes = userId ? await fetchRecommendedWords({ userId, level, limit: 50 }) : null;
        const apiWords = Array.isArray(apiRes?.words) ? apiRes.words.map(w => ({
          word: w.word,
          meaning: w.koreanMeaning || w.definition || '',
          example: w.exampleSentence || '',
          level: w.difficulty || level,
          category: (w.category || '').toLowerCase()
        })) : [];

        const merged = [...apiWords, ...localRecommended];
        const unique = merged.filter((word, index, arr) => 
          arr.findIndex(w => w.word === word.word) === index
        );

        setWords(unique.slice(0, 60));
      } catch {
        setWords(localRecommended);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [formData.keywords, formData.selectedCategories, KEYWORDS_BY_CATEGORY, formData.level, scrollToTop]);

  // 필터링된 단어들
  const filteredWords = words.filter(word => {
    const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.meaning.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || word.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || word.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // 카테고리별 단어 수 계산
  const categoryStats = words.reduce((acc, word) => {
    acc[word.category] = (acc[word.category] || 0) + 1;
    return acc;
  }, {});

  const getCategoryDisplayName = (categoryId) => {
    const categoryMap = {
      'travel': '여행',
      'business': '비즈니스', 
      'daily': '일상',
      'academic': '학술'
    };
    return categoryMap[categoryId] || categoryId;
  };

  const getLevelColor = (level) => {
    const colors = {
      'A': 'bg-green-100 text-green-800',
      'B': 'bg-yellow-100 text-yellow-800', 
      'C': 'bg-red-100 text-red-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="!p-4 !sm:p-6">
      {/* Header */}
      <div className="!mb-6">
        <div className="flex items-center !space-x-3 !mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="!p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center !space-x-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">맞춤 단어장</h1>
          </div>
        </div>
        
        <div className="bg-blue-50 !p-4 rounded-lg border border-blue-200">
          <p className="text-blue-800 !mb-2">
            <span className="font-semibold">👤 선택하신 키워드:</span> {formData.keywords?.join(', ') || '없음'}
          </p>
          <p className="text-blue-700 text-sm">
            선택한 키워드와 관심사를 바탕으로 추천된 단어들입니다
          </p>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="!mb-6 !space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 검색 */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="단어나 뜻으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full !pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 카테고리 필터 */}
          <div className="flex items-center !space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">모든 카테고리</option>
              <option value="travel">여행</option>
              <option value="business">비즈니스</option>
              <option value="daily">일상</option>
              <option value="academic">학술</option>
            </select>
          </div>

          {/* 난이도 필터 */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">모든 난이도</option>
            <option value="A">초급</option>
            <option value="B">중급</option>
            <option value="C">상급</option>
          </select>
        </div>

        {/* 통계 */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            전체 {filteredWords.length}개 단어
          </Badge>
          {Object.entries(categoryStats).map(([category, count]) => (
            <Badge key={category} variant="secondary">
              {getCategoryDisplayName(category)} {count}개
            </Badge>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center !py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto !mb-4"></div>
            <p className="text-gray-600">맞춤 단어를 준비하고 있어요...</p>
          </div>
        </div>
      )}

      {/* 단어 목록 */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWords.length === 0 ? (
            <div className="col-span-full text-center !py-12">
              <p className="text-gray-500 !mb-4">검색 결과가 없습니다.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                }}
              >
                필터 초기화
              </Button>
            </div>
          ) : (
            filteredWords.map((word, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="!pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-blue-700">
                      {word.word}
                    </CardTitle>
                    <div className="flex items-center !space-x-2">
                      <Badge className={getLevelColor(word.level)}>
                        {word.level}급
                      </Badge>
                      <Badge variant="outline">
                        {getCategoryDisplayName(word.category)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-800 font-medium !mb-2">
                    {word.meaning}
                  </p>
                  <p className="text-gray-600 text-sm italic">
                    "{word.example}"
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}