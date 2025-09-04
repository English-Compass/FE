import React, { useState, useEffect} from 'react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { useApp } from '../../context/AppContext';

import { Word } from '../question-types/Word';
import { Sentence } from '../question-types/Sentence';
import { Conversation } from '../question-types/Conversation';

export default function StudySession({ onStudyComplete }) {
    const { selectedType, STUDY_TYPES, formData, getDifficultyText, setCurrentStep, mapCategoriesToEnglish, mapKeywordsToEnglish} = useApp();

        // --- 상태 관리 ---
    const [questions, setQuestions] = useState([]); // API로부터 받아온 문제 목록
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [answers, setAnswers] = useState([]);
    const [showResult, setShowResult] = useState(false);

     // --- 데이터 로딩 ---
    useEffect(() => {
        console.log('🚀 StudySession useEffect triggered');
        console.log('Form data:', formData);
        
        const fetchQuestions = async () => {
            try {
                // 카테고리가 선택되지 않았다면 에러 처리
                if (!formData.selectedCategories || formData.selectedCategories.length === 0) {
                    console.log('❌ No categories selected');
                    setError('학습 카테고리를 선택해주세요.');
                    setIsLoading(false);
                    return;
                }

                // 1. 학습 세션 생성 (한국어를 영어로 변환)
                const englishCategories = mapCategoriesToEnglish(formData.selectedCategories);
                const englishKeywords = mapKeywordsToEnglish(formData.keywords);
                
                console.log('=== SESSION CREATION START ===');
                console.log('Original categories:', formData.selectedCategories);
                console.log('Mapped categories:', englishCategories);
                console.log('Original keywords:', formData.keywords);
                console.log('Mapped keywords:', englishKeywords);
                console.log('Form data level:', formData.level);
                
                const sessionResponse = await fetch('http://localhost:8081/api/learning-sessions/practice', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: "user_123", // 실제 사용자 ID 사용
                        sessionType: 'PRACTICE',
                        sessionMetadata: JSON.stringify({
                            categories: englishCategories,
                            keywords: englishKeywords,
                            level: formData.level,
                            questionCount: 10
                        })
                    })
                });
                
                if (!sessionResponse.ok) {
                    throw new Error('세션 생성 실패');
                }
                
                const sessionData = await sessionResponse.json();
                const sessionId = sessionData.sessionId;
                console.log('✅ Session created successfully:', sessionData);
                console.log('Session ID:', sessionId);
                
                // 2. 세션 시작
                console.log('=== STARTING SESSION ===');
                const startResponse = await fetch(`http://localhost:8081/api/learning-sessions/${sessionId}/start`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (startResponse.ok) {
                    console.log('✅ Session started successfully');
                } else {
                    console.error('❌ Session start failed:', startResponse.status, startResponse.statusText);
                }
                
                // 3. 세션의 문제들 조회
                console.log('=== LOADING QUESTIONS ===');
                const questionsResponse = await fetch(`http://localhost:8081/api/learning-sessions/${sessionId}/questions`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!questionsResponse.ok) {
                    throw new Error('문제 조회 실패');
                }
                
                const sessionQuestions = await questionsResponse.json();
                console.log('✅ Questions loaded successfully:', sessionQuestions);
                console.log('Total questions received:', sessionQuestions.length);
                
                // SessionQuestion 형태를 StudySession에서 사용하는 형태로 변환
                console.log('=== MAPPING QUESTIONS ===');
                const formattedQuestions = sessionQuestions.map((sq, index) => {
                    const options = [sq.question.optionA, sq.question.optionB, sq.question.optionC];
                    // correctAnswer를 실제 답안 텍스트로 변환 (A -> optionA의 값)
                    const correctAnswerText = sq.question.correctAnswer === 'A' ? sq.question.optionA :
                                            sq.question.correctAnswer === 'B' ? sq.question.optionB :
                                            sq.question.optionC;
                    
                    console.log(`Question ${index + 1}:`, {
                        id: sq.question.questionId,
                        questionText: sq.question.questionText,
                        originalAnswer: sq.question.correctAnswer,
                        mappedAnswer: correctAnswerText,
                        options: options,
                        type: sq.question.questionType
                    });
                    
                    return {
                        id: sq.question.questionId,
                        question: sq.question.questionText,
                        options: options,
                        correctAnswer: correctAnswerText,
                        type: sq.question.questionType.toLowerCase(),
                        explanation: sq.question.explanation,
                        sessionQuestionId: sq.sessionQuestionId
                    };
                });
                
                setQuestions(formattedQuestions);
                console.log('✅ Questions formatted and set:', formattedQuestions);
                console.log('=== QUESTIONS SETUP COMPLETE ===');
                
                // 세션 ID를 상태에 저장 (완료 시 필요)
                window.currentSessionId = sessionId;
                console.log('Session ID stored globally:', sessionId);
                
                // 성공적으로 완료되면 로딩 상태 해제
                setIsLoading(false);
                console.log('✅ Loading completed successfully');
                
            } catch (err) {
                console.error('❌ API 호출 실패:', err);
                setError('문제를 불러오는 데 실패했습니다. 네트워크를 확인해주세요.');
                
                // 실패 시 더미 데이터 사용
                console.log('⚠️ Using dummy data as fallback');
            const dummyQuestions = [
                {
                    id: 1,
                    question: "The meeting was very _____ and productive.",
                    options: ["boring", "efficient", "difficult"],
                    correctAnswer: "efficient",
                    type: "word",
                    explanation: "Efficient fits the context of being productive."
                },
                {
                    id: 2,
                    question: "The project was ___challenging___ for the entire team.",
                    options: ["The task was difficult for everyone.", "The work was easy for all.", "The job was simple for the group."],
                    correctAnswer: "The task was difficult for everyone.",
                    type: "sentence",
                    explanation: "Challenging means difficult or demanding."
                },
                {
                    id: 3,
                    type: "conversation",
                    difficulty: "초급",
                    conversation: [
                        { speaker: "A", dialogue: "How was your weekend?" },
                        { speaker: "B", dialogue: "___" }
                    ],
                    options: ["It was great, thanks!", "Yes, I do.", "Next Monday."],
                    correctAnswer: "It was great, thanks!",
                    explanation: "This is the most natural response to a question about how someone's weekend was."
                }
            ];

            setTimeout(() => {
                setQuestions(dummyQuestions);
                setIsLoading(false);
                console.log('⚠️ Dummy questions loaded:', dummyQuestions);
            }, 1000);
            }
        };

        fetchQuestions();
    }, [formData.selectedCategories, formData.keywords, formData.level]);

    const totalQuestions = questions.length;
    const currentQuestion = questions[currentQuestionIndex];
    const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
    const studyType = STUDY_TYPES.find(type => type.id === selectedType);
    
    // 이벤트 핸들러
    const handleSubmit = async () => {
        if (!selectedAnswer) return;
        
        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        const newAnswer = {
            questionId: currentQuestion.id,
            selectedAnswer,
            correctAnswer: currentQuestion.correctAnswer,
            isCorrect,
            questionType: currentQuestion.type
        };
        
        setAnswers([...answers, newAnswer]);
        setShowResult(true);
        
        try {
            if (window.currentSessionId) {
                // 1. 사용자 답안을 데이터베이스에 저장
                const userAnswerLetter = currentQuestion.options.indexOf(selectedAnswer) === 0 ? 'A' :
                                       currentQuestion.options.indexOf(selectedAnswer) === 1 ? 'B' : 'C';
                
                await fetch('http://localhost:8081/api/question-answers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        sessionId: window.currentSessionId,
                        questionId: currentQuestion.id,
                        sessionType: 'PRACTICE',
                        userAnswer: userAnswerLetter,
                        isCorrect: isCorrect,
                        timeSpent: null,
                        solveCount: 1
                    })
                });
                
                console.log('✅ Answer saved:', {
                    questionId: currentQuestion.id,
                    userAnswer: userAnswerLetter,
                    isCorrect: isCorrect
                });

                // 2. 세션 진행률 업데이트 API 호출
                await fetch(`http://localhost:8081/api/learning-sessions/${window.currentSessionId}/progress`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        isCorrect: isCorrect
                    })
                });
            }
        } catch (error) {
            console.error('API 호출 실패:', error);
        }
    };

    // 다음 문제 또는 완료
    const handleNext = async () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer('');
            setShowResult(false);
        } else {
            // 마지막 문제까지 제출했으면 학습 완료 처리
            const results = {
                totalQuestions: totalQuestions,
                correctAnswers: answers.filter(answer => answer.isCorrect).length,
                answers: answers
            };
            
            try {
                // 세션 완료 API 호출
                if (window.currentSessionId) {
                    await fetch(`http://localhost:8081/api/learning-sessions/${window.currentSessionId}/complete`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                }
            } catch (error) {
                console.error('세션 완료 API 호출 실패:', error);
            }
            
            if (onStudyComplete) {
                onStudyComplete(results);
            }
        }
    };

    // 컴포넌트 렌더링 로직
    const renderQuestionComponent = () => {
        if (!currentQuestion) return null;
        
        const commonProps = {
            question: currentQuestion,
            onAnswerSelect: setSelectedAnswer,
            selectedAnswer,
            showResult,
        };

        switch (currentQuestion.type) {
            case 'word':
                return <Word {...commonProps} />;
            case 'sentence':
                return <Sentence {...commonProps} />;
            case 'conversation':
                return <Conversation {...commonProps}/>;
            default:
                return <div>지원하지 않는 문제 유형입니다: {currentQuestion.type}</div>;
        }
    };

    if (isLoading) {
        return <div className="text-center p-10"><h2>문제 로딩 중...</h2></div>;
    }

    if (error) {
        return (
            <div className="text-center !p-10 text-red-600">
                <h2>오류</h2>
                <p>{error}</p>
                {error.includes('카테고리') && (
                    <Button 
                        onClick={() => setCurrentStep('type')} 
                        className="!mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        카테고리 선택하러 가기
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="!p-4 !sm:p-6 !space-y-6 max-w-4xl !mx-auto">
            {/* 헤더 */}
            <div className="!space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="!text-3xl font-bold text-gray-800 flex items-center gap-2">
                            {studyType?.icon} {studyType?.title} 학습
                        </h1>
                        <p className="text-gray-600">
                            {currentQuestionIndex + 1} / {totalQuestions} 문제 ({
                                currentQuestion?.type === 'word' ? '빈칸에 올바른 단어나 문장넣기' : 
                                currentQuestion?.type === 'sentence' ? '밑줄친 문장과 동일한 의미의 숙어찾기' :
                                currentQuestion?.type === 'conversation' ? '이어지는 대화맥락으로 올바른거 선택하기' :
                                '문제'
                            })
                        </p>
                    </div>
                    <div className="text-right">
                        <Badge variant="outline">
                            {getDifficultyText(formData.level)}
                        </Badge>
                    </div>
                </div>
                
                {/* 진행도 바 */}
                <div className="w-full">
                    <div className="flex items-center justify-between text-lg text-gray-600 !mb-2">
                        <span>진행률</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="!h-3 w-full" />
                </div>
            </div>

            {/* 동적 문제 컴포넌트 */}
            {renderQuestionComponent()}

            {/* 버튼 */}
            <div className="flex justify-center">
                {!showResult ? (
                    <Button 
                        onClick={handleSubmit}
                        disabled={!selectedAnswer || !currentQuestion}
                        className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white !px-4 !py-3"
                    >
                        답안 제출
                    </Button>
                ) : (
                    <Button 
                        onClick={handleNext}
                        className="w-1/2 bg-green-600 hover:bg-green-700 text-white !px-4 !py-3"
                    >
                        {currentQuestionIndex < totalQuestions - 1 ? '다음 문제' : '학습 완료'}
                    </Button>
                )}
            </div>
        </div>
    );
}