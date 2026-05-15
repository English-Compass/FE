import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
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
      console.log('ProfileTab - 백엔드에서 사용자 설정 조회 시작');
      console.log('ProfileTab - HttpOnly 쿠키(access_token) 자동 전송 (credentials: include)');
      
      // HttpOnly 쿠키(access_token)가 있으면 자동으로 전송됨
      // Gateway가 쿠키에서 토큰을 추출하여 검증하므로 Authorization 헤더 불필요
      const response = await fetch('/api/user/settings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // 쿠키 전달 필수! (HttpOnly 쿠키 포함)
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
            
            // 영어 enum을 한글 키워드로 매핑
            const enumToKeywordMap = {
              'CLASS_LISTENING': '수업 참여',
              'DEPARTMENT_CONVERSATION': '학과 대화',
              'ASSIGNMENT_EXAM': '과제 시험',
              'MEETING_CONFERENCE': '회의',
              'CUSTOMER_SERVICE': '고객 서비스',
              'EMAIL_REPORT': '이메일 보고서',
              'BACKPACKING': '배낭여행',
              'FAMILY_TRIP': '가족여행',
              'FRIEND_TRIP': '친구와 여행',
              'SHOPPING_DINING': '쇼핑 외식',
              'HOSPITAL_VISIT': '병원 이용',
              'PUBLIC_TRANSPORT': '대중교통 이용'
            };
            
            // 백엔드 카테고리 Map을 프론트엔드 키워드 배열로 변환 (영어 enum → 한글 키워드)
            const keywordsArray = [];
            if (userData.categories) {
              Object.values(userData.categories).forEach(categoryKeywords => {
                // 영어 enum을 한글 키워드로 변환
                categoryKeywords.forEach(enumKeyword => {
                  const koreanKeyword = enumToKeywordMap[enumKeyword];
                  if (koreanKeyword) {
                    keywordsArray.push(koreanKeyword);
                  } else {
                    console.warn(`알 수 없는 enum 키워드: ${enumKeyword}`);
                  }
                });
              });
            }
            
            console.log('ProfileTab - 변환된 데이터:', {
              level: frontendLevel,
              keywords: keywordsArray
            });
            
            // AppContext의 user 상태 업데이트
            // 백엔드에서 profileImage, name도 함께 반환하므로 함께 업데이트
            setUser(prevUser => ({
              ...prevUser,
              name: userData.name || prevUser.name || null, // 백엔드에서 name 반환
              profileImage: userData.profileImage || prevUser.profileImage || null, // 백엔드에서 profileImage 반환
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

  const handleSaveProfile = async () => {
    // ProfileEdit 컴포넌트에서 API 호출을 처리하므로 여기서는 편집 모드만 종료
    setIsEditing(false);
    // 저장 후 최신 데이터를 다시 조회하여 상태 동기화
    await fetchUserSettings();
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