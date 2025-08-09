import { Badge } from '../ui/badge';


export default function WelcomeSection({ user }) {
    return (
      <div className="home-welcome">
        <h1 className="home-title">안녕하세요, {user?.name}님! 👋</h1>
        <p className="home-subtitle">
          오늘도 영어 학습을 시작해보세요. 꾸준한 학습이 실력 향상의 지름길입니다.
        </p>
        {/* 사용자 관심 키워드 표시 */}
        {user?.keywords && user.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-sm text-gray-500">관심 키워드:</span>
            {user.keywords.slice(0, 5).map((keyword, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {keyword}
              </Badge>
            ))}
            {user.keywords.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{user.keywords.length - 5}개 더
              </Badge>
            )}
          </div>
        )}
      </div>
    );
  }
  