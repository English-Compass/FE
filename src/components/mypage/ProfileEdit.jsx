import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useApp } from '../../context/AppContext';

export default function ProfileEdit({ user, editForm, setEditForm, onSave }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { STUDY_TYPES, KEYWORDS_BY_CATEGORY, setUser } = useApp();

  const handleKeywordToggle = (keyword) => {
    setEditForm(prev => ({
      ...prev,
      keywords: prev.keywords.includes(keyword)
        ? prev.keywords.filter(k => k !== keyword)
        : [...prev.keywords, keyword],
    }));
  };

  // 백엔드에서 사용자 설정 정보 조회
  const fetchInitialUserSettings = async () => {
    setIsInitialLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('ProfileEdit - 토큰이 없습니다. 기본값을 사용합니다.');
        setIsInitialLoading(false);
        return;
      }

      console.log('ProfileEdit - 백엔드에서 사용자 설정 조회 시작');
      const response = await fetch('/user/settings', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('ProfileEdit - API 응답 상태:', response.status, response.statusText);

      if (response.ok) {
        // 응답이 성공적이지만 JSON이 아닐 수 있으므로 안전하게 처리
        let responseData = null;
        const contentType = response.headers.get('content-type');
        
        console.log('ProfileEdit - 응답 Content-Type:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
          try {
            responseData = await response.json();
            console.log('ProfileEdit - 사용자 설정 조회 응답:', responseData);
            
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
            
            console.log('ProfileEdit - 변환된 데이터:', {
              level: frontendLevel,
              keywords: keywordsArray
            });
            
            // AppContext의 user 상태도 업데이트
            setUser(prevUser => ({
              ...prevUser,
              level: frontendLevel,
              keywords: keywordsArray
            }));

            // editForm 업데이트 (현재 편집 중인 폼 데이터)
            setEditForm(prev => {
              const newForm = {
                ...prev,
                level: frontendLevel,
                keywords: keywordsArray
              };
              console.log('ProfileEdit - editForm 업데이트:', newForm);
              return newForm;
            });
          } catch (jsonError) {
            console.warn('ProfileEdit - JSON 파싱 실패:', jsonError);
            console.log('ProfileEdit - 응답 텍스트:', await response.text());
          }
        } else {
          console.log('ProfileEdit - JSON이 아닌 응답입니다. 상태 코드:', response.status);
          const responseText = await response.text();
          console.log('ProfileEdit - 응답 텍스트:', responseText);
        }
      } else {
        console.error('ProfileEdit - 사용자 설정 조회 실패:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('ProfileEdit - 에러 응답:', errorText);
      }
    } catch (error) {
      console.error('ProfileEdit - 사용자 설정 조회 오류:', error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  // 컴포넌트 마운트 시 초기 데이터 로딩
  useEffect(() => {
    fetchInitialUserSettings();
  }, []);

  // API: 사용자 프로필 정보 업데이트
  const handleSaveProfile = async () => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      // 프론트엔드 레벨(A, B, C)을 백엔드 레벨(1, 2, 3)로 변환
      const levelMapping = { 'A': 1, 'B': 2, 'C': 3 };
      const difficultyLevel = levelMapping[editForm.level] || 2; // 기본값: 중급

      // 한글 키워드를 영어 enum으로 매핑
      const keywordToEnumMap = {
        '수업 듣기': 'CLASS_LISTENING',
        '학과 대화': 'DEPARTMENT_CONVERSATION',
        '과제 시험': 'ASSIGNMENT_EXAM',
        '회의 컨퍼런스': 'MEETING_CONFERENCE',
        '고객 서비스': 'CUSTOMER_SERVICE',
        '이메일 보고서': 'EMAIL_REPORT',
        '배낭여행': 'BACKPACKING',
        '가족여행': 'FAMILY_TRIP',
        '친구여행': 'FRIEND_TRIP',
        '쇼핑 식당': 'SHOPPING_DINING',
        '병원 방문': 'HOSPITAL_VISIT',
        '대중교통': 'PUBLIC_TRANSPORT'
      };

      // 프론트엔드 키워드를 CategoryRequestDto 형식으로 변환 (영어 enum 사용)
      const categoriesMap = {};
      editForm.keywords.forEach(keyword => {
        // 한글 키워드를 영어 enum으로 변환
        const enumKeyword = keywordToEnumMap[keyword];
        
        if (!enumKeyword) {
          console.warn(`키워드 매핑을 찾을 수 없습니다: ${keyword}`);
          return;
        }

        // 각 키워드가 어느 카테고리에 속하는지 찾기
        for (const [categoryKey, categoryKeywords] of Object.entries(KEYWORDS_BY_CATEGORY)) {
          if (categoryKeywords.includes(keyword)) {
            if (!categoriesMap[categoryKey]) {
              categoriesMap[categoryKey] = [];
            }
            // 영어 enum 값으로 저장
            categoriesMap[categoryKey].push(enumKeyword);
            break;
          }
        }
      });

      // 백엔드로 전송할 데이터 (CategoryRequestDto 형식)
      const categoryRequestData = {
        categories: categoriesMap
      };

      // 난이도와 카테고리를 별도로 전송
      const difficultyRequestData = {
        difficultyLevel: difficultyLevel
      };

      console.log('카테고리 업데이트 요청:', categoryRequestData);
      console.log('난이도 업데이트 요청:', difficultyRequestData);

      // 1. 난이도 설정 업데이트
      const difficultyResponse = await fetch('/user/settings/difficulty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(difficultyRequestData)
      });

      if (!difficultyResponse.ok) {
        throw new Error(`난이도 업데이트 실패: ${difficultyResponse.status}`);
      }

      // 2. 카테고리 설정 업데이트
      console.log('카테고리 업데이트 요청 URL:', '/user/settings/categories');
      console.log('카테고리 업데이트 요청 데이터:', JSON.stringify(categoryRequestData, null, 2));
      
      const categoryResponse = await fetch('/user/settings/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryRequestData)
      });

      console.log('카테고리 업데이트 응답 상태:', categoryResponse.status, categoryResponse.statusText);

      if (!categoryResponse.ok) {
        // 에러 응답 상세 정보 로깅
        let errorText = '';
        try {
          errorText = await categoryResponse.text();
          console.error('카테고리 업데이트 에러 응답:', errorText);
        } catch (e) {
          console.error('에러 응답 읽기 실패:', e);
        }
        throw new Error(`카테고리 업데이트 실패: ${categoryResponse.status} - ${errorText || categoryResponse.statusText}`);
      }

      const response = categoryResponse; // 마지막 응답을 사용

      if (response.ok) {
        // 응답이 성공적이지만 JSON이 아닐 수 있으므로 안전하게 처리
        let responseData = null;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          try {
            responseData = await response.json();
            console.log('프로필 업데이트 응답:', responseData);
          } catch (jsonError) {
            console.warn('JSON 파싱 실패, 빈 응답으로 처리:', jsonError);
          }
        } else {
          console.log('JSON이 아닌 응답입니다. 상태 코드:', response.status);
        }
        
        // AppContext의 user 상태 업데이트
        setUser(prevUser => ({
          ...prevUser,
          level: editForm.level,
          keywords: editForm.keywords
        }));

        // localStorage의 user 정보도 업데이트
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
          ...storedUser,
          level: editForm.level,
          keywords: editForm.keywords
        }));

        // alert('프로필이 성공적으로 업데이트되었습니다.');
        onSave(); // 부모 컴포넌트의 onSave 호출 (편집 모드 종료)
      } else {
        // 에러 응답 처리
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          }
        } catch (jsonError) {
          console.warn('에러 응답 JSON 파싱 실패:', jsonError);
        }
        
        console.error('프로필 업데이트 실패:', errorMessage);
        alert(`프로필 업데이트 실패: ${errorMessage}`);
      }
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      alert('프로필 업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로딩 중일 때 로딩 화면 표시
  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">프로필 정보를 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="!space-y-6">
      <div className="flex items-center !space-x-6">
        <Avatar className="w-20 h-20">
          <AvatarImage src={user?.profileImage} />
          <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
            {user?.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h3 className="w-50">{user?.name}</h3>
      </div>

      <div className="!space-y-4 max-w-md">
        {/* '실력 수준' 선택 */}
        <div className="!space-y-2">
          <Label htmlFor="level">실력 수준</Label>
          <Select
            value={editForm.level}
            onValueChange={(value) => setEditForm({ ...editForm, level: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Level A - 초급</SelectItem>
              <SelectItem value="B">Level B - 중급</SelectItem>
              <SelectItem value="C">Level C - 상급</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* '관심 키워드' 선택 */}
        <div className="!space-y-3">
          <Label>관심 키워드</Label>
          {editForm.keywords.length > 0 && (
            <div className="bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800 !mb-2">
                선택된 키워드 ({editForm.keywords.length}개)
              </p>
              <div className="flex flex-wrap gap-2">
                {editForm.keywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="default"
                    className="bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                    onClick={() => handleKeywordToggle(keyword)}
                  >
                    {keyword}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="!space-y-4">
            {Object.entries(KEYWORDS_BY_CATEGORY).map(([categoryKey, keywords]) => (
              <div key={categoryKey}>
                <h4 className="text-sm font-medium text-gray-700 !mb-2">
                  {STUDY_TYPES.find(type => type.id === categoryKey)?.title}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant={editForm.keywords.includes(keyword) ? "default" : "outline"}
                      className={`cursor-pointer text-xs ${editForm.keywords.includes(keyword)
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-100'
                        }`}
                      onClick={() => handleKeywordToggle(keyword)}
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleSaveProfile} 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? '저장 중...' : '저장'}
        </Button>
      </div>
    </div>
  );
}