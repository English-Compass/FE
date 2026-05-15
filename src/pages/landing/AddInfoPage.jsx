import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
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
        
        // HttpOnly 쿠키(access_token)가 있으면 자동으로 전송됨
        // localStorage에서 토큰을 읽을 필요 없음
        // 쿠키가 없으면 Gateway에서 401을 반환하므로 여기서는 확인하지 않음
        console.log('AddInfoPage - 마운트 완료 (HttpOnly 쿠키 사용)');
    }, []);

    // 사용자 정보 완성 및 대시보드로 이동
    const handleComplete = async () => {
        if (formData.keywords.length > 0) {
            setIsSaving(true);
            try {
                // HttpOnly 쿠키(access_token)가 있으면 자동으로 전송됨
                // localStorage에서 토큰을 읽을 필요 없음
                console.log('AddInfoPage - 저장 시도 중 (HttpOnly 쿠키 사용)');

                // 프론트엔드 레벨(A, B, C)을 백엔드 레벨(1, 2, 3)로 변환
                const levelMapping = { 'A': 1, 'B': 2, 'C': 3 };
                const difficultyLevel = levelMapping[formData.level] || 2; // 기본값: 중급

                // 한글 키워드를 영어 enum으로 매핑
       const keywordToEnumMap = {
           '수업 참여': 'CLASS_LISTENING',
           '학과 대화': 'DEPARTMENT_CONVERSATION',
           '과제 시험': 'ASSIGNMENT_EXAM',
           '회의': 'MEETING_CONFERENCE',
           '고객 서비스': 'CUSTOMER_SERVICE',
           '이메일 보고서': 'EMAIL_REPORT',
           '배낭여행': 'BACKPACKING',
           '가족여행': 'FAMILY_TRIP',
           '친구와 여행': 'FRIEND_TRIP',
           '쇼핑 외식': 'SHOPPING_DINING',
           '병원 이용': 'HOSPITAL_VISIT',
           '대중교통 이용': 'PUBLIC_TRANSPORT'
       };

                // 프론트엔드 키워드를 CategoryRequestDto 형식으로 변환 (영어 enum 사용)
                const categoriesMap = {};
                formData.keywords.forEach(keyword => {
                    // 한글 키워드를 영어 enum으로 변환
                    const enumKeyword = keywordToEnumMap[keyword];
                    
                    if (!enumKeyword) {
                        console.warn(`키워드 매핑을 찾을 수 없습니다: ${keyword}`);
                        return;
                    }

                    // 각 키워드가 어느 카테고리에 속하는지 찾기
                    for (const [categoryKey, categoryKeywords] of Object.entries(KEYWORDS_BY_CATEGORY)) {
                        if (categoryKeywords.includes(keyword)) {
                            if (!categoriesMap[categoryKey]) {
                                categoriesMap[categoryKey] = [];
                            }
                            // 영어 enum 값으로 저장
                            categoriesMap[categoryKey].push(enumKeyword);
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
                console.log('🔵 [AddInfoPage] POST 요청 시작 - /api/user/settings/difficulty');
                console.log('🔵 [AddInfoPage] 요청 데이터:', JSON.stringify(difficultyRequestData, null, 2));
                
                const difficultyResponse = await fetch('/api/user/settings/difficulty', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include', // 쿠키 전달 필수! (HttpOnly 쿠키 포함)
                    body: JSON.stringify(difficultyRequestData)
                });
                
                console.log('🔵 [AddInfoPage] POST 응답 상태:', difficultyResponse.status, difficultyResponse.statusText);

                if (!difficultyResponse.ok) {
                    const errorText = await difficultyResponse.text();
                    console.error('난이도 설정 실패:', difficultyResponse.status, errorText);
                    throw new Error(`난이도 설정 실패: ${difficultyResponse.status} - ${errorText}`);
                }

                // 2. 카테고리 설정 저장 (PUT 방식으로 전체 교체)
                console.log('🟢 [AddInfoPage] PUT 요청 시작 - /api/user/settings/categories');
                console.log('🟢 [AddInfoPage] 요청 데이터:', JSON.stringify(categoryRequestData, null, 2));
                
                const categoryResponse = await fetch('/api/user/settings/categories', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include', // 쿠키 전달 필수! (HttpOnly 쿠키 포함)
                    body: JSON.stringify(categoryRequestData)
                });
                
                console.log('🟢 [AddInfoPage] PUT 응답 상태:', categoryResponse.status, categoryResponse.statusText);

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
                    
                    // 사용자 정보는 전역 상태에만 저장 (localStorage에 저장하지 않음)
                    
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