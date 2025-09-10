import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { useApp } from '../../context/AppContext';
import { generateQuestions, createLearningSession, startLearningSession, completeLearningSession } from '../../services/api.js';

import { Word } from '../question-types/Word';
import { Sentence } from '../question-types/Sentence';
import { Conversation } from '../question-types/Conversation';

export default function StudySession({ onStudyComplete }) {
    const { selectedType, STUDY_TYPES, formData, getDifficultyText} = useApp();

        // --- 상태 관리 ---
    const [questions, setQuestions] = useState([]); // API로부터 받아온 문제 목록
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const abortRef = useRef(null);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [answers, setAnswers] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [sessionId, setSessionId] = useState(null);

     // --- 데이터 로딩 ---
    useEffect(() => {
        const fetchQuestions = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const controller = new AbortController();
                abortRef.current = controller;

                const level = (formData.level || 'B').toUpperCase();
                const categoryMap = {
                    business: '비즈니스',
                    travel: '여행',
                    daily: '일상생활',
                    academic: '학업'
                };
                const majorCategory = categoryMap[selectedType] || '일상생활';

                const toEnumType = (t) => ({
                    word: 'WORD',
                    sentence: 'SENTENCE',
                    conversation: 'CONVERSATION'
                })[t];

                // conversation 포함 10문항 무작위 배분
                const allTypes = ['word', 'sentence', 'conversation'];
                const allocateCounts = (total) => {
                    // 각 유형 최소 1문항 보장 후 나머지 랜덤 분배
                    const counts = { word: 1, sentence: 1, conversation: 1 };
                    let remaining = Math.max(total - 3, 0);
                    while (remaining > 0) {
                        const pick = allTypes[Math.floor(Math.random() * allTypes.length)];
                        counts[pick] += 1;
                        remaining -= 1;
                    }
                    return counts;
                };
                const counts = allocateCounts(10);

                const requests = allTypes
                    .filter((t) => counts[t] > 0)
                    .map((t) => generateQuestions({
                        questionType: toEnumType(t),
                        difficulty: level,
                        majorCategory,
                        topics: formData.keywords || [],
                        questionCount: counts[t]
                    }, { signal: controller.signal }));

                const results = await Promise.all(requests);

                const mapped = results.flatMap((res, idx) => {
                    const typeLower = allTypes[idx];
                    const questionsArr = Array.isArray(res?.questions) ? res.questions : [];
                    return questionsArr.map((q, i) => {
                        const options = [q.optionA, q.optionB, q.optionC].filter(Boolean);
                        const letterToIndex = { A: 0, B: 1, C: 2 };
                        const answerIndex = letterToIndex[(q.correctAnswer || '').toUpperCase()] ?? -1;
                        const correctValue = answerIndex >= 0 ? options[answerIndex] : (q.correctAnswer || '');
                        return {
                            id: `gen-${typeLower}-${i}`,
                            question: q.questionText || '',
                            options,
                            correctAnswer: correctValue,
                            type: typeLower,
                            difficulty: q.difficulty || level,
                            conversation: q.conversation || undefined
                        };
                    });
                });

                // 랜덤 셔플
                for (let i = mapped.length - 1; i > 0; i -= 1) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [mapped[i], mapped[j]] = [mapped[j], mapped[i]];
                }

                // 최대 10개
                setQuestions(mapped.slice(0, 10));

                // 세션 생성 및 시작
                try {
                    const storedUser = localStorage.getItem('user');
                    const userId = storedUser ? JSON.parse(storedUser).userId : null;
                    if (userId) {
                        const practice = await createLearningSession({ 
                            userId, 
                            sessionType: 'PRACTICE',
                            sessionMetadata: 'practice',
                            categories: [majorCategory] 
                        });
                        if (practice?.sessionId) {
                            setSessionId(practice.sessionId);
                            try { await startLearningSession(practice.sessionId); } catch (e) { console.warn('세션 시작 실패:', e?.message || e); }
                        }
                    }
                } catch (e) { console.warn('연습 세션 생성 실패:', e?.message || e); }
            } catch (e) {
                if (e.name === 'AbortError') return;
                setError('문제를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
            } finally {
                setIsLoading(false);
                abortRef.current = null;
            }
        };

        fetchQuestions();
        return () => {
            if (abortRef.current) abortRef.current.abort();
        };
    }, [formData.selectedCategories, formData.keywords, formData.level, selectedType]);

    const totalQuestions = questions.length;
    const currentQuestion = questions[currentQuestionIndex];
    const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
    const studyType = STUDY_TYPES.find(type => type.id === selectedType);
    
    // 이벤트 핸들러
    const handleSubmit = async () => {
        if (!selectedAnswer) return;
        
        const newAnswer = {
            questionId: currentQuestion.id,
            selectedAnswer,
            correctAnswer: currentQuestion.correctAnswer,
            isCorrect: selectedAnswer === currentQuestion.correctAnswer,
            questionType: currentQuestion.type
        };
        
        setAnswers([...answers, newAnswer]);
        setShowResult(true);
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
            // 세션 완료 호출
            try { if (sessionId) await completeLearningSession(sessionId); } catch (e) { console.warn('세션 완료 실패:', e?.message || e); }
            
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
        return (
            <div className="text-center !p-10">
                <h2 className="!mb-4">문제 로딩 중...</h2>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 !mx-auto !mb-4"></div>
                <div className="flex items-center justify-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => { if (abortRef.current) abortRef.current.abort(); }}
                    >
                        취소
                    </Button>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center !p-10">
                <h2 className="text-red-600 !mb-2">오류</h2>
                <p className="text-red-600 !mb-4">{error}</p>
                <div className="flex items-center justify-center gap-3">
                    <Button onClick={() => {
                        // 재시도: 의존성 변경 트리거 위해 난수 상태 변경 대신 기존 이펙트 재호출용 상태 토글 가능
                        setIsLoading(true);
                        setError(null);
                        // 간단 재로딩
                        setTimeout(() => {
                            setIsLoading(false);
                            // 의존성 변경을 유도하지 않고 직접 재호출
                            const evt = new Event('force-fetch');
                            window.dispatchEvent(evt);
                        }, 0);
                    }}>다시 시도</Button>
                </div>
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