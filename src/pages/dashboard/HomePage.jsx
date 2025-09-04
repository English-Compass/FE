import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useApp } from '../../context/AppContext.jsx';
import '../../styles/components/_home.scss';
import  WelcomeSection  from '../../components/home/WelcomeSection.jsx';
import { DailyProgressCard } from '../../components/home/DailyProgressCard.jsx';
import { TodayWordsCard } from '../../components/home/TodayWordsCard.jsx';
import { WrongAnswerCard } from '../../components/home/WrongAnswerCard.jsx';
import { ReviewQuizCard } from '../../components/home/ReviewQuizCard.jsx';
import { ConversationCard } from '../../components/home/ConversationCard.jsx';
import HistoryChart from '../../components/home/HistoryChart.jsx';

export default function HomePage() {
    const navigate = useNavigate();
    const { user, studyProgress, scrollToTop } = useApp();
    const [reviewQuiz, setReviewQuiz] = useState([]);
    const [reviewNoDataMessage, setReviewNoDataMessage] = useState('');

    useEffect(() => {
        scrollToTop();
        
        // API: 복습 퀴즈 데이터를 가져옵니다.
        const fetchReviewQuiz = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/quiz/review?userId=user_123');
                
                if (response.ok) {
                    const data = await response.json();
                    // API 데이터를 UI 형식으로 변환
                    const formattedQuiz = data.map((quiz) => ({
                        id: quiz.id,
                        question: quiz.question,
                        options: quiz.options || [],
                        correct: quiz.options?.indexOf(quiz.correctAnswer) || 0
                    }));
                    setReviewQuiz(formattedQuiz);
                } else if (response.status === 422) {
                    // HTTP 422: 복습할 문제가 없음
                    setReviewNoDataMessage('복습할 문제가 없습니다.');
                    setReviewQuiz([]);
                } else {
                    throw new Error('Review quiz API failed');
                }
            } catch (error) {
                console.error('복습 퀴즈 로드 실패:', error);
                // 에러 발생 시 더미 데이터 사용 (wrong answer와 동일한 접근 방식)
                const dummyReviewQuiz = [
                    { id: 1, question: 'Fill in the blank: The meeting was very _____.', options: ['productive', 'produce', 'production'], correct: 0 },
                    { id: 2, question: 'What does "efficient" mean?', options: ['느린', '효율적인', '어려운'], correct: 1 },
                    { id: 3, question: 'Choose the correct sentence:', options: ['I go there yesterday', 'I went there yesterday', 'I goes there yesterday'], correct: 1 },
                    { id: 4, question: 'Select the synonym of "important":', options: ['insignificant', 'crucial', 'small'], correct: 1 },
                    { id: 5, question: 'Complete: She _____ to work every day.', options: ['go', 'goes', 'going'], correct: 1 }
                ];
                setReviewQuiz(dummyReviewQuiz);
            }
        };
        
        fetchReviewQuiz();
    }, [scrollToTop]);

    // API: 대시보드에 필요한 데이터(오늘의 단어, 복습 퀴즈 등)를 가져와야 합니다.
    // const fetchDashboardData = async () => {
    //   const response = await fetch('http://localhost:8080/api/dashboard', {
    //     method: 'GET',
    //     headers: {
    //       'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //       'Content-Type': 'application/json'
    //     }
    //   });
    //   return response.json();
    // };

    // 더미 데이터 (UI 확인용)
    const todayWords = [
        { word: 'comprehensive', meaning: '포괄적인, 종합적인', example: 'A comprehensive study of the problem' },
        { word: 'substantial', meaning: '상당한, 실질적인', example: 'A substantial amount of money' },
        { word: 'innovative', meaning: '혁신적인', example: 'An innovative approach to teaching' },
        { word: 'collaborate', meaning: '협력하다', example: 'We need to collaborate on this project' },
        { word: 'efficient', meaning: '효율적인', example: 'This is a very efficient method' }
    ];


    return (
        <div className="home-page">
            <WelcomeSection user={user} />
            <DailyProgressCard studyProgress={studyProgress} />
            <HistoryChart />
            <div className="home-page-cards">
            <ConversationCard user={user} navigate={navigate} />
            <TodayWordsCard words={todayWords} />
            <WrongAnswerCard navigate={navigate} />
            <ReviewQuizCard quiz={reviewQuiz} navigate={navigate} noDataMessage={reviewNoDataMessage} />
            </div>
        </div>
    );
}

