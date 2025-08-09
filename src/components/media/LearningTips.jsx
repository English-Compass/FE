import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function LearningTips() {
  // 화면 크기에 따라 초기 상태 설정 (768px 이상에서는 기본 펼침)
  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return false;
  });

  // 화면 크기 변경 감지
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsExpanded(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Card className="learning-tips-card mt-8">
      <CardHeader 
        className="tips-header cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="tips-title-wrapper flex items-center justify-between text-lg">
          <span className="tips-title">📚 효과적인 미디어 학습법</span>
          <div className="expand-icon">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className={`tips-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="tips-grid grid md:grid-cols-2 gap-4 text-sm">
          <div className="tips-column space-y-2">
            <div className="tip-item">
              <h4 className="tip-title font-medium">1단계: 자막 켜고 보기</h4>
              <p className="tip-description text-gray-600">처음엔 한글 자막과 함께 내용을 이해하세요</p>
            </div>
            
            <div className="tip-item">
              <h4 className="tip-title font-medium">2단계: 영어 자막으로 보기</h4>
              <p className="tip-description text-gray-600">같은 내용을 영어 자막으로 다시 시청하세요</p>
            </div>
          </div>
          <div className="tips-column space-y-2">
            <div className="tip-item">
              <h4 className="tip-title font-medium">3단계: 자막 없이 도전</h4>
              <p className="tip-description text-gray-600">익숙해지면 자막 없이 시청해보세요</p>
            </div>
            
            <div className="tip-item">
              <h4 className="tip-title font-medium">4단계: 따라 말하기</h4>
              <p className="tip-description text-gray-600">좋아하는 대사를 따라 말하며 발음 연습하세요</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
