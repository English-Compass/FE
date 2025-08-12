import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar.jsx';
import { Button } from './ui/button.jsx';
import '../styles/components/_topbar.scss';

const TopBar = () => {
    const navigate = useNavigate();
    const { user } = useApp();

    const handleLogoClick = () => {
        navigate('/dashboard/home');
    };

    const handleLogout = () => {
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
              {user?.name?.charAt(0) || 'U'}
            </div>

            <button onClick={handleLogout} className="topbar__logout">
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;