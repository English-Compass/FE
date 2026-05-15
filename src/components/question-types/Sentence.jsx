import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useApp } from '../../context/AppContext';

export function Sentence({
  question,
  selectedAnswer,
  showResult,
  onAnswerSelect,
}) {
  const { STUDY_TYPES, REVIEW_MESSAGES, selectedType } = useApp();

  // Dummy data: used if question prop is not provided
  const dummyQuestions = [
    {
      id: 'dummy-sent-1',
      question: 'The new marketing campaign has been very _____.',
      options: ['success', 'successful', 'successfully'],
      correctAnswer: 'successful',
      type: 'sentence',
      difficulty: 'B',
      explanation: "'very' 다음에는 형용사가 와서 주어를 설명해야 합니다. 'successful'은 형용사입니다.",
      category: 'Business'
    },
    {
      id: 'dummy-sent-2',
      question: 'She is looking forward to _____ her new job.',
      options: ['start', 'starting', 'to start'],
      correctAnswer: 'starting',
      type: 'sentence',
      difficulty: 'A',
      explanation: "'look forward to' 다음에는 동명사가 와야 합니다.",
      category: 'Daily'
    },
    {
      id: 'dummy-sent-3',
      question: 'If I _____ a bird, I would fly to you.',
      options: ['was', 'were', 'am'],
      correctAnswer: 'were',
      type: 'sentence',
      difficulty: 'C',
      explanation: "가정법 과거에서는 be동사로 'were'를 사용합니다.",
      category: 'Academic'
    },
    {
      id: 'dummy-sent-4',
      question: 'Despite _____ hard, he failed the exam.',
      options: ['working', 'worked', 'to work'],
      correctAnswer: 'working',
      type: 'sentence',
      difficulty: 'B',
      explanation: "'despite' 다음에는 명사 또는 동명사가 와야 합니다.",
      category: 'Business'
    },
    {
      id: 'dummy-sent-5',
      question: "The book was _____ interesting that I couldn't put it down.",
      options: ['so', 'such', 'very'],
      correctAnswer: 'so',
      type: 'sentence',
      difficulty: 'A',
      explanation: "'so ~ that' 구문은 '너무 ~해서 ...하다'라는 의미를 가집니다.",
      category: 'Daily'
    }
  ];

  const currentQuestion = question || dummyQuestions[Math.floor(Math.random() * dummyQuestions.length)];

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const studyType = STUDY_TYPES?.find(type => type.id === selectedType);
  const isStudyMode = !currentQuestion.date; // No date means study mode

  // Function to highlight the blank in the sentence
  const highlightBlank = (text) => {
    const parts = text.split('_____');
    if (parts.length < 2) return text;
    return (
      <>
        {parts[0]}
        <span className="font-bold text-blue-600">_____</span>
        {parts[1]}
      </>
    );
  };

  return (
    <Card className="w-full max-w-4xl !px-4 !py-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              📝 {isStudyMode ? '동의어 학습' : currentQuestion.category}
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
        {/* Original CardTitle for question */}
        <CardTitle className="text-lg leading-relaxed !mt-4">
          {highlightBlank(currentQuestion.question)}
        </CardTitle>
      </CardHeader>

      <CardContent className="!space-y-4">
        {/* Review mode: previous wrong answer */}
        {!isStudyMode && showResult && currentQuestion.userAnswer && (
          <div className="bg-red-50 !p-3 rounded-lg border border-red-200">
            <p className="text-sm text-red-700">
              <span className="font-medium">이전 틀린 답안:</span> {currentQuestion.userAnswer}
            </p>
          </div>
        )}

        {/* Sentence specific: blank highlighting */}
        <div className="bg-blue-50 !p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 font-medium !mb-2">📝 동의어 문제</p>
          <p className="text-blue-800">
            밑줄친 문장과 동일한 의미의 숙어를 선택하세요.
          </p>
        </div>

        {/* Answer options */}
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

        {/* Result and explanation */}
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
            {/* Additional explanation in study mode */}
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