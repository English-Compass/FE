import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

import { ScenarioSelection } from '../../components/conversation/ScenarioSelection';
import { CustomSituation } from '../../components/conversation/CustomSituation';
import { SituationDetail } from '../../components/conversation/SituationDetail';
import { ConversationPractice } from '../../components/conversation/ConversationPractice';

// API: 회화 시나리오 목록을 서버에서 가져와야 합니다.
const CONVERSATION_SCENARIOS = [
  {
    id: 'job-interview',
    title: '면접 상황',
    description: '취업 면접에서 자주 나오는 질문과 답변 연습',
    icon: '💼',
    level: [3, 4, 5], // 중급-상급
    situations: [
      "You are interviewing for a marketing position at a tech company.",
      "You are applying for a teaching job at an international school.",
      "You are interviewing for a customer service role at a hotel."
    ]
  },
  {
    id: 'restaurant',
    title: '레스토랑',
    description: '음식점에서 주문하고 대화하기',
    icon: '🍽️',
    level: [1, 2, 3], // 초급-중급
    situations: [
      "You are ordering food at a fine dining restaurant.",
      "You are at a fast-food restaurant with friends.",
      "You are complaining about cold food to the waiter."
    ]
  },
  {
    id: 'travel',
    title: '여행 상황',
    description: '공항, 호텔, 관광지에서의 대화',
    icon: '✈️',
    level: [2, 3, 4], // 초중급-중상급
    situations: [
      "You are checking into a hotel and asking about amenities.",
      "You are asking for directions to a famous landmark.",
      "You are at the airport dealing with a delayed flight."
    ]
  },
  {
    id: 'business',
    title: '비즈니스 미팅',
    description: '업무 미팅과 협상 상황',
    icon: '🤝',
    level: [4, 5, 6], // 중상급-최상급
    situations: [
      "You are presenting a new project proposal to your team.",
      "You are negotiating a contract with a client.",
      "You are discussing budget concerns with your manager."
    ]
  },
  {
    id: 'shopping',
    title: '쇼핑',
    description: '상점에서 물건 구매하기',
    icon: '🛍️',
    level: [1, 2, 3], // 초급-중급
    situations: [
      "You are buying clothes and asking about sizes and prices.",
      "You are returning a defective product to the store.",
      "You are asking a salesperson for recommendations."
    ]
  },
  {
    id: 'medical',
    title: '병원/약국',
    description: '의료 상황에서의 대화',
    icon: '🏥',
    level: [3, 4, 5], // 중급-상급
    situations: [
      "You are describing your symptoms to a doctor.",
      "You are asking a pharmacist about medication.",
      "You are scheduling a medical appointment."
    ]
  }
];

export default function ConversationPage() {
  const navigate = useNavigate();
  const { user, scrollToTop } = useApp();

  useEffect(() => {
    scrollToTop();
  }, []);

  const [currentStep, setCurrentStep] = useState('select');
  const [selectedScenario, setSelectedScenario] = useState(null);

  const handleScenarioSelect = (scenario) => {
    setSelectedScenario(scenario);
    setCurrentStep('detail');
  };

  const handleSituationSelect = (situation) => {
    startConversation(situation);
  };

  const startConversation = (situation) => {
    setCurrentStep('practice');
  };


  const handleBackToHome = () => {
    navigate('/dashboard/home');
  };

  const handleBackToSelect = () => {
    setCurrentStep('select');
    setSelectedScenario(null);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'select':
        return (
          <ScenarioSelection
            user={user}
            scenarios={CONVERSATION_SCENARIOS}
            onScenarioSelect={handleScenarioSelect}
            onCustomSelect={() => setCurrentStep('custom')}
            onBackToHome={handleBackToHome}
          />
        );
      
      case 'custom':
        return (
          <CustomSituation
            onBack={handleBackToSelect}
            onStartConversation={startConversation}
          />
        );
      
      case 'detail':
        return (
          <SituationDetail
            scenario={selectedScenario}
            onBack={handleBackToSelect}
            onSituationSelect={handleSituationSelect}
          />
        );
      
      case 'practice':
        return (
          <ConversationPractice
            user={user}
            onBack={handleBackToSelect}
          />
        );
      
      default:
        return (
          <ScenarioSelection
            user={user}
            scenarios={CONVERSATION_SCENARIOS}
            onScenarioSelect={handleScenarioSelect}
            onCustomSelect={() => setCurrentStep('custom')}
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