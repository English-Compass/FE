import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useApp } from '../../context/AppContext.jsx';
import '../../styles/components/_home.scss';
import  WelcomeSection  from '../../components/home/WelcomeSection.jsx';
import { DailyProgressCard } from '../../components/home/DailyProgressCard.jsx';
import { TodayWordsCard } from '../../components/home/TodayWordsCard.jsx';
import { WrongAnswerCard } from '../../components/home/WrongAnswerCard.jsx';
import { ReviewQuizCard } from '../../components/home/ReviewQuizCard.jsx';
import { ConversationCard } from '../../components/home/ConversationCard.jsx';

export default function HomePage() {
    const navigate = useNavigate();
    const { user, studyProgress } = useApp();

    const todayWords = [
        { word: 'comprehensive', meaning: '포괄적인, 종합적인', example: 'A comprehensive study of the problem' },
        { word: 'substantial', meaning: '상당한, 실질적인', example: 'A substantial amount of money' },
        { word: 'innovative', meaning: '혁신적인', example: 'An innovative approach to teaching' }
    ];

    const reviewQuiz = [
        { id: 1, question: 'Fill in the blank: The meeting was very _____.', options: ['productive', 'produce', 'production'], correct: 0 },
        { id: 2, question: 'What does "efficient" mean?', options: ['느린', '효율적인', '어려운'], correct: 1 },
        { id: 3, question: 'Choose the correct sentence:', options: ['I go there yesterday', 'I went there yesterday', 'I goes there yesterday'], correct: 1 }
    ];

    return (
        <div className="home-page">
            <WelcomeSection user={user} />
            <DailyProgressCard studyProgress={studyProgress} />
            <div className="home-page-cards">
            <ConversationCard user={user} navigate={navigate} />
            <TodayWordsCard words={todayWords} />
            <WrongAnswerCard navigate={navigate} />
            <ReviewQuizCard quiz={reviewQuiz} navigate={navigate} />
            </div>
        </div>
    );
}

