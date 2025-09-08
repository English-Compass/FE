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
    const { user, setUser, studyProgress, scrollToTop } = useApp();
    const [dailyActivity, setDailyActivity] = useState({ studyTimeMinutes: 0 });
    const [loading, setLoading] = useState(true);

    // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오는 함수
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // 오늘의 학습 데이터 가져오기
    const fetchDailyActivity = async () => {
        // 로컬 스토리지에서 사용자 ID 가져오기
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            console.log('User data not found in localStorage, skipping daily activity fetch');
            setLoading(false);
            return;
        }

        const userData = JSON.parse(storedUser);
        const userId = userData.userId;
        
        if (!userId) {
            console.log('User ID not available, skipping daily activity fetch');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const today = getTodayDate();
            const apiUrl = `/learning-analytics/users/${userId}/daily-activity?fromDate=${today}&toDate=${today}`;
            
            console.log('📊 [DailyActivity API] 요청 시작:', {
                userId,
                today,
                apiUrl,
                timestamp: new Date().toISOString()
            });
            
            const response = await fetch(apiUrl);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ [DailyActivity API] 응답 성공:', {
                    userId,
                    studyTimeMinutes: data.studyTimeMinutes,
                    fullResponse: data,
                    timestamp: new Date().toISOString()
                });
                setDailyActivity({ studyTimeMinutes: data.studyTimeMinutes });
            } else {
                console.error('❌ [DailyActivity API] 응답 실패:', {
                    userId,
                    status: response.status,
                    statusText: response.statusText,
                    timestamp: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('🚨 [DailyActivity API] 요청 에러:', {
                userId,
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
        } finally {
            setLoading(false);
            console.log('🏁 [DailyActivity API] 요청 완료:', {
                userId,
                timestamp: new Date().toISOString()
            });
        }
    };

    useEffect(() => {
        scrollToTop();
        
        // HomePage 마운트 시 사용자 정보 확인
        console.log('HomePage - 마운트 시 사용자 정보:', user);
        console.log('HomePage - 사용자 이름:', user?.name);
        console.log('HomePage - 프로필 이미지:', user?.profileImage);
        console.log('HomePage - 사용자 ID:', user?.id);
        
        // URL에 토큰과 사용자 정보가 있으면 저장 (백엔드에서 직접 리다이렉트된 경우)
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userId = urlParams.get('userId');
        const username = urlParams.get('username');
        const profileImage = urlParams.get('profileImage');
        
        if (token && userId && username) {
            console.log('HomePage - URL에서 사용자 정보 발견, 저장 중...');
            console.log('- token:', token);
            console.log('- userId:', userId);
            console.log('- username:', username);
            console.log('- profileImage:', profileImage);
            
            // 토큰 저장
            localStorage.setItem('token', token);
            sessionStorage.setItem('token', token);
            
            // 사용자 정보 저장
            const decodedUsername = decodeURIComponent(username || '');
            const decodedProfileImage = decodeURIComponent(profileImage || '');
            
            localStorage.setItem('user', JSON.stringify({
                userId: userId === 'null' ? null : userId,
                username: decodedUsername,
                profileImage: decodedProfileImage
            }));
            
            // AppContext 업데이트
            const userData = {
                id: userId === 'null' ? null : userId,
                name: decodedUsername,
                profileImage: decodedProfileImage,
                level: 'B',
                joinDate: '2024-01-15',
                streak: 7
            };
            
            console.log('HomePage - AppContext에 저장할 사용자 데이터:', userData);
            setUser(userData);
            
            // URL에서 쿼리 파라미터 제거
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // 오늘의 학습 데이터 가져오기
        fetchDailyActivity();
    }, [user, setUser]);

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
            <DailyProgressCard 
                studyProgress={studyProgress} 
                dailyActivity={dailyActivity}
                loading={loading}
            />
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

