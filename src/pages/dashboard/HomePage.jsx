import React, { useEffect } from 'react';
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

    useEffect(() => {
        scrollToTop();
    }, []);

    // TODO: API 연동 - 사용자 맞춤 오늘의 단어
    // const fetchTodayWords = async () => {
    //   const response = await fetch('http://localhost:8080/api/dashboard/today-words', {
    //     method: 'GET',
    //     headers: {
    //       'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //       'Content-Type': 'application/json'
    //     }
    //   });
    //   return response.json();
    // };

    // TODO: API 연동 - 복습 퀴즈 데이터
    // const fetchReviewQuiz = async () => {
    //   const response = await fetch('http://localhost:8080/api/dashboard/review-quiz', {
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

    const reviewQuiz = [
        { id: 1, question: 'Fill in the blank: The meeting was very _____.', options: ['productive', 'produce', 'production'], correct: 0 },
        { id: 2, question: 'What does "efficient" mean?', options: ['느린', '효율적인', '어려운'], correct: 1 },
        { id: 3, question: 'Choose the correct sentence:', options: ['I go there yesterday', 'I went there yesterday', 'I goes there yesterday'], correct: 1 },
        { id: 4, question: 'Select the synonym of "important":', options: ['insignificant', 'crucial', 'small'], correct: 1 },
        { id: 5, question: 'Complete: She _____ to work every day.', options: ['go', 'goes', 'going'], correct: 1 }
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
            <ReviewQuizCard quiz={reviewQuiz} navigate={navigate} />
            </div>
        </div>
    );
}

