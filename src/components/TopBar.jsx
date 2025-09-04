import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar.jsx';
import { Button } from './ui/button.jsx';
import '../styles/components/_topbar.scss';

const TopBar = memo(() => {
    const navigate = useNavigate();
    const { user } = useApp();
    
    // 디버깅을 위한 로그
    console.log('TopBar - 현재 사용자 정보:', user);
    console.log('TopBar - 사용자 이름:', user?.name);
    console.log('TopBar - 프로필 이미지:', user?.profileImage);
    console.log('TopBar - 사용자 ID:', user?.id);

    const handleLogoClick = () => {
        navigate('/dashboard/home');
    };

    const handleLogout = () => {
        // 로그아웃 시 localStorage 초기화
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/landing');
    };

  return (
    <header className="topbar">
      <div className="topbar__container">
        <div className="topbar__content">
          <button onClick={handleLogoClick} className="topbar__brand">
            <BookOpen className="topbar__logo" />
            <h1 className="topbar__title">English Compass</h1>
          </button>

          <div className="topbar__user">
            <div className="topbar__user-info">
              <span className="topbar__greeting">안녕하세요,</span>
              <span className="topbar__username">{user?.name || '사용자'}님</span>
            </div>

            <div className="topbar__avatar">
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={user.name || 'User'} 
                  className="topbar__avatar-image"
                />
              ) : (
                user?.name?.charAt(0) || 'U'
              )}
            </div>

            <button onClick={handleLogout} className="topbar__logout">
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </header>
  );
});

TopBar.displayName = 'TopBar';

export default TopBar;