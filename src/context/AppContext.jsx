import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

// 상수 데이터들을 컴포넌트 정의
const STUDY_TYPES = [
  { id: 'business', title: '비즈니스', icon: '💼', description: '회의, 회사, 미팅' },
  { id: 'travel', title: '여행', icon: '✈️', description: '배낭, 가족, 친구' },
  { id: 'daily', title: '일상', icon: '🏠', description: '가족, 친구, 선생님' },
  { id: 'academic', title: '학술', icon: '🎓', description: '대학교, 학원, 대학원' }
];

// 키워드 별 분류
const KEYWORDS_BY_CATEGORY = {
  travel: ['배낭여행', '가족여행', '친구와 여행', '해외여행', '호텔', '관광지'],
  business: ['회사업무', '미팅', '회의', '프레젠테이션', '비즈니스 이메일', '협상'],
  academic: ['대학교', '학원', '대학원', '연구', '논문', '발표'],
  daily: ['가족', '친구', '선생님', '쇼핑', '식당', '병원']
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
  { id: 'word', title: '단어', icon: '💼', description: '단어 학습' },
  { id: 'sentence', title: '문장', icon: '✈️', description: '문장 학습' },
  { id: 'speech', title: '대화', icon: '🏠', description: '대화 학습' },
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
  'word': '단어',
  'sentence': '문장', 
  'speech': '대화'
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
  const [user, setUser] = useState(null);
  const [studyProgress, setStudyProgress] = useState({
    completed: 0,
    dailyGoal: 30,
  });

  // 학습 관련 상태들
  const [currentStep, setCurrentStep] = useState('type'); // type, difficulty, study, complete
  const [selectedType, setSelectedType] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState(3);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

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
      keywords: []
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

    // 상수
    STUDY_TYPES,
    KEYWORDS_BY_CATEGORY,
    LEVELS,
    QUESTION_TYPES,
    REVIEW_MODES,
    REVIEW_MESSAGES,
    QUESTION_TYPE_MAPPING,

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
    handleKeywordToggle,
    resetAdditionalInfo,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
