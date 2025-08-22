import React, { useState, useEffect} from 'react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { useApp } from '../../context/AppContext';

import { Word } from '../question-types/Word';
import { SentenceInterpretationQuestion } from '../question-types/SentenceInterpretationQuestion';
import { FillInTheBlankQuestion } from '../question-types/FillInTheBlankQuestion';
import { SynonymSentenceQuestion } from '../question-types/SynonymSentenceQuestion';
import { SynonymQuestion } from '../question-types/SynonymQuestion';

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
        const fetchQuestions = async () => {
            // TODO: API 연동 - 선택된 카테고리와 키워드 기반 문제 생성
            // const response = await fetch('http://localhost:8080/api/study/questions', {
            //   method: 'POST',
            //   headers: {
            //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
            //     'Content-Type': 'application/json'
            //   },
            //   body: JSON.stringify({
            //     categories: formData.selectedCategories,
            //     keywords: formData.keywords,
            //     level: formData.level,
            //     count: 10
            //   })
            // });

            // 더미 데이터로 임시 구현
            const dummyQuestions = [
                {
                    id: 1,
                    question: "What does 'comprehensive' mean?",
                    options: ["limited", "complete and thorough", "expensive", "quick"],
                    correctAnswer: "complete and thorough",
                    type: "word",
                    explanation: "Comprehensive means complete and including everything that is necessary."
                },
                {
                    id: 2,
                    question: "I went to the store to buy some groceries.",
                    options: ["나는 음식을 사러 가게에 갔다.", "나는 옷을 사러 백화점에 갔다.", "나는 책을 사러 서점에 갔다."],
                    correctAnswer: "나는 음식을 사러 가게에 갔다.",
                    type: "sentence-interpretation",
                    explanation: "Groceries means food and other items sold in a grocery store."
                },
                {
                    id: 3,
                    question: "The meeting was very _____ and productive.",
                    options: ["boring", "efficient", "difficult"],
                    correctAnswer: "efficient",
                    type: "fill-in-blank",
                    explanation: "Efficient fits the context of being productive."
                },
                {
                    id: 4,
                    question: "The project was ___challenging___ for the entire team.",
                    options: ["The task was difficult for everyone.", "The work was easy for all.", "The job was simple for the group."],
                    correctAnswer: "The task was difficult for everyone.",
                    type: "synonym-sentence",
                    explanation: "Challenging means difficult or demanding."
                },
                {
                    id: 5,
                    question: "Choose the word that means the same as 'important':",
                    options: ["trivial", "crucial", "minor"],
                    correctAnswer: "crucial",
                    type: "synonym",
                    explanation: "Crucial and important both mean having great significance."
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
            case 'sentence-interpretation':
                return <SentenceInterpretationQuestion {...commonProps} />;
            case 'fill-in-blank':
                return <FillInTheBlankQuestion {...commonProps} />;
            case 'synonym-sentence':
                return <SynonymSentenceQuestion {...commonProps} />;
            case 'synonym':
                return <SynonymQuestion {...commonProps} />;
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
                                currentQuestion?.type === 'word' ? '어휘' : 
                                currentQuestion?.type === 'synonym' ? '어휘' :
                                '문법'
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