import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useApp } from '../../context/AppContext';

export function SynonymSentenceQuestion({ 
  question, 
  selectedAnswer, 
  showResult, 
  onAnswerSelect,
  onQuestionLoad
}) {
  const { selectedType, formData, STUDY_TYPES, REVIEW_MESSAGES } = useApp();
  const [currentQuestion, setCurrentQuestion] = useState(question);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSynonymSentenceQuestion = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8080/api/quizzes/random?type=synonym-sentence&level=${formData.level}`);

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }
      
      const data = await response.json();
      setCurrentQuestion(data);
      
      if (onQuestionLoad) {
        onQuestionLoad(data);
      }

    } catch (err) {
      console.error('동의어 문장 문제 로드 실패:', err);
      setError('문제를 불러오는데 실패했습니다. API 서버가 실행 중인지 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!question) {
      fetchSynonymSentenceQuestion();
    }
  }, [question]);

  if (loading) {
    return (
      <Card className="w-full max-w-4xl !px-4 !py-8">
        <CardContent className="!p-8">
          <div className="flex items-center justify-center !py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto !mb-4"></div>
              <p className="text-gray-600">동의어 문장 문제를 준비하고 있어요...</p>
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
              onClick={fetchSynonymSentenceQuestion}
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
  const isStudyMode = !currentQuestion.date;

  // 밑줄 친 부분을 강조하는 함수
  const renderQuestionWithUnderline = (questionText) => {
    if (!questionText) return questionText;
    
    // ___로 감싸진 부분을 밑줄로 변경
    return questionText.split(/___([^_]+)___/).map((part, index) => {
      if (index % 2 === 1) {
        // 홀수 인덱스는 밑줄 친 부분
        return (
          <span key={index} className="underline decoration-2 decoration-blue-500 font-semibold text-blue-700">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <Card className="w-full max-w-4xl !px-4 !py-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              📝 {isStudyMode ? '동의어 문장' : currentQuestion.category}
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
      </CardHeader>
      
      <CardContent className="!space-y-4">
        {!isStudyMode && showResult && currentQuestion.userAnswer && (
          <div className="bg-red-50 !p-3 rounded-lg border border-red-200">
            <p className="text-sm text-red-700">
              <span className="font-medium">이전 틀린 답안:</span> {currentQuestion.userAnswer}
            </p>
          </div>
        )}

        <div className="bg-purple-50 !p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-700 font-medium !mb-2">📝 동의어 문장</p>
          <p className="text-purple-800">
            밑줄 친 부분과 같은 의미를 가진 문장을 선택하세요.
          </p>
        </div>

        <div className="bg-gray-50 !p-4 rounded-lg border border-gray-200">
          <p className="text-lg font-semibold text-blue-800 leading-relaxed">
            {renderQuestionWithUnderline(currentQuestion.question)}
          </p>
        </div>

        <CardTitle className="text-lg !mt-6 !mb-4 text-gray-700">
          밑줄 친 부분과 같은 의미인 문장을 선택하세요:
        </CardTitle>

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
                    ? '훌륭합니다! 문맥의 의미를 정확히 파악하셨네요.' 
                    : (REVIEW_MESSAGES?.CORRECT?.description || '정답입니다!'))
                : `정답은 "${currentQuestion.correctAnswer}" 입니다.`
              }
            </p>
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