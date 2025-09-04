import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

// 상수 데이터들을 컴포넌트 정의
const STUDY_TYPES = [
  { id: 'business', title: '비즈니스', icon: '💼', description: '회의, 회사, 미팅' },
  { id: 'travel', title: '여행', icon: '✈️', description: '배낭, 가족, 친구' },
  { id: 'daily', title: '일상', icon: '🏠', description: '가족, 친구, 선생님' },
  { id: 'academic', title: '학술', icon: '🎓', description: '대학교, 학원, 대학원' }
];

// 카테고리 매핑: 프론트엔드 ID -> 데이터베이스 값
const CATEGORY_MAPPING = {
  business: 'business',
  travel: 'travel', 
  daily: 'daily',
  academic: 'school'  // academic -> school 매핑
};

// 키워드 별 분류 (한국어 표시용)
const KEYWORDS_BY_CATEGORY = {
  travel: ['배낭여행', '가족여행', '친구와 여행'],
  business: ['고객 서비스', '이메일 보고서', '미팅 회의'],
  academic: ['과제 시험 준비', '수업 참여', '학과 대화'],
  daily: ['쇼핑 외식', '병원 이용', '대중교통 이용']
};

// 키워드 매핑: 한국어 -> 데이터베이스 값
const KEYWORD_MAPPING = {
  // Travel keywords
  '배낭여행': 'backpacking',
  '가족여행': 'family_trip', 
  '친구와 여행': 'trip_with_friends',
  
  // Business keywords  
  '고객 서비스': 'customer_service',
  '이메일 보고서': 'email_report',
  '미팅 회의': 'meeting_conference',
  
  // Academic keywords
  '과제 시험 준비': 'assignment_test_preparation',
  '수업 참여': 'attending_class',
  '학과 대화': 'department_conversation',
  
  // Daily keywords
  '쇼핑 외식': 'shopping_eating_out',
  '병원 이용': 'using_hospital', 
  '대중교통 이용': 'using_public_transportation'
};

// API: 사용자의 학습 통계 데이터를 가져오는 함수
const fetchUserStats = async (userId) => {
  try {
    // 사용자의 평균 진행률 조회
    const avgProgressResponse = await fetch(`http://localhost:8081/api/learning-sessions/user/${userId}/average-progress`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const averageProgress = await avgProgressResponse.json();

    // 완료된 세션 수 조회
    const completedSessionsResponse = await fetch(`http://localhost:8081/api/learning-sessions/user/${userId}/status/COMPLETED/count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const completedSessions = await completedSessionsResponse.json();

    // 최근 30일간의 학습 세션 조회
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const recentSessionsResponse = await fetch(`http://localhost:8081/api/learning-sessions/user/${userId}/date-range?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const recentSessions = await recentSessionsResponse.json();

    return {
      averageProgress,
      completedSessions,
      recentSessions
    };
  } catch (error) {
    console.error('사용자 통계 조회 실패:', error);
    return null;
  }
};

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
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 'user_123', // API에서 사용할 실제 사용자 ID
    name: '김영희',
    email: 'test@example.com',
    level: 'B',
    joinDate: '2024-01-15',
    streak: 7
  });
  const [studyProgress, setStudyProgress] = useState({
    completed: 15,
    dailyGoal: 30,
  });

  // 사용자 통계 데이터 상태
  const [monthlyStats, setMonthlyStats] = useState({
    totalMinutes: 680,
    averageAccuracy: 87,
    completedLessons: 45,
  });
  const [studyStats, setStudyStats] = useState({ totalHours: 24.5 });
  const [weeklyHours, setWeeklyHours] = useState([
    { day: 'Mon', hours: 2.5 }, { day: 'Tue', hours: 3.0 }, { day: 'Wed', hours: 2.0 },
    { day: 'Thu', hours: 4.5 }, { day: 'Fri', hours: 5.0 }, { day: 'Sat', hours: 3.5 },
    { day: 'Sun', hours: 4.0 }
  ]);

  // 학습 관련 상태들
  const [currentStep, setCurrentStep] = useState('type'); // type, studysession, complete
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
          KEYWORDS_BY_CATEGORY[catId]?.includes(keyword)
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

  // 한국어 카테고리를 영어 데이터베이스 값으로 변환
  const mapCategoriesToEnglish = (koreanCategories) => {
    return koreanCategories.map(category => CATEGORY_MAPPING[category] || category);
  };

  // 한국어 키워드를 영어 데이터베이스 값으로 변환  
  const mapKeywordsToEnglish = (koreanKeywords) => {
    return koreanKeywords.map(keyword => KEYWORD_MAPPING[keyword] || keyword);
  };

  // 사용자 통계 데이터를 API에서 가져오기
  useEffect(() => {
    const loadUserStats = async () => {
      const statsData = await fetchUserStats(user.id);
      
      if (statsData) {
        // API 데이터를 기존 형태로 변환하여 설정
        setMonthlyStats({
          totalMinutes: Math.round(statsData.recentSessions.length * 15), // 세션당 평균 15분
          averageAccuracy: Math.round(statsData.averageProgress * 100),
          completedLessons: statsData.completedSessions,
        });
        
        setStudyStats({ 
          totalHours: Math.round((statsData.completedSessions * 15) / 60 * 10) / 10 
        });
        
        // 최근 7일간 일별 학습 시간 계산
        const last7Days = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
          
          // 해당 날짜의 세션 수 계산
          const sessionsOnDay = statsData.recentSessions.filter(session => {
            const sessionDate = new Date(session.createdAt);
            return sessionDate.toDateString() === date.toDateString();
          }).length;
          
          last7Days.push({
            day: dayName,
            hours: Math.round(sessionsOnDay * 0.25 * 10) / 10 // 세션당 15분 = 0.25시간
          });
        }
        
        setWeeklyHours(last7Days);
      }
    };
    
    loadUserStats();
  }, [user.id]);

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
    resetAdditionalInfo,
    scrollToTop,
    mapCategoriesToEnglish,
    mapKeywordsToEnglish,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
