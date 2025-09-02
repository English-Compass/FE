import React, { useState, useEffect} from 'react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { useApp } from '../../context/AppContext';

import { Word } from '../question-types/Word';
import { Sentence } from '../question-types/Sentence';
import { Conversation } from '../question-types/Conversation';

export default function StudySession({ onStudyComplete }) {
    const { selectedType, STUDY_TYPES, formData, getDifficultyText} = useApp();

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
        // API: 선택된 카테고리, 키워드, 레벨을 기반으로 서버에서 학습 문제를 가져옵니다.
        const fetchQuestions = async () => {
            // try {
            //   const response = await fetch('http://localhost:8080/api/study/questions', {
            //     method: 'POST',
            //     headers: {
            //       'Authorization': `Bearer ${localStorage.getItem('token')}`,
            //       'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //       categories: formData.selectedCategories,
            //       keywords: formData.keywords,
            //       level: formData.level,
            //       count: 10
            //     })
            //   });
            //   const data = await response.json();
            //   setQuestions(data);
            // } catch (err) {
            //   setError('문제를 불러오는 데 실패했습니다.');
            // } finally {
            //   setIsLoading(false);
            // }

            // 더미 데이터로 임시 구현
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
            }, 1000);
        };

        fetchQuestions();
    }, [formData.selectedCategories, formData.keywords, formData.level]);

    const totalQuestions = questions.length;
    const currentQuestion = questions[currentQuestionIndex];
    const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
    const studyType = STUDY_TYPES.find(type => type.id === selectedType);
    
    // 이벤트 핸들러
    const handleSubmit = () => {
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
    const handleNext = () => {
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
        return <div className="text-center !p-10 text-red-600"><h2>오류</h2><p>{error}</p></div>;
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