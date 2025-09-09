import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectType } from '../../components/study/SelectType';
import StudySession from '../../components/study/StudySession';
import { StudyCompleteSummary } from '../../components/study/StudyCompleteSummary';
import { useApp } from '../../context/AppContext';

export default function StudyPage() {
  const navigate = useNavigate();
  const { 
    currentStep, 
    setCurrentStep, 
    setSelectedType,
    studyResults,
    setStudyResults,
    scrollToTop
  } = useApp();

  useEffect(() => {
    scrollToTop();
  }, []);

  // 학습 유형 선택 완료 후 학습 세션 화면으로 이동
  const handleTypeSelected = () => {
    setCurrentStep('studysession');
  };

  // 학습 완료 후 결과 화면으로 이동
  const handleStudyComplete = (results) => {
    setStudyResults({
      ...results,
      completedAt: new Date().toISOString()
    });
    setCurrentStep('complete');
  };

  // 다시 학습하기
  const handleRestart = () => {
    setCurrentStep('type');
    setSelectedType('');
    setStudyResults({
      totalQuestions: 0,
      correctAnswers: 0,
      completedAt: null
    });
  };

  // 홈으로 가기
  const handleGoHome = () => {
    navigate('/dashboard/home');
    // 상태 초기화
    setCurrentStep('type');
    setSelectedType('');
    setStudyResults({
      totalQuestions: 0,
      correctAnswers: 0,
      completedAt: null
    });
  };

  // 현재 단계에 따른 컴포넌트 렌더링
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'type':
        return <SelectType onTypeSelected={handleTypeSelected} />;
      case 'studysession':
        return <StudySession onStudyComplete={handleStudyComplete} />;
      case 'complete':
        return (
          <StudyCompleteSummary 
            studyResults={studyResults}
            onRestart={handleRestart}
            onGoHome={handleGoHome}
          />
        );
      default:
        return <SelectType onTypeSelected={handleTypeSelected} />;
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto !p-4 !sm:p-6 !space-y-6">
      {renderCurrentStep()}
    </div>
  );
}
