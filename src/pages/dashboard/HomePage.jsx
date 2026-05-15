import React, { useEffect, useState, useRef } from 'react';
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
import { fetchTodayWords, fetchReviewQuiz } from '../../services/api.js';

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
    const [reviewQuiz, setReviewQuiz] = useState([]);
    
    // API 호출 여부 추적 (초기 마운트 시에만 호출)
    const hasLoadedData = useRef(false);

    // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오는 함수
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // 오늘의 학습 데이터 가져오기
    const fetchDailyActivity = async () => {
        const userId = user?.id;
        
        if (!userId) {
            console.log('User ID not available, skipping daily activity fetch');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const today = getTodayDate();
            const apiUrl = `/api/analysis/users/${userId}/daily-activity?fromDate=${today}&toDate=${today}`;
            
            console.log('📊 [DailyActivity API] 요청 시작:', {
                userId,
                today,
                apiUrl,
                timestamp: new Date().toISOString()
            });
            
            const response = await fetch(apiUrl, {
                credentials: 'include'
            });
            
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
        const userId = user?.id;
        
        if (!userId) {
            console.log('User ID not available, skipping weekly stats fetch');
            setWeeklyLoading(false);
            return;
        }

        try {
            setWeeklyLoading(true);
            const today = getTodayDate();
            const apiUrl = `/api/analysis/users/${userId}/weekly-graph?weekStartDate=${today}`;
            
            console.log('📈 [WeeklyGraph API] 요청 시작:', {
                userId,
                weekStartDate: today,
                apiUrl,
                timestamp: new Date().toISOString()
            });
            
            const response = await fetch(apiUrl, {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ [WeeklyGraph API] 응답 성공:', {
                    userId,
                    weeklyGraphData: data,
                    timestamp: new Date().toISOString()
                });
                
                // API 응답을 차트 형식으로 변환 (주간 데이터)
                const mappedData = data.map(item => ({
                    weekLabel: item.weekLabel || `${item.weekStartDate} ~ ${item.weekEndDate}`, // 주 레이블
                    weekStartDate: item.weekStartDate,
                    weekEndDate: item.weekEndDate,
                    sessionCount: item.sessionsCompleted || 0, // 완료한 세션 수
                    sessionsCompleted: item.sessionsCompleted || 0,
                    questionsAnswered: item.questionsAnswered || 0,
                    correctAnswers: item.correctAnswers || 0,
                    accuracyRate: item.accuracyRate || 0,
                    studyTimeMinutes: item.studyTimeMinutes || 0,
                    averageScore: item.averageScore || 0
                }));
                
                // weekEndDate 기준으로 내림차순 정렬 (가장 최신 주가 먼저)
                const sortedData = mappedData.sort((a, b) => {
                    const dateA = new Date(a.weekEndDate);
                    const dateB = new Date(b.weekEndDate);
                    return dateB - dateA; // 내림차순
                });
                
                // 가장 최신 8주만 선택
                const latest8Weeks = sortedData.slice(0, 8);
                
                // 다시 오름차순으로 정렬 (과거 → 현재 순서로 표시)
                const chartData = latest8Weeks.reverse();
                
                console.log('📊 [WeeklyGraph] 차트 데이터 변환 (최신 8주):', {
                    totalWeeks: data.length,
                    selectedWeeks: chartData.length,
                    chartData
                });
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
        const userId = user?.id;
        
        if (!userId) {
            console.log('User ID not available, skipping question type accuracy fetch');
            setAccuracyLoading(false);
            return;
        }

        try {
            setAccuracyLoading(true);
            const apiUrl = `/api/analysis/users/${userId}/question-type-accuracy`;
            
            console.log('🎯 [QuestionTypeAccuracy API] 요청 시작:', {
                userId,
                apiUrl,
                timestamp: new Date().toISOString()
            });
            
            const response = await fetch(apiUrl, {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ [QuestionTypeAccuracy API] 응답 성공:', {
                    userId,
                    accuracyData: data,
                    timestamp: new Date().toISOString()
                });
                
                // 문제 유형 한글 이름 매핑
                const questionTypeNameMap = {
                    'word': '빈칸 채우기',
                    'sentence': '문장 의미 파악',
                    'conversation': '대화 완성',
                    'WORD': '빈칸 채우기',
                    'SENTENCE': '문장 의미 파악',
                    'CONVERSATION': '대화 완성'
                };
                
                // API 응답을 차트 형식으로 변환 (PRONUNCIATION_RECOGNITION 제외)
                const chartData = data
                    .filter(item => {
                        const questionType = (item.questionType || '').toUpperCase();
                        return questionType !== 'PRONUNCIATION_RECOGNITION';
                    })
                    .map(item => {
                        // questionTypeName이 있으면 사용, 없으면 questionType을 한글 이름으로 매핑
                        const questionType = item.questionType || item.displayName || '';
                        const displayName = item.questionTypeName || 
                                          item.displayName || 
                                          questionTypeNameMap[questionType] || 
                                          questionTypeNameMap[questionType.toUpperCase()] || 
                                          questionType;
                        
                        return {
                            type: displayName,
                            accuracy: item.accuracyRate || 0,
                            totalQuestions: item.totalQuestions || 0,
                            correctAnswers: item.correctAnswers || 0,
                            wrongAnswers: item.wrongAnswers || (item.totalQuestions - (item.correctAnswers || 0)),
                            averageTimeSpent: item.averageTimeSpent,
                            totalTimeSpent: item.totalTimeSpent
                        };
                    })
                    .filter(item => item.totalQuestions > 0); // 문제가 있는 항목만 표시
                
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
        const userId = user?.id;
        
        if (!userId) {
            console.log('User ID not available, skipping weakness distribution fetch');
            setWeaknessLoading(false);
            return;
        }

        try {
            setWeaknessLoading(true);
            const apiUrl = `/api/analysis/users/${userId}/weakness-distribution`;
            
            console.log('🎯 [WeaknessDistribution API] 요청 시작:', {
                userId,
                apiUrl,
                timestamp: new Date().toISOString()
            });
            
            const response = await fetch(apiUrl, {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ [WeaknessDistribution API] 응답 성공:', {
                    userId,
                    weaknessData: data,
                    timestamp: new Date().toISOString()
                });
                
                // API 응답을 차트 형식으로 변환 (새로운 데이터 구조)
                // category_proficiency 기준으로 정렬 (낮은 순서대로 - 약점이 높은 순서)
                const sortedData = data.sort((a, b) => (a.category_proficiency || 0) - (b.category_proficiency || 0));
                
                // 정답률 기준으로 우선순위 재할당
                const chartData = sortedData.map((item, index) => {
                    const majorCategory = item.major_category || '';
                    const minorCategory = item.minor_category || '';
                    const displayName = minorCategory ? `${majorCategory} - ${minorCategory}` : majorCategory;
                    
                    const questionsSolved = item.questions_solved || 0;
                    const correctAnswers = item.correct_answers || 0;
                    const incorrectAnswers = questionsSolved - correctAnswers;
                    const categoryProficiency = item.category_proficiency || 0;
                    
                    // 정답률이 동일한 경우 공동 순위 처리
                    let priority = index + 1;
                    if (index > 0 && categoryProficiency === sortedData[index - 1].category_proficiency) {
                        priority = sortedData.findIndex((prevItem, prevIndex) => 
                            prevIndex < index && (prevItem.category_proficiency || 0) === categoryProficiency
                        ) + 1;
                    }
                    
                    // 약점 등급 계산 (정답률 기준)
                    let weaknessGrade = 'LOW';
                    if (categoryProficiency < 50) {
                        weaknessGrade = 'HIGH';
                    } else if (categoryProficiency < 70) {
                        weaknessGrade = 'MEDIUM';
                    }
                    
                    return {
                        type: displayName,
                        displayName: displayName,
                        majorCategory: majorCategory,
                        minorCategory: minorCategory,
                        count: questionsSolved, // 도넛 차트에 표시할 값 (전체 문제 수)
                        questionsSolved: questionsSolved,
                        correctAnswers: correctAnswers,
                        incorrectAnswers: incorrectAnswers,
                        accuracyRate: categoryProficiency,
                        categoryProficiency: categoryProficiency,
                        avgSolveTime: item.avg_category_solve_time || 0,
                        lastPracticeDate: item.last_category_practice_date,
                        weaknessGrade: weaknessGrade,
                        priority: priority
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
        
        // URL에 토큰과 사용자 정보가 있으면 저장 (백엔드에서 직접 리다이렉트된 경우)
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userIdFromUrl = urlParams.get('userId');
        const username = urlParams.get('username');
        const profileImage = urlParams.get('profileImage');
        
        if (token && userIdFromUrl && username) {
            console.log('HomePage - URL에서 사용자 정보 발견, 저장 중...');
            console.log('- token:', token);
            console.log('- userId:', userIdFromUrl);
            console.log('- username:', username);
            console.log('- profileImage:', profileImage);
            
            // 토큰 저장
            localStorage.setItem('jwt_token', token);
            sessionStorage.setItem('jwt_token', token);
            
            // 사용자 정보 저장 (전역 상태에만 저장, localStorage에 저장하지 않음)
            const decodedUsername = decodeURIComponent(username || '');
            const decodedProfileImage = decodeURIComponent(profileImage || '');
            
            // AppContext 업데이트
            const userData = {
                id: userIdFromUrl === 'null' ? null : userIdFromUrl,
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
            return; // 사용자 정보 설정 후 다음 렌더에서 데이터 로드
        }
        
        // 사용자 ID가 없으면 대기
        if (!user?.id) {
            console.log('📊 [HomePage] 사용자 ID가 없어 대기 중...');
            return;
        }
        
        // 이미 데이터를 로드했으면 재로드하지 않음 (같은 세션 내에서)
        if (hasLoadedData.current) {
            console.log('📊 [HomePage] 이미 데이터를 로드했음, 재로드 스킵');
            return;
        }
        
        // HomePage 마운트 시 사용자 정보 확인
        console.log('HomePage - 마운트 시 사용자 정보:', user);
        console.log('HomePage - 사용자 이름:', user?.name);
        console.log('HomePage - 프로필 이미지:', user?.profileImage);
        console.log('HomePage - 사용자 ID:', user?.id);

        // 오늘의 학습 데이터 가져오기
        fetchDailyActivity();
        
        // 주간 학습량 데이터 가져오기
        fetchWeeklyStats();
        
        // 유형별 정답률 데이터 가져오기
        fetchQuestionTypeAccuracy();
        
        // 약점 유형 분포 데이터 가져오기
        fetchWeaknessDistribution();
        
        // 데이터 로드 완료 표시
        hasLoadedData.current = true;
    }, [user?.id, setUser]); // user?.id가 있을 때만 실행, 초기 마운트 시에만 호출

    

    // 더미 데이터 (UI 확인용)
    const [todayWords, setTodayWords] = useState([]);

    // 오늘의 단어 - 백엔드 연결
    useEffect(() => {
        const userId = user?.id;
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
    }, [user?.id]);

    // 복습 퀴즈 - 백엔드 연결
    useEffect(() => {
        const userId = user?.id;
        if (!userId) return;
        fetchReviewQuiz(userId)
            .then((data) => {
                const quizzes = Array.isArray(data) ? data : (data?.questions || []);
                setReviewQuiz(quizzes.map((q, idx) => ({
                    id: q.id || q.questionId || idx + 1,
                    question: q.question || q.questionText || '',
                    options: q.options || [q.optionA, q.optionB, q.optionC].filter(Boolean)
                })));
            })
            .catch(() => {})
    }, [user?.id]);

    

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

