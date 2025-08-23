import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useApp } from '../../context/AppContext';
import ProfileView from './ProfileView';
import ProfileEdit from './ProfileEdit.jsx';
import AccountManagementCard from './AccountManagement';

export default function ProfileTab() {
  const { user, setUser, getDifficultyText, KEYWORDS_BY_CATEGORY } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    learningGoal: user?.learningGoal || '',
    level: user?.level || 'B',
    keywords: user?.keywords || [],
  });

  const handleSaveProfile = () => {
    if (user) {
      setUser({
        ...user,
        name: editForm.name,
        learningGoal: editForm.learningGoal,
        level: editForm.level,
        keywords: editForm.keywords,
      });
    }
    setIsEditing(false);
  };
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            프로필 정보
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? '취소' : '편집'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <ProfileEdit
              user={user}
              editForm={editForm}
              setEditForm={setEditForm}
              onSave={handleSaveProfile}
              KEYWORDS_BY_CATEGORY={KEYWORDS_BY_CATEGORY}
            />
          ) : (
            <ProfileView 
              user={user} 
              getDifficultyText={getDifficultyText} 
            />
          )}
        </CardContent>
      </Card>
      <AccountManagementCard />
    </>
  );
}