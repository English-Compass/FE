import React from 'react';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';

export default function ProfileView({ user, getDifficultyText }) {
  return (
    <div className="profile-view">
      <div className="profile-view__header">
        <Avatar className="profile-view__avatar">
          <AvatarImage src={user?.profileImage} />
          <AvatarFallback className="profile-view__avatar-fallback">
            {user?.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="profile-view__info">
          <h3 className="profile-view__info-name">{user?.name}</h3>
          <p className="profile-view__info-email">{user?.email}</p>
          <div className="profile-view__info-badge">
            <Badge variant="outline">Level {user?.level}</Badge>
            <Badge variant="secondary">{getDifficultyText(user?.level)}</Badge>
          </div>
        </div>
      </div>
        <div className="profile-view__content">
            <div>
                <h4 className='profile-view__content-h4'>현재 실력</h4>
                <p className="profile-view__content-p">Level {user?.level} - {getDifficultyText(user?.level)}</p>
            </div>
            <div>
                <h4 className="profile-view__content-h4">관심 키워드</h4>
                <div className="profile-view__content-keywords">
                {user?.keywords?.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="profile-view__content-badge">
                    {keyword}
                    </Badge>
                ))}
                </div>
            </div>
        </div>
    </div>
  );
}