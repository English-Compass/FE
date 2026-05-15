// 공용 API 유틸 (문제/단어)

// HttpOnly 쿠키(access_token)가 있으면 자동으로 전송됨
// Gateway가 쿠키에서 토큰을 추출하여 검증하므로 Authorization 헤더 불필요
const defaultHeaders = () => {
  return {
    'Content-Type': 'application/json'
  };
};

// 모든 fetch 요청에 credentials: 'include' 추가를 위한 헬퍼 함수
const defaultFetchOptions = () => {
  return {
    credentials: 'include' // 쿠키 전달 필수! (HttpOnly 쿠키 포함)
  };
};

// 단어 학습 관련

// 오늘의 단어 학습 - 오늘의 단어 조회
export const fetchTodayWords = async (userId) => {
  const res = await fetch(`/api/problem/word-study/users/${userId}/today`, {
    method: 'GET',
    headers: defaultHeaders(),
    ...defaultFetchOptions()
  });
  if (!res.ok) throw new Error(`today-words 실패: ${res.status}`);
  return res.json();
};

export const generateWordStudy = async (wordStudyRequestDto) => {
  const res = await fetch('/api/problem/word-study', {
    method: 'POST',
    headers: defaultHeaders(),
    ...defaultFetchOptions(),
    body: JSON.stringify(wordStudyRequestDto)
  });
  if (!res.ok) throw new Error(`word-study generate 실패: ${res.status}`);
  return res.json();
};

export const fetchRecommendedWords = async (wordStudyRequestDto) => {
  const res = await fetch('/api/problem/word-study', {
    method: 'POST',
    headers: defaultHeaders(),
    ...defaultFetchOptions(),
    body: JSON.stringify(wordStudyRequestDto)
  });
  if (!res.ok) throw new Error(`recommended-words 실패: ${res.status}`);
  return res.json();
};

// 복습/문제 관련
// 가장 최근 학습 세션의 오답 문제만 조회
export const fetchWrongQuestions = async (userId, latestSessionOnly = true) => {
  const url = latestSessionOnly 
    ? `/api/problem/quiz/users/${userId}/wrong-questions?latestSessionOnly=true`
    : `/api/problem/quiz/users/${userId}/wrong-questions`;
  const res = await fetch(url, {
    method: 'GET',
    headers: defaultHeaders(),
    ...defaultFetchOptions()
  });
  if (!res.ok) throw new Error(`wrong-questions 실패: ${res.status}`);
  return res.json();
};

export const fetchReviewQuiz = async (userId) => {
  const url = `/api/problem/quiz/review?userId=${userId}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: defaultHeaders(),
    ...defaultFetchOptions()
  });
  if (!res.ok) throw new Error(`review-quiz 실패: ${res.status}`);
  return res.json();
};

export const generateQuestions = async (questionGenerationRequestDto, options = {}) => {
  const { signal } = options; // AbortSignal 지원
  const res = await fetch('/api/problem/questions/generate', {
    method: 'POST',
    headers: defaultHeaders(),
    ...defaultFetchOptions(),
    body: JSON.stringify(questionGenerationRequestDto),
    ...(signal ? { signal } : {})
  });
  if (!res.ok) throw new Error(`questions generate 실패: ${res.status}`);
  return res.json();
};

export const createQuestionAnswer = async (questionAnswerCreateDto) => {
  const res = await fetch('/api/problem/question-answers', {
    method: 'POST',
    headers: defaultHeaders(),
    ...defaultFetchOptions(),
    body: JSON.stringify(questionAnswerCreateDto)
  });
  if (!res.ok) throw new Error(`question-answers 생성 실패: ${res.status}`);
  return res.json();
};

// 복습 세션 생성 (createLearningSessionWithQuestions를 사용)
export const createReviewSession = async ({ userId, sessionMetadata, sessionType = 'REVIEW' }) => {
  console.log('📝 [API] 리뷰 세션 생성 요청:', { userId, sessionType, sessionMetadata });
  if (!sessionMetadata) {
    throw new Error('sessionMetadata is required to create a review session.');
  }

  return createLearningSessionWithQuestions({
    userId,
    sessionType,
    sessionMetadata
  });
};

// 오답 세션 생성
export const createWrongAnswerSession = async (sessionCreateDto) => {
  console.log('오답 세션 생성 요청:', sessionCreateDto);
  const res = await fetch('/api/problem/sessions/wrong-answer', {
    method: 'POST',
    headers: defaultHeaders(),
    ...defaultFetchOptions(),
    body: JSON.stringify(sessionCreateDto)
  });
  console.log('오답 세션 응답 상태:', res.status);
  if (!res.ok) {
    const errorText = await res.text();
    console.error('오답 세션 생성 실패:', res.status, errorText);
    throw new Error(`오답 세션 생성 실패: ${res.status} - ${errorText}`);
  }
  const result = await res.json();
  console.log('오답 세션 생성 성공:', result);
  return result;
};

// ============================================
// 새로운 학습 세션 플로우 API
// ============================================

// 1. 세션 생성 + 문제 할당 (10문제)
// POST /api/problem/learning-sessions
// 요청: { userId, sessionType, sessionMetadata (JSON 문자열), categories }
// 응답: { sessionId, userId, status, sessionType, totalQuestions, ... }
export const createLearningSessionWithQuestions = async (sessionCreateDto) => {
  console.log('📝 [API] 학습 세션 생성 + 문제 할당 요청:', sessionCreateDto);
  const res = await fetch('/api/problem/learning-sessions', {
    method: 'POST',
    headers: defaultHeaders(),
    ...defaultFetchOptions(),
    body: JSON.stringify(sessionCreateDto)
  });
  console.log('📝 [API] 세션 생성 응답 상태:', res.status);
  if (!res.ok) {
    const errorText = await res.text();
    console.error('📝 [API] 세션 생성 실패:', res.status, errorText);
    throw new Error(`세션 생성 실패: ${res.status} - ${errorText}`);
  }
  const result = await res.json();
  console.log('📝 [API] 세션 생성 성공:', result);
  return result;
};

// 2. 세션의 문제 조회
// GET /api/problem/learning-sessions/{sessionId}/questions
// 응답: [{ sessionQuestionId, sessionId, questionId, questionOrder, categories, question: {...} }, ...]
export const fetchSessionQuestions = async (sessionId) => {
  console.log('📖 [API] 세션 문제 조회 요청:', sessionId);
  const res = await fetch(`/api/problem/learning-sessions/${encodeURIComponent(sessionId)}/questions`, {
    method: 'GET',
    headers: defaultHeaders(),
    ...defaultFetchOptions()
  });
  console.log('📖 [API] 문제 조회 응답 상태:', res.status);
  if (!res.ok) {
    const errorText = await res.text();
    console.error('📖 [API] 문제 조회 실패:', res.status, errorText);
    throw new Error(`문제 조회 실패: ${res.status} - ${errorText}`);
  }
  const result = await res.json();
  console.log('📖 [API] 문제 조회 성공:', result);
  // 응답이 배열인지 확인
  return Array.isArray(result) ? result : (result.questions || []);
};

// 3. 답변 제출
// POST /api/problem/learning-sessions/{sessionId}/answers
// 요청: { questionId, isCorrect }
// 응답: { sessionId, userId, status, totalQuestions, answeredQuestions, correctAnswers, wrongAnswers, progressPercentage, ... }
export const submitAnswer = async (sessionId, answerDto) => {
  console.log('✏️ [API] 답변 제출 요청:', { 
    sessionId, 
    answerDto,
    timestamp: new Date().toISOString()
  });
  
  // 요청 본문 검증
  if (!sessionId || !answerDto || !answerDto.questionId) {
    const errorMsg = `답변 제출 요청 검증 실패: sessionId=${sessionId}, questionId=${answerDto?.questionId}`;
    console.error('✏️ [API]', errorMsg);
    throw new Error(errorMsg);
  }
  
  const res = await fetch(`/api/problem/learning-sessions/${encodeURIComponent(sessionId)}/answers`, {
    method: 'POST',
    headers: defaultHeaders(),
    ...defaultFetchOptions(),
    body: JSON.stringify(answerDto)
  });
  
  console.log('✏️ [API] 답변 제출 응답 상태:', res.status);
  
  if (!res.ok) {
    let errorText = '';
    let errorJson = null;
    
    try {
      errorText = await res.text();
      // JSON 형식인지 확인
      try {
        errorJson = JSON.parse(errorText);
      } catch (e) {
        // JSON이 아니면 텍스트 그대로 사용
      }
    } catch (e) {
      errorText = `응답 본문 읽기 실패: ${e.message}`;
    }
    
    const errorDetails = {
      status: res.status,
      statusText: res.statusText,
      errorText: errorText,
      errorJson: errorJson,
      requestData: { sessionId, answerDto },
      timestamp: new Date().toISOString()
    };
    
    console.error('✏️ [API] 답변 제출 실패 상세:', errorDetails);
    
    // 에러 메시지 구성
    let errorMessage = `답변 제출 실패: ${res.status}`;
    if (errorJson?.message) {
      errorMessage += ` - ${errorJson.message}`;
    } else if (errorText) {
      errorMessage += ` - ${errorText.substring(0, 200)}`; // 최대 200자
    }
    
    throw new Error(errorMessage);
  }
  
  const result = await res.json();
  console.log('✏️ [API] 답변 제출 성공:', result);
  // 응답: updatedSession.progressPercentage, updatedSession.answeredQuestions 등
  return result;
};

// 4. 세션 완료
// PATCH /api/problem/learning-sessions/{sessionId}
// 요청: { status: 'COMPLETED' }
// 응답: { ... }
export const completeLearningSession = async (sessionId) => {
  console.log('✅ [API] 세션 완료 요청:', sessionId);
  const res = await fetch(`/api/problem/learning-sessions/${encodeURIComponent(sessionId)}`, {
    method: 'PATCH',
    headers: defaultHeaders(),
    ...defaultFetchOptions(),
    body: JSON.stringify({ status: 'COMPLETED' })
  });
  console.log('✅ [API] 세션 완료 응답 상태:', res.status);
  if (!res.ok) {
    const errorText = await res.text();
    console.error('✅ [API] 세션 완료 실패:', res.status, errorText);
    throw new Error(`세션 완료 실패: ${res.status} - ${errorText}`);
  }
  const result = await res.json();
  console.log('✅ [API] 세션 완료 성공:', result);
  return result;
};

// ============================================
// 기존 API (하위 호환성 유지)
// ============================================

// 일반 학습 세션 생성 (기존 함수 유지 - 다른 곳에서 사용할 수 있음)
export const createLearningSession = async (learningSessionCreateDto) => {
  console.log('세션 생성 요청:', learningSessionCreateDto);
  const res = await fetch('/api/problem/learning-sessions', {
    method: 'POST',
    headers: defaultHeaders(),
    ...defaultFetchOptions(),
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

export const startLearningSession = async (sessionId) => {
  const res = await fetch(`/api/problem/learning-sessions/${encodeURIComponent(sessionId)}/start`, {
    method: 'POST',
    headers: defaultHeaders(),
    ...defaultFetchOptions()
  });
  if (!res.ok) throw new Error(`세션 시작 실패: ${res.status}`);
  return res.json();
};



