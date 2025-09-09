import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useApp } from '../../context/AppContext';
import { generateQuestions } from '../../services/api.js';

export function Sentence({ 
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

    const fetchSentenceQuestion = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const level = (formData.level || 'B').toUpperCase();
        const categoryMap = { business: '비즈니스', travel: '여행', daily: '일상생활', academic: '학업' };
        const majorCategory = categoryMap[selectedType] || '일상생활';

        const res = await generateQuestions({
          questionType: 'SENTENCE',
          difficulty: level,
          majorCategory,
          topics: formData.keywords || [],
          questionCount: 1
        });
        const q = Array.isArray(res?.questions) ? res.questions[0] : null;
        if (!q) throw new Error('문제 생성 실패');
        const options = [q.optionA, q.optionB, q.optionC].filter(Boolean);
        const letterToIndex = { A: 0, B: 1, C: 2 };
        const answerIndex = letterToIndex[(q.correctAnswer || '').toUpperCase()] ?? -1;
        const correctValue = answerIndex >= 0 ? options[answerIndex] : (q.correctAnswer || '');
        const mapped = {
          id: 'gen-sent-1',
          question: q.questionText || '',
          options,
          correctAnswer: correctValue,
          type: 'sentence',
          difficulty: q.difficulty || level,
          explanation: q.explanation || ''
        };
        setCurrentQuestion(mapped);
        if (onQuestionLoad) onQuestionLoad(mapped);
  
      } catch (err) {
        console.error('문장 문제 로드 실패:', err);
        setError('문제를 불러오는데 실패했습니다. API 서버가 실행 중인지 확인해주세요.');
      } finally {
        setLoading(false);
      }
    };
  
    // 학습 모드에서 문제 로드
    useEffect(() => {
      if (!question) {
        fetchSentenceQuestion();
      }}, [question]);

  if (loading) {
    return (
      <Card className="w-full max-w-4xl !px-4 !py-8">
        <CardContent className="!p-8">
          <div className="flex items-center justify-center !py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto !mb-4"></div>
              <p className="text-gray-600">문법 문제를 준비하고 있어요...</p>
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
              onClick={fetchSentenceQuestion} 
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
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              📝 {isStudyMode ? '문법 학습' : currentQuestion.category}
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

        {/* 문법 문제 특화: 빈칸 하이라이팅 */}
        <div className="bg-blue-50 !p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 font-medium !mb-2">📝 문법 문제</p>
          <p className="text-blue-800">
            빈칸에 들어갈 가장 적절한 답을 선택하세요.
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
                    ? '훌륭합니다! 문법 규칙을 정확히 적용하셨네요.' 
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