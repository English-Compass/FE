import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, BookOpen, Search, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';

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

  // API: Word Study API를 통해 사용자 맞춤형 단어 목록 조회
  useEffect(() => {
    const fetchWordStudyList = async () => {
      setLoading(true);
      try {
        // Word Study API 호출 - 사용자 프로필 기반 단어 생성
        const response = await fetch('http://localhost:8081/api/word-study/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: "user_123", // 실제 사용자 ID 사용
            wordCount: 30, // 단어장은 더 많은 단어 표시
            focusCategory: formData.selectedCategories?.length > 0 ? formData.selectedCategories[0] : null,
            targetDifficulty: formData.level || null
          })
        });
        
        if (!response.ok) {
          throw new Error('단어 데이터 조회 실패');
        }
        
        const data = await response.json();
        
        if (data.success && data.words) {
          // API 응답 형태를 컴포넌트에서 사용하는 형태로 변환
          const formattedWords = data.words.map(wordObj => ({
            word: wordObj.word,
            meaning: wordObj.koreanMeaning || wordObj.definition,
            example: wordObj.exampleSentence,
            level: wordObj.difficulty,
            category: mapCategoryToEnglish(wordObj.category)
          }));
          
          setWords(formattedWords);
        } else {
          throw new Error(data.errorMessage || '단어 데이터 처리 실패');
        }
        
      } catch (err) {
        console.error('단어장 조회 실패:', err);
        
        // 실패 시 더미 데이터 사용 (기존 코드 유지)
        const recommendedWords = generateRecommendedWords(formData.keywords || []);
        
        if (formData.selectedCategories) {
          formData.selectedCategories.forEach(categoryId => {
            const categoryKeywords = KEYWORDS_BY_CATEGORY[categoryId] || [];
            const categoryWords = generateRecommendedWords(categoryKeywords.slice(0, 2));
            recommendedWords.push(...categoryWords);
          });
        }

        const uniqueWords = recommendedWords.filter((word, index, arr) => 
          arr.findIndex(w => w.word === word.word) === index
        );

        setWords(uniqueWords);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWordStudyList();
  }, [formData.keywords, formData.selectedCategories, formData.level, KEYWORDS_BY_CATEGORY]);

  // 카테고리명 변환 함수
  const mapCategoryToEnglish = (koreanCategory) => {
    const categoryMap = {
      '학업': 'academic',
      '비즈니스': 'business',
      '여행': 'travel',
      '일상생활': 'daily',
      '일상': 'daily'
    };
    return categoryMap[koreanCategory] || 'daily';
  };

  // 키워드 기반 단어 추천 (임시 데이터)
  const generateRecommendedWords = (keywords) => {
    const wordDatabase = {
      // 여행 관련 단어
      '배낭여행': [
        { word: 'backpack', meaning: '배낭', example: 'I packed my backpack for the trip.', level: 'A', category: 'travel' },
        { word: 'hostel', meaning: '호스텔, 저렴한 숙소', example: 'We stayed at a hostel in Paris.', level: 'B', category: 'travel' },
        { word: 'itinerary', meaning: '여행 일정', example: 'Our itinerary includes five cities.', level: 'C', category: 'travel' }
      ],
      '가족여행': [
        { word: 'vacation', meaning: '휴가', example: 'We went on vacation to Hawaii.', level: 'A', category: 'travel' },
        { word: 'resort', meaning: '리조트', example: 'The family resort has many activities.', level: 'B', category: 'travel' },
        { word: 'sightseeing', meaning: '관광', example: 'We spent the day sightseeing in Rome.', level: 'B', category: 'travel' }
      ],
      '해외여행': [
        { word: 'passport', meaning: '여권', example: 'Don\'t forget your passport at the airport.', level: 'A', category: 'travel' },
        { word: 'customs', meaning: '세관', example: 'We had to go through customs.', level: 'B', category: 'travel' },
        { word: 'jet lag', meaning: '시차병', example: 'I\'m still suffering from jet lag.', level: 'C', category: 'travel' }
      ],

      // 비즈니스 관련 단어
      '회사업무': [
        { word: 'meeting', meaning: '회의', example: 'We have a meeting at 3 PM.', level: 'A', category: 'business' },
        { word: 'deadline', meaning: '마감일', example: 'The deadline for this project is Friday.', level: 'B', category: 'business' },
        { word: 'colleague', meaning: '동료', example: 'My colleague helped me with the report.', level: 'B', category: 'business' }
      ],
      '미팅': [
        { word: 'agenda', meaning: '안건, 의제', example: 'What\'s on the agenda for today\'s meeting?', level: 'C', category: 'business' },
        { word: 'presentation', meaning: '발표', example: 'She gave an excellent presentation.', level: 'B', category: 'business' },
        { word: 'negotiate', meaning: '협상하다', example: 'We need to negotiate the contract terms.', level: 'C', category: 'business' }
      ],

      // 일상 관련 단어
      '가족': [
        { word: 'family', meaning: '가족', example: 'I love spending time with my family.', level: 'A', category: 'daily' },
        { word: 'relative', meaning: '친척', example: 'All my relatives came to the wedding.', level: 'B', category: 'daily' },
        { word: 'sibling', meaning: '형제자매', example: 'I have two siblings.', level: 'B', category: 'daily' }
      ],
      '친구': [
        { word: 'friendship', meaning: '우정', example: 'Our friendship has lasted for years.', level: 'B', category: 'daily' },
        { word: 'companion', meaning: '동반자, 친구', example: 'He was my traveling companion.', level: 'C', category: 'daily' },
        { word: 'buddy', meaning: '친구, 버디', example: 'He\'s been my workout buddy for months.', level: 'A', category: 'daily' }
      ],

      // 학술 관련 단어
      '대학교': [
        { word: 'campus', meaning: '캠퍼스', example: 'The university campus is beautiful.', level: 'B', category: 'academic' },
        { word: 'semester', meaning: '학기', example: 'This semester I\'m taking five courses.', level: 'B', category: 'academic' },
        { word: 'lecture', meaning: '강의', example: 'The professor\'s lecture was very interesting.', level: 'B', category: 'academic' }
      ],
      '연구': [
        { word: 'research', meaning: '연구', example: 'She is conducting research on climate change.', level: 'B', category: 'academic' },
        { word: 'hypothesis', meaning: '가설', example: 'Our hypothesis was proven correct.', level: 'C', category: 'academic' },
        { word: 'methodology', meaning: '방법론', example: 'The research methodology was well-designed.', level: 'C', category: 'academic' }
      ]
    };

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

    return uniqueWords.slice(0, 30); // 최대 30개 단어
  };


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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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