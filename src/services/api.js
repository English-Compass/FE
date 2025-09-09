// 공용 API 유틸 (문제/단어)

const defaultHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// 단어 학습 관련
export const fetchTodayWords = async (userId) => {
  const res = await fetch(`/api/word-study/today-words/${userId}`, {
    method: 'GET',
    headers: defaultHeaders()
  });
  if (!res.ok) throw new Error(`today-words 실패: ${res.status}`);
  return res.json();
};

export const generateWordStudy = async ({ userId, wordCount = 20, focusCategory = null, targetDifficulty = null }) => {
  const res = await fetch('/api/word-study/generate', {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify({ userId, wordCount, focusCategory, targetDifficulty })
  });
  if (!res.ok) throw new Error(`word-study generate 실패: ${res.status}`);
  return res.json();
};

export const fetchRecommendedWords = async ({ userId, level = 'B', limit = 50 }) => {
  // level: A/B/C
  const body = {
    userId,
    wordCount: Math.min(Math.max(limit, 5), 50),
    focusCategory: null,
    targetDifficulty: level
  };
  const res = await fetch('/api/word-study/generate', {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`recommended-words 실패: ${res.status}`);
  return res.json();
};

// 복습/문제 관련
export const fetchWrongQuestions = async (userId) => {
  const url = `/api/quiz/user/${encodeURIComponent(userId)}/wrong-questions`;
  const res = await fetch(url, {
    method: 'GET',
    headers: defaultHeaders()
  });
  if (!res.ok) throw new Error(`wrong-questions 실패: ${res.status}`);
  return res.json();
};

export const fetchReviewQuiz = async (userId) => {
  const url = `/api/quiz/review?userId=${encodeURIComponent(userId)}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: defaultHeaders()
  });
  if (!res.ok) throw new Error(`review-quiz 실패: ${res.status}`);
  return res.json();
};

export const generateQuestions = async (payload, options = {}) => {
  const { signal } = options; // AbortSignal 지원
  const res = await fetch('/api/questions/generate', {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify(payload),
    ...(signal ? { signal } : {})
  });
  if (!res.ok) throw new Error(`questions generate 실패: ${res.status}`);
  return res.json();
};

export const createQuestionAnswer = async (payload) => {
  // payload: { sessionId, questionId, sessionType, userAnswer(A/B/C), isCorrect, timeSpent? }
  const res = await fetch('/api/question-answers', {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`question-answers 생성 실패: ${res.status}`);
  return res.json();
};

export const createReviewSession = async ({ userId, categories = [], sessionMetadata = 'review' }) => {
  const body = {
    userId,
    sessionType: 'REVIEW',
    sessionMetadata,
    categories
  };
  console.log('🔄 복습세션 생성 요청:', body);
  const res = await fetch('/api/learning-sessions/review', {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify(body)
  });
  console.log('🔄 복습세션 응답 상태:', res.status);
  if (!res.ok) {
    const errorText = await res.text();
    console.error('🔄 복습세션 생성 실패:', res.status, errorText);
    throw new Error(`review 세션 생성 실패: ${res.status} - ${errorText}`);
  }
  const result = await res.json();
  console.log('🔄 복습세션 생성 성공:', result);
  return result;
};

export const updateLearningSessionProgress = async ({ sessionId, isCorrect }) => {
  const res = await fetch(`/api/learning-sessions/${encodeURIComponent(sessionId)}/progress`, {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify({ isCorrect })
  });
  if (!res.ok) throw new Error(`세션 진행 업데이트 실패: ${res.status}`);
  return res.json();
};

export const startLearningSession = async (sessionId) => {
  const res = await fetch(`/api/learning-sessions/${encodeURIComponent(sessionId)}/start`, {
    method: 'POST',
    headers: defaultHeaders()
  });
  if (!res.ok) throw new Error(`세션 시작 실패: ${res.status}`);
  return res.json();
};

export const completeLearningSession = async (sessionId) => {
  const res = await fetch(`/api/learning-sessions/${encodeURIComponent(sessionId)}/complete`, {
    method: 'POST',
    headers: defaultHeaders()
  });
  if (!res.ok) throw new Error(`세션 완료 실패: ${res.status}`);
  return res.json();
};

export const createPracticeSession = async ({ userId, categories = [], sessionMetadata = 'practice' }) => {
  const body = { userId, sessionType: 'PRACTICE', sessionMetadata, categories };
  const res = await fetch('/api/learning-sessions/practice', {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`practice 세션 생성 실패: ${res.status}`);
  return res.json();
};

export const createWrongAnswerSession = async ({ userId, categories = [], sessionMetadata = 'wrong-answer' }) => {
  const body = {
    userId,
    sessionType: 'WRONG_ANSWER',
    sessionMetadata,
    categories  // 올바른 파라미터명 사용
  };
  console.log('❌ 오답세션 생성 요청:', body);
  const res = await fetch('/api/learning-sessions/wrong-answer', {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify(body)
  });
  console.log('❌ 오답세션 응답 상태:', res.status);
  if (!res.ok) {
    const errorText = await res.text();
    console.error('❌ 오답세션 생성 실패:', res.status, errorText);
    throw new Error(`오답 세션 생성 실패: ${res.status} - ${errorText}`);
  }
  const result = await res.json();
  console.log('❌ 오답세션 생성 성공:', result);
  return result;
};

export const fetchSessionQuestions = async (sessionId) => {
  const res = await fetch(`/api/learning-sessions/${encodeURIComponent(sessionId)}/questions`, {
    method: 'GET',
    headers: defaultHeaders()
  });
  if (!res.ok) throw new Error(`세션 문제 조회 실패: ${res.status}`);
  return res.json();
};


