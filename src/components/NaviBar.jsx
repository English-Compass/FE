import React from "react";
import { NavLink } from "react-router-dom";
import {Home, Film, BookOpenCheck, RotateCcw, User } from 'lucide-react';
import '../styles/components/_navigation.scss';

const navItems = [
    { id: 'home', label: '홈', icon: Home, path: '/dashboard/home' },
    { id: 'media', label: '미디어', icon: Film, path: '/dashboard/media' },
    { id: 'study', label: '학습', icon: BookOpenCheck, path: '/dashboard/study' },
    { id: 'review', label: '리뷰', icon: RotateCcw, path: '/dashboard/review' },
    { id: 'mypage', label: '마이페이지', icon: User, path: '/dashboard/my' }
    ];

const NaviBar = () => {
  return (
    <nav className="navigation">
      <div className="navigation__container">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => 
                `navigation__item ${
                  isActive
                    ? 'navigation__item--active'
                    : 'navigation__item--inactive'
                }`
              }
            >
              <IconComponent className="navigation__icon" />
              <span className="navigation__label">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default NaviBar;