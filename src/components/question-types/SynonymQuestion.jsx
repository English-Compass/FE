import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useApp } from '../../context/AppContext';

export function SynonymQuestion({ 
  question, 
  selectedAnswer, 
  showResult, 
  onAnswerSelect,
  onQuestionLoad // 학습용 props 추가
}) {
  const { selectedType, formData, STUDY_TYPES, REVIEW_MESSAGES } = useApp();
  const [currentQuestion, setCurrentQuestion] = useState(question);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API 호출 함수
  const fetchSynonymQuestion = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. README에 명시된 API 엔드포인트로 요청합니다.
      // 특정 유형의 문제 하나만 가져오는 API가 필요합니다. (예: /api/quizzes/random?type=synonym)
      const response = await fetch(`http://localhost:8080/api/quizzes/random?type=synonym&level=${formData.level}`);

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 2. 서버에서 받은 데이터로 상태를 업데이트합니다.
      setCurrentQuestion(data);
      
      // 3. 부모 컴포넌트(StudySession)에 문제 정보를 전달합니다.
      if (onQuestionLoad) {
        onQuestionLoad(data);
      }

    } catch (err) {
      console.error('동의어 문제 로드 실패:', err);
      setError('문제를 불러오는데 실패했습니다. API 서버가 실행 중인지 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 학습 모드에서 문제 로드
  useEffect(() => {
    if (!question) {
      fetchSynonymQuestion();
    }}, [question]);

  if (loading) {
    return (
      <Card className="w-full max-w-4xl !px-4 !py-8">
        <CardContent className="!p-8">
          <div className="flex items-center justify-center !py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto !mb-4"></div>
              <p className="text-gray-600">동의어 문제를 준비하고 있어요...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl !px-4 !py-8">
        <CardContent className="!p-8">
          <div className="text-center !py-12">
            <p className="text-red-600 !mb-4">⚠️ {error}</p>
            <button 
              onClick={fetchSynonymQuestion}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              다시 시도
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion) return null;

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const studyType = STUDY_TYPES?.find(type => type.id === selectedType);
  const isStudyMode = !currentQuestion.date; // 날짜가 없으면 학습 모드

  return (
    <Card className="w-full max-w-4xl !px-4 !py-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
              🔗 {isStudyMode ? '동의어 찾기' : currentQuestion.category}
            </Badge>
            {studyType && (
              <Badge variant="secondary">
                {studyType.icon} {studyType.title}
              </Badge>
            )}
          </div>
          {isStudyMode ? (
            <Badge variant="outline">난이도: {currentQuestion.difficulty}</Badge>
          ) : (
            <Badge variant="secondary">{currentQuestion.date}</Badge>
          )}
        </div>
        <CardTitle className="text-lg leading-relaxed !mt-4">
          {currentQuestion.question}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="!space-y-4">
        {/* 복습 모드: 이전 틀린 답안 */}
        {!isStudyMode && showResult && currentQuestion.userAnswer && (
          <div className="bg-red-50 !p-3 rounded-lg border border-red-200">
            <p className="text-sm text-red-700">
              <span className="font-medium">이전 틀린 답안:</span> {currentQuestion.userAnswer}
            </p>
          </div>
        )}

        {/* 동의어 찾기 문제 설명 */}
        <div className="bg-indigo-50 !p-4 rounded-lg border border-indigo-200">
          <p className="text-sm text-indigo-700 font-medium !mb-2">🔗 동의어 찾기</p>
          <p className="text-indigo-800">
            밑줄 친 단어와 같은 뜻인 단어를 선택하세요.
          </p>
        </div>

        {/* 답변 옵션 */}
        <div className="!space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswerSelect(option)}
              disabled={showResult}
              className={`w-full !p-4 text-left rounded-lg border-2 transition-all ${
                selectedAnswer === option
                  ? showResult
                    ? option === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : 'border-red-500 bg-red-50 text-red-800'
                    : 'border-blue-500 bg-blue-50'
                  : showResult && option === currentQuestion.correctAnswer
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center !space-x-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswer === option
                    ? showResult
                      ? option === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-500'
                        : 'border-red-500 bg-red-500'
                      : 'border-blue-500 bg-blue-500'
                    : showResult && option === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300'
                }`}>
                  {(selectedAnswer === option || (showResult && option === currentQuestion.correctAnswer)) && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                  )}
                </div>
                <span className="font-medium">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* 결과 및 설명 */}
        {showResult && (
          <div className={`!p-4 rounded-lg ${
            isCorrect 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center !space-x-2 !mb-2">
              {isCorrect ? (
                <>
                  <span className="text-2xl">{REVIEW_MESSAGES?.CORRECT?.emoji || '✅'}</span>
                  <span className="font-semibold text-green-800">
                    {REVIEW_MESSAGES?.CORRECT?.title || '정답입니다!'}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-2xl">{REVIEW_MESSAGES?.INCORRECT?.emoji || '❌'}</span>
                  <span className="font-semibold text-red-800">
                    {REVIEW_MESSAGES?.INCORRECT?.title || '틀렸습니다'}
                  </span>
                </>
              )}
            </div>
            <p className={`text-sm !mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect 
                ? (isStudyMode 
                    ? '훌륭합니다! 동의어를 정확히 찾아내셨네요.' 
                    : (REVIEW_MESSAGES?.CORRECT?.description || '정답입니다!'))
                : `정답은 "${currentQuestion.correctAnswer}" 입니다.`
              }
            </p>
            {/* 학습 모드에서 추가 설명 */}
            {isStudyMode && currentQuestion.explanation && (
              <div className="!mt-3 !pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">💡 설명:</span> {currentQuestion.explanation}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
