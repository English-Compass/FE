import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { Badge } from '../ui/Badge';
import { useApp } from '../../context/AppContext';
import { createLearningSessionWithQuestions, fetchSessionQuestions, submitAnswer, completeLearningSession } from '../../services/api.js';
import { useNavigate } from 'react-router-dom';

import { Word } from '../question-types/Word';
import { Sentence } from '../question-types/Sentence';
import { Conversation } from '../question-types/Conversation';

export default function StudySession({ onStudyComplete }) {
    const { selectedType, STUDY_TYPES, formData, getDifficultyText, user } = useApp();
    const navigate = useNavigate();

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
    const [requiresProfileSetup, setRequiresProfileSetup] = useState(false);
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());
    const [isSubmitting, setIsSubmitting] = useState(false); // 답변 제출 중인지 추적 (중복 제출 방지)
    const hasLoadedQuestions = useRef(false); // 문제 로드 여부 추적

     // --- 데이터 로딩 ---
    useEffect(() => {
        // 이미 문제가 로드되었거나 세션이 있으면 다시 로드하지 않음
        if (hasLoadedQuestions.current || questions.length > 0 || sessionId) {
            console.log('📖 [StudySession] 이미 문제가 로드되어 있음, 재로드 스킵', {
                hasLoaded: hasLoadedQuestions.current,
                questionsCount: questions.length,
                sessionId: sessionId
            });
            return;
        }
        
        const fetchQuestions = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // 사용자 ID 확인
                if (!user?.id) {
                    throw new Error('사용자 정보를 찾을 수 없습니다. 로그인이 필요합니다.');
                }

                if (!formData?.keywords || formData.keywords.length === 0 || !formData?.level) {
                    console.warn('⚠️ [StudySession] 사용자 카테고리/난이도 설정이 없어 학습을 시작할 수 없습니다.');
                    if (!requiresProfileSetup) {
                        setRequiresProfileSetup(true);
                        setError('관심 카테고리와 난이도를 설정한 뒤 다시 시도해주세요.');
                        setIsLoading(false);
                        navigate('/add-info');
                    }
                    return;
                }

                const activeType = selectedType || formData.selectedCategories[0] || 'daily';

                const level = (formData.level || 'B').toUpperCase();
                const levelMapping = { 'A': '1', 'B': '2', 'C': '3' };
                const difficultyLevel = levelMapping[level] || '2';
                
                const categoryMap = {
                    business: '비즈니스',
                    travel: '여행',
                    daily: '일상생활',
                    academic: '학업'
                };
                const majorCategory = categoryMap[activeType] || '일상생활';

                // sessionMetadata 생성 (JSON 문자열)
                const sessionMetadata = {
                    categories: {
                        [majorCategory]: formData.keywords || []
                    },
                    level: difficultyLevel,
                    questionCount: 10
                };

                // 1. 세션 생성 + 문제 할당 (10문제)
                console.log('📝 [StudySession] 세션 생성 + 문제 할당 시작');
                const sessionData = await createLearningSessionWithQuestions({
                    userId: user.id,
                    sessionType: 'PRACTICE',
                    sessionMetadata: JSON.stringify(sessionMetadata)
                });

                if (!sessionData.sessionId) {
                    throw new Error('세션 ID를 받지 못했습니다.');
                }

                const newSessionId = sessionData.sessionId;
                setSessionId(newSessionId);
                console.log('📝 [StudySession] 세션 생성 완료, sessionId:', newSessionId);

                // 2. 세션의 문제 조회
                console.log('📖 [StudySession] 세션 문제 조회 시작');
                const questionsData = await fetchSessionQuestions(newSessionId);
                
                // 문제 데이터 변환 (응답은 배열이고, 각 항목에 question 객체가 포함됨)
                const questionsArr = Array.isArray(questionsData) ? questionsData : [];
                
                // questionOrder로 정렬
                const sortedQuestions = questionsArr.sort((a, b) => (a.questionOrder || 0) - (b.questionOrder || 0));
                
                // 디버깅: 첫 번째 문제의 구조 확인 (CONVERSATION 타입인 경우)
                if (sortedQuestions.length > 0) {
                    const firstQ = sortedQuestions[0].question || sortedQuestions[0];
                    if (firstQ.questionType === 'CONVERSATION') {
                        console.log('🔍 [StudySession] CONVERSATION 문제 원본 데이터:', {
                            questionType: firstQ.questionType,
                            conversation: firstQ.conversation,
                            conversationContext: firstQ.conversationContext,
                            dialogueContext: firstQ.dialogueContext,
                            questionText: firstQ.questionText,
                            allKeys: Object.keys(firstQ)
                        });
                    }
                }
                
                const mapped = sortedQuestions.map((sq) => {
                    const q = sq.question || sq; // question 객체 추출
                    
                    // 옵션 배열 생성 (optionA, optionB, optionC 또는 option1, option2, option3)
                    const options = [
                        q.optionA || q.option1,
                        q.optionB || q.option2,
                        q.optionC || q.option3
                    ].filter(Boolean);
                    
                    // 정답 처리 (correctAnswer가 "1", "2", "3" 또는 "A", "B", "C" 형태)
                    let correctValue = '';
                    if (q.correctAnswer) {
                        const answerStr = q.correctAnswer.toString();
                        if (['1', '2', '3'].includes(answerStr)) {
                            const answerIndex = parseInt(answerStr) - 1;
                            correctValue = options[answerIndex] || '';
                        } else if (['A', 'B', 'C'].includes(answerStr.toUpperCase())) {
                            const letterToIndex = { A: 0, B: 1, C: 2 };
                            const answerIndex = letterToIndex[answerStr.toUpperCase()];
                            correctValue = options[answerIndex] || '';
                        } else {
                            correctValue = answerStr;
                        }
                    }
                    
                    // 문제 유형 변환 (WORD -> word, SENTENCE -> sentence, CONVERSATION -> conversation)
                    const typeMap = {
                        'WORD': 'word',
                        'SENTENCE': 'sentence',
                        'CONVERSATION': 'conversation'
                    };
                    const typeLower = typeMap[q.questionType] || q.questionType?.toLowerCase() || 'word';
                    
                    // 대화 맥락 처리 (CONVERSATION 타입인 경우)
                    let conversationData = undefined;
                    if (typeLower === 'conversation') {
                        // conversation이 이미 올바른 배열 형태인 경우
                        if (q.conversation && Array.isArray(q.conversation) && q.conversation.length > 0) {
                            conversationData = q.conversation;
                        } 
                        // conversationContext나 dialogueContext 같은 다른 필드명으로 올 수 있음
                        else if (q.conversationContext && Array.isArray(q.conversationContext) && q.conversationContext.length > 0) {
                            conversationData = q.conversationContext;
                        }
                        else if (q.dialogueContext && Array.isArray(q.dialogueContext) && q.dialogueContext.length > 0) {
                            conversationData = q.dialogueContext;
                        }
                        // questionText에서 대화 맥락 추출 (fallback)
                        else if (q.questionText) {
                            // questionText가 대화 형태일 수 있음 (예: "A: ...\nB: ___")
                            const questionText = q.questionText;
                            // 간단한 fallback: A가 질문, B가 빈칸 형태로 구성
                            conversationData = [
                                { speaker: 'A', dialogue: questionText.replace('___', '___________') || '...' },
                                { speaker: 'B', dialogue: '___' }
                            ];
                        }
                        // 완전히 없으면 기본 구조
                        else {
                            conversationData = [
                                { speaker: 'A', dialogue: '...' },
                                { speaker: 'B', dialogue: '___' }
                            ];
                        }
                    }
                    
                    return {
                        id: q.questionId || sq.questionId || `q-${sq.questionOrder}`,
                        question: q.questionText || q.question || '',
                        options,
                        correctAnswer: correctValue,
                        type: typeLower,
                        difficulty: q.level || q.difficultyLevel || level,
                        conversation: conversationData,
                        explanation: q.explanation || undefined,
                        questionOrder: sq.questionOrder || 0
                    };
                });

                console.log('📖 [StudySession] 문제 조회 완료, 문제 개수:', mapped.length);
                setQuestions(mapped);
                hasLoadedQuestions.current = true; // 문제 로드 완료 표시
                setQuestionStartTime(Date.now());
            } catch (e) {
                if (e.name === 'AbortError') return;
                console.error('❌ [StudySession] 문제 로딩 실패:', e);
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
    }, [user?.id]); // 초기 마운트 시에만 실행 (문제가 이미 로드되었으면 재로드하지 않음)

    useEffect(() => {
        if (questions.length > 0) {
            setQuestionStartTime(Date.now());
        }
    }, [currentQuestionIndex, questions.length]);

    const totalQuestions = questions.length;
    const currentQuestion = questions[currentQuestionIndex];
    const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
    const studyType = STUDY_TYPES.find(type => type.id === selectedType);
    
    // 이벤트 핸들러
    const handleSubmit = async () => {
        // 중복 제출 방지
        if (isSubmitting) {
            console.warn('⚠️ [StudySession] 이미 제출 중입니다. 중복 제출 방지');
            return;
        }
        
        if (!selectedAnswer || !sessionId || !currentQuestion) {
            console.warn('⚠️ [StudySession] 제출 조건 불만족:', {
                hasSelectedAnswer: !!selectedAnswer,
                hasSessionId: !!sessionId,
                hasCurrentQuestion: !!currentQuestion
            });
            return;
        }
        
        // 세션 ID 유효성 검증
        if (!sessionId || typeof sessionId !== 'string' || sessionId.trim() === '') {
            console.error('❌ [StudySession] 유효하지 않은 sessionId:', sessionId);
            alert('세션 정보가 유효하지 않습니다. 페이지를 새로고침해주세요.');
            return;
        }
        
        // 문제 ID 유효성 검증
        if (!currentQuestion.id || typeof currentQuestion.id !== 'string') {
            console.error('❌ [StudySession] 유효하지 않은 questionId:', currentQuestion.id);
            alert('문제 정보가 유효하지 않습니다. 페이지를 새로고침해주세요.');
            return;
        }
        
        setIsSubmitting(true); // 제출 시작
        
        try {
            // 정답 여부 계산
            const options = currentQuestion.options || [];
            const selectedAnswerText = selectedAnswer.trim();
            const correctAnswerText = (currentQuestion.correctAnswer || '').trim();
            
            // 텍스트 비교로 정답 여부 확인
            const isCorrect = selectedAnswerText === correctAnswerText;
            
            // 사용자가 선택한 답안의 인덱스 찾기
            const answerIndex = options.findIndex(option => (option || '').trim() === selectedAnswerText);
            const userAnswerLetter = answerIndex >= 0 ? String.fromCharCode(65 + answerIndex) : 'A';
            const timeSpentSeconds = Math.max(1, Math.round((Date.now() - questionStartTime) / 1000));
            
            // 디버깅 로그
            console.log('✏️ [StudySession] 답변 제출 시작:', {
                sessionId,
                questionId: currentQuestion.id,
                selectedAnswer: selectedAnswerText,
                correctAnswer: correctAnswerText,
                options: options,
                userAnswerLetter,
                isCorrect,
                timeSpent: timeSpentSeconds,
                comparison: `${selectedAnswerText} === ${correctAnswerText} = ${isCorrect}`
            });
            
            // 3. 답변 제출
            
            // 백엔드가 correctAnswer와 userAnswer를 비교해서 isCorrect를 계산하도록 userAnswer만 전송
            const answerResult = await submitAnswer(sessionId, {
                questionId: currentQuestion.id,
                userAnswer: userAnswerLetter,
                // isCorrect는 백엔드에서 correctAnswer와 userAnswer를 비교해서 계산
                timeSpent: timeSpentSeconds,
                solveCount: 1
            });
            
            console.log('✏️ [StudySession] 답변 제출 응답:', {
                progressPercentage: answerResult.progressPercentage,
                answeredQuestions: answerResult.answeredQuestions,
                correctAnswers: answerResult.correctAnswers,
                wrongAnswers: answerResult.wrongAnswers
            });
            
            const newAnswer = {
                questionId: currentQuestion.id,
                selectedAnswer,
                correctAnswer: currentQuestion.correctAnswer,
                isCorrect,
                questionType: currentQuestion.type
            };
            
            setAnswers([...answers, newAnswer]);
            setShowResult(true);
            console.log('✏️ [StudySession] 답변 제출 완료, 정답 여부:', isCorrect);
            setQuestionStartTime(Date.now());
        } catch (error) {
            console.error('❌ [StudySession] 답변 제출 실패:', {
                error: error.message,
                errorStack: error.stack,
                sessionId,
                questionId: currentQuestion?.id,
                userAnswer: userAnswerLetter,
                timestamp: new Date().toISOString()
            });
            
            // 에러 메시지에 따라 다른 처리
            const errorMessage = error.message || '';
            if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
                alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.\n\n만약 계속 발생한다면 페이지를 새로고침해주세요.');
            } else if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
                alert('세션이나 문제를 찾을 수 없습니다. 페이지를 새로고침해주세요.');
            } else if (errorMessage.includes('400') || errorMessage.includes('Bad Request')) {
                alert('요청 형식이 잘못되었습니다. 페이지를 새로고침해주세요.');
            } else {
                alert(`답변 제출에 실패했습니다: ${errorMessage}\n\n다시 시도해주세요.`);
            }
        } finally {
            setIsSubmitting(false); // 제출 완료
        }
    };

    // 다음 문제 또는 완료
    const handleNext = async () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer('');
            setShowResult(false);
            setQuestionStartTime(Date.now());
        } else {
            // 마지막 문제까지 제출했으면 학습 완료 처리
            try {
                // 4. 세션 완료
                if (sessionId) {
                    console.log('✅ [StudySession] 세션 완료 시작:', sessionId);
                    await completeLearningSession(sessionId);
                    console.log('✅ [StudySession] 세션 완료 성공');
                }
            } catch (e) {
                console.error('❌ [StudySession] 세션 완료 실패:', e);
                // 세션 완료 실패해도 결과는 표시
            }
            
            const results = {
                totalQuestions: totalQuestions,
                correctAnswers: answers.filter(answer => answer.isCorrect).length,
                answers: answers
            };
            
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

    if (requiresProfileSetup) {
        return (
            <div className="text-center !p-10">
                <h2 className="!mb-4">프로필 설정이 필요합니다</h2>
                <p className="text-gray-600 !mb-6">
                    관심 카테고리와 난이도를 먼저 설정한 뒤 학습을 시작해주세요.
                </p>
                <div className="flex items-center justify-center gap-3">
                    <Button onClick={() => navigate('/add-info')} className="bg-blue-600 hover:bg-blue-700 text-white">
                        설정하러 가기
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/dashboard/home')}>
                        홈으로 이동
                    </Button>
                </div>
            </div>
        );
    }

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
                        disabled={!selectedAnswer || !currentQuestion || isSubmitting}
                        className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white !px-4 !py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? '제출 중...' : '답안 제출'}
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