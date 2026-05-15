/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

// 상수 데이터들을 컴포넌트 정의
const STUDY_TYPES = [
  { id: 'business', title: '비즈니스', icon: '💼', description: '회의, 회사, 미팅' },
  { id: 'travel', title: '여행', icon: '✈️', description: '배낭, 가족, 친구' },
  { id: 'daily', title: '일상', icon: '🏠', description: '가족, 친구, 선생님' },
  { id: 'academic', title: '학술', icon: '🎓', description: '대학교, 학원, 대학원' }
];

// 백엔드 CategoryMapper와 일치하는 키워드 분류
const KEYWORDS_BY_CATEGORY = {
  BUSINESS: ['고객 서비스', '이메일 보고서', '회의'],
  TRAVEL: ['배낭여행', '가족여행', '친구와 여행'],
  STUDY: ['과제 시험', '학과 대화', '수업 참여'],
  DAILY_LIFE: ['병원 이용', '대중교통 이용', '쇼핑 외식']
};

const CATEGORY_LABELS = {
  BUSINESS: '비즈니스',
  TRAVEL: '여행',
  STUDY: '학업',
  DAILY_LIFE: '일상생활'
};

const KEYWORD_TO_CATEGORY_LABEL = Object.entries(KEYWORDS_BY_CATEGORY).reduce((acc, [categoryKey, keywordList]) => {
  const label = CATEGORY_LABELS[categoryKey] || categoryKey;
  keywordList.forEach((keyword) => {
    acc[keyword] = label;
  });
  return acc;
}, {});

const CATEGORY_KEY_TO_STUDY_TYPE = {
  BUSINESS: 'business',
  TRAVEL: 'travel',
  STUDY: 'academic',
  DAILY_LIFE: 'daily'
};

const STUDY_TYPE_TO_CATEGORY_KEY = {
  business: 'BUSINESS',
  travel: 'TRAVEL',
  academic: 'STUDY',
  daily: 'DAILY_LIFE'
};

const deriveCategoriesFromKeywords = (keywords = []) => {
  const categories = new Set();
  keywords.forEach((keyword) => {
    Object.entries(KEYWORDS_BY_CATEGORY).forEach(([categoryKey, keywordList]) => {
      if (keywordList.includes(keyword)) {
        const studyTypeId = CATEGORY_KEY_TO_STUDY_TYPE[categoryKey] || categoryKey.toLowerCase();
        categories.add(studyTypeId);
      }
    });
  });
  return Array.from(categories);
};

// 사용자의 학습 통계 데이터를 가져오는 예시 (현재 비활성)
// const fetchUserStats = async () => {
//   const response = await fetch('http://localhost:8080/api/user/statistics', {
//     method: 'GET',
//     headers: {
//       'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
//       'Content-Type': 'application/json'
//     }
//   });
//   return response.json();
// };

// 학습 통계 데이터 (더미 데이터)
const monthlyStats = {
    totalMinutes: 680,
    averageAccuracy: 87,
    completedLessons: 45,
  };
  const studyStats = { totalHours: 24.5 };
  const weeklyHours = [
    { day: 'Mon', hours: 2.5 }, { day: 'Tue', hours: 3.0 }, { day: 'Wed', hours: 2.0 },
    { day: 'Thu', hours: 4.5 }, { day: 'Fri', hours: 5.0 }, { day: 'Sat', hours: 3.5 },
    { day: 'Sun', hours: 4.0 }
  ];

// 사용자 레벨
const LEVELS = [
  { 
    level: 'A', 
    title: '초급', 
    description: '기본 단어와 간단한 문장을 이해할 수 있어요', 
    color: 'bg-green-100 text-green-800',
    details: '• 기본 인사말과 자기소개\n• 간단한 일상 표현\n• 기본 어휘 500단어 수준'
  },
  { 
    level: 'B', 
    title: '중급', 
    description: '일상적인 주제에 대해 어느정도 대화할 수 있어요', 
    color: 'bg-yellow-100 text-yellow-800',
    details: '• 복잡한 문장 구조 이해\n• 다양한 주제 대화 가능\n• 어휘 1500단어 수준'
  },
  { 
    level: 'C', 
    title: '상급', 
    description: '복잡한 주제도 유창하게 대화하고 표현할 수 있어요', 
    color: 'bg-red-100 text-red-800',
    details: '• 전문적인 내용 이해\n• 자연스러운 의사표현\n• 어휘 3000단어 이상'
  }
];

// 문제 유형 데이터
const QUESTION_TYPES = [
  { id: 'word', title: '빈칸에 올바른 단어나 문장넣기', icon: '💼', description: '단어 학습' },
  { id: 'sentence', title: '밑줄친 문장과 동일한 의미의 숙어찾기', icon: '✈️', description: '문장 학습' },
  { id: 'conversation', title: '이어지는 대화맥락으로 올바른거 선택하기', icon: '🏠', description: '대화 학습' },
];

// Review 모드 상수
const REVIEW_MODES = {
  LIST: 'list',
  QUIZ: 'quiz',
  ANALYSIS: 'analysis'
};

// Review 결과 메시지
const REVIEW_MESSAGES = {
  CORRECT: {
    emoji: '✅',
    title: '정답입니다!',
    description: '훌륭합니다! 이제 이 문제를 정확히 이해했네요.'
  },
  INCORRECT: {
    emoji: '❌', 
    title: '틀렸습니다',
    description: (correctAnswer) => `정답은 "${correctAnswer}" 입니다.`
  }
};

// 문제 타입별 카테고리 매핑
const QUESTION_TYPE_MAPPING = {
  'word': '빈칸에 올바른 단어나 문장넣기',
  'sentence': '밑줄친 문장과 동일한 의미의 숙어찾기',
  'conversation': '이어지는 대화맥락으로 올바른거 선택하기'
};

// 커스텀 훅
// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// JWT 토큰에서 사용자 정보를 추출하는 함수
const decodeJWT = (token) => {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token format');
    }
    const payload = parts[1];
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    const decodedPayload = atob(paddedPayload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('JWT 디코딩 실패:', error);
    return null;
  }
};

export const AppProvider = ({ children }) => {
  // 초기값: 빈 상태로 시작 (localStorage에 저장하지 않음)
  // 앱 로드 시 API로 최신 사용자 정보 조회
  const [user, setUserState] = useState({
    id: null,
    name: null,
    email: null,
    profileImage: null,
    level: null,
    joinDate: null,
    streak: 0,
    keywords: []
  });
  
  // setUser 함수를 useCallback으로 최적화
  const setUser = useCallback((newUser) => {
    console.log('setUser 호출됨:', newUser);
    setUserState(newUser);
  }, []);
  
  // 사용자 정보 변경 시 디버깅 로그
  useEffect(() => {
    console.log('AppContext user state updated:', user);
  }, [user]);

  // AppContext 마운트 시 API 호출로 사용자 정보 조회 (표준 방식)
  // HttpOnly 쿠키(access_token)가 있으면 자동으로 전송됨
  // Gateway가 쿠키에서 토큰을 추출하여 검증하므로 Authorization 헤더 불필요
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        console.log('AppContext - 앱 로드 시 사용자 정보 조회 시작');
        
        // 1. 사용자 프로필 정보 조회 (이름, 프로필 이미지 등)
        // HttpOnly 쿠키(access_token)가 있으면 자동으로 전송됨
        // Gateway가 쿠키에서 토큰을 추출하여 검증
        const profileResponse = await fetch('/api/user/settings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include' // 쿠키 전달 필수! (HttpOnly 쿠키 포함)
        });

        if (profileResponse.ok) {
          const contentType = profileResponse.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const responseData = await profileResponse.json();
            console.log('AppContext - 사용자 정보 조회 응답:', responseData);
            
            // 백엔드 레벨(1, 2, 3)을 프론트엔드 레벨(A, B, C)로 변환
            const levelMapping = { 1: 'A', 2: 'B', 3: 'C' };
            const frontendLevel = levelMapping[responseData.difficultyLevel] || null;
            
            // 영어 enum을 한글 키워드로 매핑
            const enumToKeywordMap = {
              'CLASS_LISTENING': '수업 참여',
              'DEPARTMENT_CONVERSATION': '학과 대화',
              'ASSIGNMENT_EXAM': '과제 시험',
              'MEETING_CONFERENCE': '회의',
              'CUSTOMER_SERVICE': '고객 서비스',
              'EMAIL_REPORT': '이메일 보고서',
              'BACKPACKING': '배낭여행',
              'FAMILY_TRIP': '가족여행',
              'FRIEND_TRIP': '친구와 여행',
              'SHOPPING_DINING': '쇼핑 외식',
              'HOSPITAL_VISIT': '병원 이용',
              'PUBLIC_TRANSPORT': '대중교통 이용'
            };
            
            // 백엔드 카테고리 Map을 프론트엔드 키워드 배열로 변환 (영어 enum → 한글 키워드)
            const keywordsArray = [];
            if (responseData.categories) {
              Object.values(responseData.categories).forEach(categoryKeywords => {
                categoryKeywords.forEach(enumKeyword => {
                  const koreanKeyword = enumToKeywordMap[enumKeyword];
                  if (koreanKeyword) {
                    keywordsArray.push(koreanKeyword);
                  }
                });
              });
            }

            // API 응답에서 사용자 정보 추출
            // 백엔드에서 profileImage, name, difficultyLevel, categories, createdAt, updatedAt 반환
            const completeUserInfo = {
              id: responseData.userId || null,
              name: responseData.name || null, // 백엔드에서 name 반환
              email: responseData.email || null,
              profileImage: responseData.profileImage || null, // 백엔드에서 profileImage 반환
              level: frontendLevel,
              keywords: keywordsArray,
              joinDate: responseData.createdAt ? new Date(responseData.createdAt).toISOString().split('T')[0] : null,
              streak: 0 // 기본값 또는 API에서 조회
            };

            console.log('AppContext - 최신 사용자 정보 (전역 상태에 저장):', completeUserInfo);
            setUserState(completeUserInfo);
          }
        } else {
          console.log('AppContext - 사용자 정보 조회 실패:', profileResponse.status);
          // API 조회 실패 시 빈 상태 유지
        }
      } catch (error) {
        console.error('AppContext - 사용자 정보 조회 오류:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const [studyProgress, setStudyProgress] = useState({
    completed: 15,
    dailyGoal: 30,
  });

  // 학습 관련 상태들
  const [currentStep, setCurrentStep] = useState('studysession'); // studysession, complete
  const [selectedType, setSelectedType] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState(3);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // 학습 결과 상태
  const [studyResults, setStudyResults] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    completedAt: null
  });

  // Review 관련 상태들
  const [reviewMode, setReviewMode] = useState(REVIEW_MODES.LIST);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [reviewQuestions, setReviewQuestions] = useState([]);
  const [reviewSelectedAnswer, setReviewSelectedAnswer] = useState('');
  const [reviewShowResult, setReviewShowResult] = useState(false);

  // 추가 정보 설정 상태들
  const [additionalInfoStep, setAdditionalInfoStep] = useState(1);
  const [formData, setFormData] = useState({
    level: 'B',
    selectedCategories: [],
    keywords: []
  });

  // 사용자의 저장된 키워드가 있을 경우 자동으로 학습 설정 동기화
  useEffect(() => {
    if (!user?.keywords || user.keywords.length === 0) return;

    const derivedCategories = deriveCategoriesFromKeywords(user.keywords);

    setFormData(prev => ({
      ...prev,
      level: user.level || prev.level,
      selectedCategories: derivedCategories.length ? derivedCategories : prev.selectedCategories,
      keywords: user.keywords
    }));

    if (derivedCategories.length) {
      setSelectedType(prev => {
        if (!prev) return derivedCategories[0];
        return derivedCategories.includes(prev) ? prev : derivedCategories[0];
      });
    }
  }, [user?.keywords, user?.level]);

  // 난이도 선택 함수
  const getDifficultyText = (level) => {
    const levels = {
      'A': '초급', 
      'B': '중급', 
      'C': '상급'
    };
    return levels[level] || '중급';
  };

  // 대분류 토글 함수 (최대 2개)
  const getKeywordsForCategory = (categoryId) => {
    const categoryKey = STUDY_TYPE_TO_CATEGORY_KEY[categoryId] || categoryId;
    return KEYWORDS_BY_CATEGORY[categoryKey] || [];
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData(prev => {
      const isSelected = prev.selectedCategories.includes(categoryId);
      let newCategories;
      
      if (isSelected) {
        // 선택 해제
        newCategories = prev.selectedCategories.filter(id => id !== categoryId);
      } else {
        // 선택 추가 (최대 2개)
        if (prev.selectedCategories.length >= 2) {
          return prev; // 이미 2개 선택된 경우 변경하지 않음
        }
        newCategories = [...prev.selectedCategories, categoryId];
      }
      
      // 선택된 카테고리에 속하지 않는 키워드들 제거
      const validKeywords = prev.keywords.filter(keyword => {
        return newCategories.some(catId => 
          getKeywordsForCategory(catId).includes(keyword)
        );
      });
      
      return {
        ...prev,
        selectedCategories: newCategories,
        keywords: validKeywords
      };
    });
  };

  // 키워드 토글 함수
  const handleKeywordToggle = (keyword) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.includes(keyword)
        ? prev.keywords.filter(k => k !== keyword)
        : [...prev.keywords, keyword]
    }));
  };

  const buildSessionMetadata = useCallback(({ keywords = [], selectedCategories = [], level = 'B', questionCount = 10 } = {}) => {
    const categoriesPayload = {};

    selectedCategories.forEach((categoryId) => {
      const categoryKey = STUDY_TYPE_TO_CATEGORY_KEY[categoryId];
      const label = CATEGORY_LABELS[categoryKey];
      if (label && !categoriesPayload[label]) {
        categoriesPayload[label] = [];
      }
    });

    keywords.forEach((keyword) => {
      const label = KEYWORD_TO_CATEGORY_LABEL[keyword];
      if (!label) return;
      if (!categoriesPayload[label]) {
        categoriesPayload[label] = [];
      }
      if (!categoriesPayload[label].includes(keyword)) {
        categoriesPayload[label].push(keyword);
      }
    });

    if (Object.keys(categoriesPayload).length === 0) {
      categoriesPayload['일상생활'] = [];
    }

    const levelMapping = { A: '1', B: '2', C: '3', '1': '1', '2': '2', '3': '3' };
    const normalizedLevel = (level || 'B').toString().toUpperCase();
    const numericLevel = levelMapping[normalizedLevel] || levelMapping['B'];

    return JSON.stringify({
      categories: categoriesPayload,
      level: numericLevel,
      questionCount: questionCount || 10
    });
  }, []);

  // 추가 정보 초기화 함수 
  const resetAdditionalInfo = () => {
    setAdditionalInfoStep(1);
    setFormData({
      level: 'B',
      selectedCategories: [],
      keywords: []
    });
  };

  // 페이지 스크롤을 맨 위로 리셋하는 함수
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  const value = {
    user,
    setUser,
    studyProgress,
    setStudyProgress,

    // 학습 상태
    currentStep,
    setCurrentStep,
    selectedType,
    setSelectedType,
    selectedDifficulty,
    setSelectedDifficulty,
    currentQuestion,
    setCurrentQuestion,
    selectedAnswer,
    setSelectedAnswer,
    answers,
    setAnswers,
    showExplanation,
    setShowExplanation,
    studyResults,
    setStudyResults,

    // 상수
    STUDY_TYPES,
    KEYWORDS_BY_CATEGORY,
    LEVELS,
    QUESTION_TYPES,
    REVIEW_MODES,
    REVIEW_MESSAGES,
    QUESTION_TYPE_MAPPING,
    monthlyStats,
    studyStats,
    weeklyHours,


    // 추가 정보 
    additionalInfoStep,
    setAdditionalInfoStep,
    formData,
    setFormData,

    // Review 상태
    reviewMode,
    setReviewMode,
    currentReviewIndex,
    setCurrentReviewIndex,
    reviewQuestions,
    setReviewQuestions,
    reviewSelectedAnswer,
    setReviewSelectedAnswer,
    reviewShowResult,
    setReviewShowResult,

    // 헬퍼 함수
    getDifficultyText,
    handleCategoryToggle,
    handleKeywordToggle,
    buildSessionMetadata,
    resetAdditionalInfo,
    scrollToTop,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
