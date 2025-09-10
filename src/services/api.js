// 공용 API 유틸 (문제/단어)

const defaultHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// 단어 학습 관련

// 오늘의 단어 학습 - 오늘의 단어 조회
export const fetchTodayWords = async (userId) => {
  const res = await fetch(`/api/word-study/today-words/${userId}`, {
    method: 'GET',
    headers: defaultHeaders()
  });
  if (!res.ok) throw new Error(`today-words 실패: ${res.status}`);
  return res.json();
};

export const generateWordStudy = async (wordStudyRequestDto) => {
  const res = await fetch('/api/word-study/generate', {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify(wordStudyRequestDto)
  });
  if (!res.ok) throw new Error(`word-study generate 실패: ${res.status}`);
  return res.json();
};

export const fetchRecommendedWords = async (wordStudyRequestDto) => {
  const res = await fetch('/api/word-study/generate', {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify(wordStudyRequestDto)
  });
  if (!res.ok) throw new Error(`recommended-words 실패: ${res.status}`);
  return res.json();
};

// 복습/문제 관련
export const fetchWrongQuestions = async (userId) => {
  const url = `/api/quiz/user/${userId}/wrong-questions`;
  const res = await fetch(url, {
    method: 'GET',
    headers: defaultHeaders()
  });
  if (!res.ok) throw new Error(`wrong-questions 실패: ${res.status}`);
  return res.json();
};

export const fetchReviewQuiz = async (userId) => {
  const url = `/api/quiz/review?userId=${userId}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: defaultHeaders()
  });
  if (!res.ok) throw new Error(`review-quiz 실패: ${res.status}`);
  return res.json();
};

export const generateQuestions = async (questionGenerationRequestDto, options = {}) => {
  const { signal } = options; // AbortSignal 지원
  const res = await fetch('/api/generate/questions', {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify(questionGenerationRequestDto),
    ...(signal ? { signal } : {})
  });
  if (!res.ok) throw new Error(`questions generate 실패: ${res.status}`);
  return res.json();
};

export const createQuestionAnswer = async (questionAnswerCreateDto) => {
  const res = await fetch('/api/question-answers', {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify(questionAnswerCreateDto)
  });
  if (!res.ok) throw new Error(`question-answers 생성 실패: ${res.status}`);
  return res.json();
};

export const createLearningSession = async (learningSessionCreateDto) => {
  console.log('세션 생성 요청:', learningSessionCreateDto);
  const res = await fetch('/api/learning-sessions', {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify(learningSessionCreateDto)
  });
  console.log('세션 응답 상태:', res.status);
  if (!res.ok) {
    const errorText = await res.text();
    console.error('세션 생성 실패:', res.status, errorText);
    throw new Error(`세션 생성 실패: ${res.status} - ${errorText}`);
  }
  const result = await res.json();
  console.log('세션 생성 성공:', result);
  return result;
};


// updateLearningSessionProgress는 불필요함
// 이유: 학습 진행 상황은 createQuestionAnswer를 통해 문제별 답안을 저장하고,
// completeLearningSession을 통해 세션을 완료하는 방식으로 충분히 관리됨
// 별도의 진행률 업데이트 API는 중복된 기능임
// export const updateLearningSessionProgress = async ({ sessionId, isCorrect }) => {
//   const res = await fetch(`/api/learning-sessions/${encodeURIComponent(sessionId)}/progress`, {
//     method: 'POST',
//     headers: defaultHeaders(),
//     body: JSON.stringify({ isCorrect })
//   });
//   if (!res.ok) throw new Error(`세션 진행 업데이트 실패: ${res.status}`);
//   return res.json();
// };

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

// 세션의 문제 조회 - generateQuestions 사용
export const fetchSessionQuestions = async (questionGenerationRequestDto, options = {}) => {
  const { signal } = options;
  const res = await fetch('/api/generate/questions', {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify(questionGenerationRequestDto),
    ...(signal ? { signal } : {})
  });
  if (!res.ok) throw new Error(`세션 문제 조회 실패: ${res.status}`);
  return res.json();
};



