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
import { fetchTodayWords } from '../../services/api.js';

export default function HomePage() {
    const navigate = useNavigate();
    const { user, setUser, studyProgress, scrollToTop } = useApp();
    const [dailyActivity, setDailyActivity] = useState({ studyTimeMinutes: 0 });
    const [weeklyStats, setWeeklyStats] = useState([]);
    const [questionTypeAccuracy, setQuestionTypeAccuracy] = useState([]);
    const [weaknessDistribution, setWeaknessDistribution] = useState([]);
    const [loading, setLoading] = useState(true);
    const [weeklyLoading, setWeeklyLoading] = useState(true);
    const [accuracyLoading, setAccuracyLoading] = useState(true);
    const [weaknessLoading, setWeaknessLoading] = useState(true);

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

    // 주간 학습량 데이터 가져오기
    const fetchWeeklyStats = async () => {
        // 로컬 스토리지에서 사용자 ID 가져오기
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            console.log('User data not found in localStorage, skipping weekly stats fetch');
            setWeeklyLoading(false);
            return;
        }

        const userData = JSON.parse(storedUser);
        const userId = userData.userId;
        
        if (!userId) {
            console.log('User ID not available, skipping weekly stats fetch');
            setWeeklyLoading(false);
            return;
        }

        try {
            setWeeklyLoading(true);
            const today = getTodayDate();
            const apiUrl = `/learning-analytics/users/${userId}/weekly-graph?weekStartDate=${today}`;
            
            console.log('📈 [WeeklyGraph API] 요청 시작:', {
                userId,
                weekStartDate: today,
                apiUrl,
                timestamp: new Date().toISOString()
            });
            
            const response = await fetch(apiUrl);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ [WeeklyGraph API] 응답 성공:', {
                    userId,
                    weeklyGraphData: data,
                    timestamp: new Date().toISOString()
                });
                
                // API 응답을 차트 형식으로 변환 (value -> sessionCount)
                const chartData = data.map(item => ({
                    date: item.date,
                    sessionCount: item.value,
                    dayOfWeek: item.dayOfWeek,
                    hasActivity: item.hasActivity
                }));
                
                console.log('📊 [WeeklyGraph] 차트 데이터 변환:', chartData);
                setWeeklyStats(chartData);
            } else {
                console.error('❌ [WeeklyGraph API] 응답 실패:', {
                    userId,
                    status: response.status,
                    statusText: response.statusText,
                    timestamp: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('🚨 [WeeklyGraph API] 요청 에러:', {
                userId,
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
        } finally {
            setWeeklyLoading(false);
            console.log('🏁 [WeeklyGraph API] 요청 완료:', {
                userId,
                timestamp: new Date().toISOString()
            });
        }
    };

    // 유형별 정답률 데이터 가져오기
    const fetchQuestionTypeAccuracy = async () => {
        // 로컬 스토리지에서 사용자 ID 가져오기
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            console.log('User data not found in localStorage, skipping question type accuracy fetch');
            setAccuracyLoading(false);
            return;
        }

        const userData = JSON.parse(storedUser);
        const userId = userData.userId;
        
        if (!userId) {
            console.log('User ID not available, skipping question type accuracy fetch');
            setAccuracyLoading(false);
            return;
        }

        try {
            setAccuracyLoading(true);
            const apiUrl = `/learning-analytics/users/${userId}/question-type-accuracy`;
            
            console.log('🎯 [QuestionTypeAccuracy API] 요청 시작:', {
                userId,
                apiUrl,
                timestamp: new Date().toISOString()
            });
            
            const response = await fetch(apiUrl);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ [QuestionTypeAccuracy API] 응답 성공:', {
                    userId,
                    accuracyData: data,
                    timestamp: new Date().toISOString()
                });
                
                // API 응답을 차트 형식으로 변환 (PRONUNCIATION_RECOGNITION 제외)
                const chartData = data
                    .filter(item => item.questionType !== 'PRONUNCIATION_RECOGNITION')
                    .map(item => ({
                        type: item.questionTypeName,
                        accuracy: item.accuracyRate,
                        totalQuestions: item.totalQuestions,
                        correctAnswers: item.correctAnswers,
                        wrongAnswers: item.totalQuestions - item.correctAnswers,
                        averageTimeSpent: item.averageTimeSpent,
                        totalTimeSpent: item.totalTimeSpent
                    }));
                
                console.log('📊 [QuestionTypeAccuracy] 차트 데이터 변환:', chartData);
                setQuestionTypeAccuracy(chartData);
            } else {
                console.error('❌ [QuestionTypeAccuracy API] 응답 실패:', {
                    userId,
                    status: response.status,
                    statusText: response.statusText,
                    timestamp: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('🚨 [QuestionTypeAccuracy API] 요청 에러:', {
                userId,
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
        } finally {
            setAccuracyLoading(false);
            console.log('🏁 [QuestionTypeAccuracy API] 요청 완료:', {
                userId,
                timestamp: new Date().toISOString()
            });
        }
    };

    // 약점 유형 분포 데이터 가져오기
    const fetchWeaknessDistribution = async () => {
        // 로컬 스토리지에서 사용자 ID 가져오기
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            console.log('User data not found in localStorage, skipping weakness distribution fetch');
            setWeaknessLoading(false);
            return;
        }

        const userData = JSON.parse(storedUser);
        const userId = userData.userId;
        
        if (!userId) {
            console.log('User ID not available, skipping weakness distribution fetch');
            setWeaknessLoading(false);
            return;
        }

        try {
            setWeaknessLoading(true);
            const apiUrl = `/learning-analytics/users/${userId}/weakness-distribution`;
            
            console.log('🎯 [WeaknessDistribution API] 요청 시작:', {
                userId,
                apiUrl,
                timestamp: new Date().toISOString()
            });
            
            const response = await fetch(apiUrl);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ [WeaknessDistribution API] 응답 성공:', {
                    userId,
                    weaknessData: data,
                    timestamp: new Date().toISOString()
                });
                
                // API 응답을 차트 형식으로 변환 (PRONUNCIATION_RECOGNITION 제외)
                const filteredData = data.filter(item => item.questionType !== 'PRONUNCIATION_RECOGNITION');
                
                // 정답률 기준으로 정렬 (낮은 순서대로)
                const sortedData = filteredData.sort((a, b) => a.accuracyRate - b.accuracyRate);
                
                // 정답률 기준으로 우선순위 재할당
                const chartData = sortedData.map((item, index) => {
                    // 정답률이 동일한 경우 공동 순위 처리
                    let priority = index + 1;
                    if (index > 0 && item.accuracyRate === sortedData[index - 1].accuracyRate) {
                        // 이전 항목과 정답률이 같으면 같은 우선순위
                        priority = sortedData.findIndex((prevItem, prevIndex) => 
                            prevIndex < index && prevItem.accuracyRate === item.accuracyRate
                        ) + 1;
                    }
                    
                    return {
                        type: item.questionTypeName,
                        displayName: item.questionTypeName,
                        count: item.incorrectAnswers,
                        totalQuestions: item.totalQuestions,
                        correctAnswers: item.correctAnswers,
                        incorrectAnswers: item.incorrectAnswers,
                        accuracyRate: item.accuracyRate,
                        weaknessLevel: item.weaknessLevel,
                        weaknessGrade: item.weaknessGrade,
                        priority: priority, // 정답률 기준 재할당된 우선순위
                        recommendedStudyMethod: item.recommendedStudyMethod
                    };
                });
                
                console.log('📊 [WeaknessDistribution] 차트 데이터 변환:', chartData);
                setWeaknessDistribution(chartData);
            } else {
                console.error('❌ [WeaknessDistribution API] 응답 실패:', {
                    userId,
                    status: response.status,
                    statusText: response.statusText,
                    timestamp: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('🚨 [WeaknessDistribution API] 요청 에러:', {
                userId,
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
        } finally {
            setWeaknessLoading(false);
            console.log('🏁 [WeaknessDistribution API] 요청 완료:', {
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
        
        // 주간 학습량 데이터 가져오기
        fetchWeeklyStats();
        
        // 유형별 정답률 데이터 가져오기
        fetchQuestionTypeAccuracy();
        
        // 약점 유형 분포 데이터 가져오기
        fetchWeaknessDistribution();
    }, [user, setUser]);

    

    // 더미 데이터 (UI 확인용)
    const [todayWords, setTodayWords] = useState([]);

    // 오늘의 단어 - 백엔드 연결
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const userId = storedUser ? JSON.parse(storedUser).userId : null;
        if (!userId) return;
        fetchTodayWords(userId)
            .then((data) => {
                const words = Array.isArray(data?.words) ? data.words : [];
                setTodayWords(words.map(w => ({
                    word: w.word || w.text || '',
                    meaning: w.meaning || w.definition || '',
                    example: w.example || ''
                })));
            })
            .catch(() => {})
    }, []);

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
            <HistoryChart 
                weeklyStats={weeklyStats}
                loading={weeklyLoading}
                questionTypeAccuracy={questionTypeAccuracy}
                accuracyLoading={accuracyLoading}
                weaknessDistribution={weaknessDistribution}
                weaknessLoading={weaknessLoading}
            />
            <div className="home-page-cards">
            <ConversationCard user={user} navigate={navigate} />
            <TodayWordsCard words={todayWords} />
            <WrongAnswerCard navigate={navigate} />
            <ReviewQuizCard quiz={reviewQuiz} navigate={navigate} />
            </div>
        </div>
    );
}

