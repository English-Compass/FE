import { useEffect } from 'react';
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
    }, []);

    // 사용자 정보 완성 및 대시보드로 이동
    const handleComplete = () => {
        if (formData.keywords.length > 0) {
            // 사용자 정보 설정
            setUser({
                level: formData.level,
                keywords: formData.keywords
            });
            
            // 폼 데이터 초기화
            resetAdditionalInfo();
            
            // 페이지 이동
            navigate('/dashboard/home');
            
            console.log('User setup completed:', {
                level: formData.level,
                keywords: formData.keywords
            });
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