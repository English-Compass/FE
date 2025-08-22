import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
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
      setIsExpanded(true);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Card className="!mt-8">
      <CardHeader 
        className="cursor-pointer transition-colors duration-200 ease-in-out hover:bg-gray-50 md:cursor-default md:hover:bg-transparent"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">📚 효과적인 미디어 학습법</span>
          <div className={`
            transition-transform duration-200 ease-in-out
            ${isExpanded ? 'rotate-180' : ''}
          `}>
            {isExpanded ? (
              <ChevronUp />
            ) : (
              <ChevronDown />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className={`
        overflow-hidden transition-all duration-300 ease-in-out
        ${isExpanded 
          ? 'max-h-[500px] opacity-100 animate-[slideDown_0.3s_ease]' 
          : 'max-h-0 !px-4 !py-0 opacity-0'
        }
      `}>
        <div className="grid md:grid-cols-2 gap-4 text-m">
          <div className="!space-y-2">
            <div>
              <h4 className="text-foreground font-medium">1단계: 자막 켜고 보기</h4>
              <p className="text-muted-foreground leading-tight">처음엔 한글 자막과 함께 내용을 이해하세요</p>
            </div>
            
            <div>
              <h4 className="text-foreground font-medium">2단계: 영어 자막으로 보기</h4>
              <p className="text-muted-foreground leading-tight">같은 내용을 영어 자막으로 다시 시청하세요</p>
            </div>
          </div>
          <div className=" !space-y-2">
            <div>
              <h4 className="text-foreground font-medium">3단계: 자막 없이 도전</h4>
              <p className="text-muted-foreground leading-tight">익숙해지면 자막 없이 시청해보세요</p>
            </div>
            
            <div>
              <h4 className="text-foreground font-medium">4단계: 따라 말하기</h4>
              <p className="text-muted-foreground leading-tight">좋아하는 대사를 따라 말하며 발음 연습하세요</p>
            </div>
          </div>
        </div>
      </CardContent>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Card>
  );
}
