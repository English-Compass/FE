import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

import { ScenarioSelection } from '../../components/conversation/ScenarioSelection';
import { GeneralConversation } from '../../components/conversation/GeneralConversation';
import { RolePlayingScenario } from '../../components/conversation/RolePlayingScenario';
import { SituationDetail } from '../../components/conversation/SituationDetail';
import { CustomSituation } from '../../components/conversation/CustomSituation';
import { ConversationPractice } from '../../components/conversation/ConversationPractice';
import { FeedbackHistory } from '../../components/conversation/FeedbackHistory';

export default function ConversationPage() {
  const navigate = useNavigate();
  const { user, scrollToTop } = useApp();

  useEffect(() => {
    scrollToTop();
  }, []);

  const [currentStep, setCurrentStep] = useState('select');
  const [conversationConfig, setConversationConfig] = useState(null);
  const [situationDetailConfig, setSituationDetailConfig] = useState(null);

  const handleGeneralConversation = () => {
    setCurrentStep('general');
  };

  const handleRolePlayingScenario = () => {
    setCurrentStep('role-playing-scenario');
  };

  const handleCustomRolePlaying = () => {
    setCurrentStep('custom');
  };

  const handleFeedbackHistory = () => {
    setCurrentStep('feedback-history');
  };

  const startConversation = (config) => {
    if (config.type === 'situation-detail') {
      // 상황 상세 화면으로 이동
      setSituationDetailConfig(config);
      setCurrentStep('situation-detail');
    } else {
      // 바로 대화 시작
      setConversationConfig(config);
      setCurrentStep('practice');
    }
  };


  const handleBackToHome = () => {
    navigate('/dashboard/home');
  };

  const handleBackToSelect = () => {
    setCurrentStep('select');
    setConversationConfig(null);
    setSituationDetailConfig(null);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'select':
        return (
          <ScenarioSelection
            user={user}
            onGeneralConversation={handleGeneralConversation}
            onRolePlayingScenario={handleRolePlayingScenario}
            onCustomRolePlaying={handleCustomRolePlaying}
            onFeedbackHistory={handleFeedbackHistory}
            onBackToHome={handleBackToHome}
          />
        );
      
      case 'general':
        return (
          <GeneralConversation
            onBack={handleBackToSelect}
            onStartConversation={startConversation}
          />
        );
      
      case 'role-playing-scenario':
        return (
          <RolePlayingScenario
            onBack={handleBackToSelect}
            onStartConversation={startConversation}
          />
        );
      
      case 'situation-detail':
        return (
          <SituationDetail
            selectedScenario={situationDetailConfig.selectedScenario}
            difficultyLevel={situationDetailConfig.difficultyLevel}
            user={user}
            onBack={handleBackToSelect}
            onStartConversation={startConversation}
          />
        );
      
      case 'custom':
        return (
          <CustomSituation
            onBack={handleBackToSelect}
            onStartConversation={startConversation}
          />
        );
      
      case 'practice':
        return (
          <ConversationPractice
            user={user}
            conversationConfig={conversationConfig}
            onBack={handleBackToSelect}
          />
        );
      
      case 'feedback-history':
        return (
          <FeedbackHistory
            user={user}
            onBack={handleBackToSelect}
          />
        );
      
      default:
        return (
          <ScenarioSelection
            user={user}
            onGeneralConversation={handleGeneralConversation}
            onRolePlayingScenario={handleRolePlayingScenario}
            onCustomRolePlaying={handleCustomRolePlaying}
            onFeedbackHistory={handleFeedbackHistory}
            onBackToHome={handleBackToHome}
          />
        );
    }
  };

  return (
    <>
      {renderCurrentStep()}
    </>
  );
}