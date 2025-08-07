export default function WelcomeSection({ user }) {
    return (
      <div className="home-welcome">
        <h1 className="home-title">안녕하세요, {user?.name}님! 👋</h1>
        <p className="home-subtitle">
          오늘도 영어 학습을 시작해보세요. 꾸준한 학습이 실력 향상의 지름길입니다.
        </p>
      </div>
    );
  }
  