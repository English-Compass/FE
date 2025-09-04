import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

import { ProgressSteps }from '../../components/add-info/ProgressSteps';
import { LevelSelection }from '../../components/add-info/LevelSelection';
import { KeywordSelection }from '../../components/add-info/KeywordSelection';
import '../../styles/components/_addinfo.scss'

export default function AddInfoPage() {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const { 
        additionalInfoStep: step, 
        KEYWORDS_BY_CATEGORY,
        formData,
        setUser,
        handleKeywordToggle,
        setAdditionalInfoStep,
        resetAdditionalInfo,
        scrollToTop
    } = useApp();

    useEffect(() => {
        scrollToTop();
        
        // AddInfoPage 마운트 시 토큰 상태 확인 (localStorage + sessionStorage)
        let token = localStorage.getItem('token');
        const sessionToken = sessionStorage.getItem('token');
        
        console.log('AddInfoPage - 마운트 시 토큰 확인:');
        console.log('- localStorage token:', token);
        console.log('- sessionStorage token:', sessionToken);
        
        // localStorage에 토큰이 없으면 sessionStorage에서 복구 시도
        if (!token && sessionToken) {
            console.log('localStorage에 토큰이 없어서 sessionStorage에서 복구합니다.');
            localStorage.setItem('token', sessionToken);
            token = sessionToken;
        }
        
        if (!token) {
            console.error('AddInfoPage - 모든 저장소에서 토큰이 없습니다!');
            console.log('토큰이 없으므로 랜딩 페이지로 리다이렉트합니다.');
            navigate('/landing');
            return;
        }
    }, []);

    // 사용자 정보 완성 및 대시보드로 이동
    const handleComplete = async () => {
        if (formData.keywords.length > 0) {
            setIsSaving(true);
            try {
                let token = localStorage.getItem('token');
                const sessionToken = sessionStorage.getItem('token');
                
                console.log('AddInfoPage - 저장 시도 중 토큰 확인:');
                console.log('- localStorage token:', token);
                console.log('- sessionStorage token:', sessionToken);
                
                // localStorage에 토큰이 없으면 sessionStorage에서 복구 시도
                if (!token && sessionToken) {
                    console.log('localStorage에 토큰이 없어서 sessionStorage에서 복구합니다.');
                    localStorage.setItem('token', sessionToken);
                    token = sessionToken;
                }
                
                if (!token) {
                    console.error('AddInfoPage - 모든 저장소에서 토큰이 없습니다!');
                    alert('로그인이 필요합니다.');
                    navigate('/landing');
                    return;
                }

                // 프론트엔드 레벨(A, B, C)을 백엔드 레벨(1, 2, 3)로 변환
                const levelMapping = { 'A': 1, 'B': 2, 'C': 3 };
                const difficultyLevel = levelMapping[formData.level] || 2; // 기본값: 중급

                // 프론트엔드 키워드를 CategoryRequestDto 형식으로 변환
                const categoriesMap = {};
                formData.keywords.forEach(keyword => {
                    // 각 키워드가 어느 카테고리에 속하는지 찾기
                    for (const [categoryKey, categoryKeywords] of Object.entries(KEYWORDS_BY_CATEGORY)) {
                        if (categoryKeywords.includes(keyword)) {
                            if (!categoriesMap[categoryKey]) {
                                categoriesMap[categoryKey] = [];
                            }
                            categoriesMap[categoryKey].push(keyword);
                            break;
                        }
                    }
                });

                // 백엔드로 전송할 데이터 (CategoryRequestDto 형식)
                const categoryRequestData = {
                    categories: categoriesMap
                };

                // 난이도와 카테고리를 별도로 전송
                const difficultyRequestData = {
                    difficultyLevel: difficultyLevel
                };

                console.log('카테고리 설정 요청:', categoryRequestData);
                console.log('난이도 설정 요청:', difficultyRequestData);

                // 1. 난이도 설정 저장
                const difficultyResponse = await fetch('/user/settings/difficulty', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(difficultyRequestData)
                });

                if (!difficultyResponse.ok) {
                    const errorText = await difficultyResponse.text();
                    console.error('난이도 설정 실패:', difficultyResponse.status, errorText);
                    throw new Error(`난이도 설정 실패: ${difficultyResponse.status} - ${errorText}`);
                }

                // 2. 카테고리 설정 저장
                const categoryResponse = await fetch('/user/settings/categories', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(categoryRequestData)
                });

                if (!categoryResponse.ok) {
                    const errorText = await categoryResponse.text();
                    console.error('카테고리 설정 실패:', categoryResponse.status, errorText);
                    throw new Error(`카테고리 설정 실패: ${categoryResponse.status} - ${errorText}`);
                }

                const response = categoryResponse; // 마지막 응답을 사용

                if (response.ok) {
                    // 응답이 성공적이지만 JSON이 아닐 수 있으므로 안전하게 처리
                    let responseData = null;
                    const contentType = response.headers.get('content-type');
                    
                    if (contentType && contentType.includes('application/json')) {
                        try {
                            responseData = await response.json();
                            console.log('사용자 설정 저장 응답:', responseData);
                        } catch (jsonError) {
                            console.warn('JSON 파싱 실패, 빈 응답으로 처리:', jsonError);
                        }
                    } else {
                        console.log('JSON이 아닌 응답입니다. 상태 코드:', response.status);
                    }

                    // 사용자 정보 설정 (로컬 상태 업데이트)
                    setUser({
                        level: formData.level,
                        keywords: formData.keywords
                    });
                    
                    // localStorage의 user 정보도 업데이트
                    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                    localStorage.setItem('user', JSON.stringify({
                        ...storedUser,
                        level: formData.level,
                        keywords: formData.keywords
                    }));
                    
                    // 사용자 설정 완료 (백엔드에서 자동으로 처리됨)
                    
                    // 폼 데이터 초기화
                    resetAdditionalInfo();
                    
                    // 페이지 이동
                    navigate('/dashboard/home');
                    
                    console.log('User setup completed:', {
                        level: formData.level,
                        keywords: formData.keywords
                    });
                } else {
                    // 에러 응답 처리
                    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                    
                    try {
                        const contentType = response.headers.get('content-type');
                        if (contentType && contentType.includes('application/json')) {
                            const errorData = await response.json();
                            errorMessage = errorData.message || errorMessage;
                        }
                    } catch (jsonError) {
                        console.warn('에러 응답 JSON 파싱 실패:', jsonError);
                    }
                    
                    console.error('사용자 설정 저장 실패:', errorMessage);
                    alert(`설정 저장에 실패했습니다: ${errorMessage}`);
                }
            } catch (error) {
                console.error('사용자 설정 저장 오류:', error);
                alert('설정 저장 중 오류가 발생했습니다.');
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handlePrev = () => {
        setAdditionalInfoStep(1);
    };

    const renderStep = () => (
        step === 1 ? 
            <LevelSelection /> : 
            <KeywordSelection 
                KEYWORDS_BY_CATEGORY={KEYWORDS_BY_CATEGORY}
                selectedKeywords={formData.keywords}
                formData={formData}
                onToggle={handleKeywordToggle}
                handleKeywordToggle={handleKeywordToggle}
                onPrev={handlePrev}
                handleSubmit={handleComplete}
                canComplete={formData.keywords.length > 0}
                isSaving={isSaving}
            />
    );

    return (
        <div className="add-info-page">
            <Card className="add-info__card">
                <CardHeader className="add-info__header">
                    <div className="app-branding">
                        <BookOpen className="app-icon" />
                        <h1 className="app-title">English Compass</h1>
                    </div>
                    <CardTitle>학습 정보 설정</CardTitle>
                    <p className="page-description">맞춤형 학습을 위해 실력과 관심 분야를 선택해주세요</p>
                    <ProgressSteps step={step} total={2} labels={["실력 수준", "관심 분야"]} />
                    </CardHeader>

                    <CardContent className="add-info__content">
                    {renderStep()}
                </CardContent>
            </Card>
        </div>
    )
}