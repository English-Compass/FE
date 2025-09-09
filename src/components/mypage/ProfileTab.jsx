import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useApp } from '../../context/AppContext';
import ProfileView from './ProfileView';
import ProfileEdit from './ProfileEdit.jsx';
import AccountManagementCard from './AccountManagement';

export default function ProfileTab() {
  const { user, setUser, getDifficultyText, KEYWORDS_BY_CATEGORY } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    learningGoal: user?.learningGoal || '',
    level: 'B', // 기본값으로 설정, API 응답 후 업데이트
    keywords: [], // 기본값으로 설정, API 응답 후 업데이트
  });

  // 백엔드에서 사용자 설정 정보 조회
  const fetchUserSettings = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('ProfileTab - 토큰이 없습니다. 기본값을 사용합니다.');
        setIsLoading(false);
        return;
      }

      console.log('ProfileTab - 백엔드에서 사용자 설정 조회 시작');
      const response = await fetch('/user/settings', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('ProfileTab - API 응답 상태:', response.status, response.statusText);

      if (response.ok) {
        // 응답이 성공적이지만 JSON이 아닐 수 있으므로 안전하게 처리
        let responseData = null;
        const contentType = response.headers.get('content-type');
        
        console.log('ProfileTab - 응답 Content-Type:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
          try {
            responseData = await response.json();
            console.log('ProfileTab - 사용자 설정 조회 응답:', responseData);
            
            const userData = responseData;
            
            // 백엔드 레벨(1, 2, 3)을 프론트엔드 레벨(A, B, C)로 변환
            const levelMapping = { 1: 'A', 2: 'B', 3: 'C' };
            const frontendLevel = levelMapping[userData.difficultyLevel] || 'B';
            
            // 백엔드 카테고리 Map을 프론트엔드 키워드 배열로 변환
            const keywordsArray = [];
            if (userData.categories) {
              Object.values(userData.categories).forEach(categoryKeywords => {
                keywordsArray.push(...categoryKeywords);
              });
            }
            
            console.log('ProfileTab - 변환된 데이터:', {
              level: frontendLevel,
              keywords: keywordsArray
            });
            
            // AppContext의 user 상태 업데이트
            setUser(prevUser => ({
              ...prevUser,
              level: frontendLevel,
              keywords: keywordsArray
            }));

            // editForm도 업데이트
            setEditForm(prev => ({
              ...prev,
              level: frontendLevel,
              keywords: keywordsArray
            }));
          } catch (jsonError) {
            console.warn('ProfileTab - JSON 파싱 실패:', jsonError);
            console.log('ProfileTab - 응답 텍스트:', await response.text());
          }
        } else {
          console.log('ProfileTab - JSON이 아닌 응답입니다. 상태 코드:', response.status);
          const responseText = await response.text();
          console.log('ProfileTab - 응답 텍스트:', responseText);
        }
      } else {
        console.error('ProfileTab - 사용자 설정 조회 실패:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('ProfileTab - 에러 응답:', errorText);
      }
    } catch (error) {
      console.error('ProfileTab - 사용자 설정 조회 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 사용자 설정 정보 조회
  useEffect(() => {
    fetchUserSettings();
  }, []);

  const handleSaveProfile = () => {
    // ProfileEdit 컴포넌트에서 API 호출을 처리하므로 여기서는 편집 모드만 종료
    setIsEditing(false);
  };

  const handleEditToggle = async () => {
    if (!isEditing) {
      // 편집 모드로 전환할 때 최신 데이터를 다시 조회
      await fetchUserSettings();
    }
    setIsEditing(!isEditing);
  };
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            프로필 정보
            <Button variant="outline" size="sm" onClick={handleEditToggle}>
              {isEditing ? '취소' : '편집'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">사용자 정보를 불러오는 중...</span>
            </div>
          ) : isEditing ? (
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