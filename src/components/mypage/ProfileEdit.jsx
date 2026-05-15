import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Label } from '../ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
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
      console.log('ProfileEdit - 백엔드에서 사용자 설정 조회 시작');
      console.log('ProfileEdit - HttpOnly 쿠키(access_token) 자동 전송 (credentials: include)');
      
      // HttpOnly 쿠키(access_token)가 있으면 자동으로 전송됨
      // Gateway가 쿠키에서 토큰을 추출하여 검증하므로 Authorization 헤더 불필요
      const response = await fetch('/api/user/settings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // 쿠키 전달 필수! (HttpOnly 쿠키 포함)
      });

      console.log('ProfileEdit - API 응답 상태:', response.status, response.statusText);
      console.log('ProfileEdit - 응답 헤더:', Object.fromEntries(response.headers.entries()));

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
          }
        } else {
          console.log('ProfileEdit - JSON이 아닌 응답입니다. 상태 코드:', response.status);
        }
      } else {
        // 에러 응답 처리 (응답 body는 한 번만 읽을 수 있음)
        let errorText = '';
        try {
          errorText = await response.text();
          console.error('ProfileEdit - API 에러 응답:', errorText);
        } catch (textError) {
          console.error('ProfileEdit - 에러 응답 읽기 실패:', textError);
        }
        console.error('ProfileEdit - 사용자 설정 조회 실패:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('ProfileEdit - 사용자 설정 조회 오류:', error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  // 컴포넌트 마운트 시 초기 데이터 로딩
  // ProfileTab에서 이미 데이터를 가져오므로 중복 호출 방지
  // editForm prop이 비어있을 때만 API 호출
  useEffect(() => {
    // editForm에 데이터가 없거나 keywords가 비어있을 때만 API 호출
    if (!editForm.keywords || editForm.keywords.length === 0) {
      fetchInitialUserSettings();
    } else {
      // 이미 데이터가 있으면 로딩 상태만 해제
      setIsInitialLoading(false);
    }
  }, []);

  // API: 사용자 프로필 정보 업데이트
  const handleSaveProfile = async () => {
    setIsLoading(true);
    
    try {
      // HttpOnly 쿠키(access_token)가 있으면 자동으로 전송됨
      // Gateway가 쿠키에서 토큰을 추출하여 검증하므로 Authorization 헤더 불필요

      // 프론트엔드 레벨(A, B, C)을 백엔드 레벨(1, 2, 3)로 변환
      const levelMapping = { 'A': 1, 'B': 2, 'C': 3 };
      const difficultyLevel = levelMapping[editForm.level] || 2; // 기본값: 중급

      // 한글 키워드를 영어 enum으로 매핑
      const keywordToEnumMap = {
        '수업 참여': 'CLASS_LISTENING',
        '학과 대화': 'DEPARTMENT_CONVERSATION',
        '과제 시험': 'ASSIGNMENT_EXAM',
        '회의': 'MEETING_CONFERENCE',
        '고객 서비스': 'CUSTOMER_SERVICE',
        '이메일 보고서': 'EMAIL_REPORT',
        '배낭여행': 'BACKPACKING',
        '가족여행': 'FAMILY_TRIP',
        '친구와 여행': 'FRIEND_TRIP',
        '쇼핑 외식': 'SHOPPING_DINING',
        '병원 이용': 'HOSPITAL_VISIT',
        '대중교통 이용': 'PUBLIC_TRANSPORT'
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
      console.log('🔵 [ProfileEdit] POST 요청 시작 - /api/user/settings/difficulty');
      console.log('🔵 [ProfileEdit] 요청 URL:', '/api/user/settings/difficulty');
      console.log('🔵 [ProfileEdit] 요청 메서드: POST');
      console.log('🔵 [ProfileEdit] 요청 데이터:', JSON.stringify(difficultyRequestData, null, 2));
      console.log('🔵 [ProfileEdit] 요청 헤더:', {
        'Content-Type': 'application/json',
        'credentials': 'include (쿠키 자동 전송)'
      });
      console.log('🔵 [ProfileEdit] 쿠키 확인:', document.cookie || '쿠키 없음 (HttpOnly 쿠키는 JavaScript에서 읽을 수 없음)');
      
      let difficultyResponse;
      try {
        difficultyResponse = await fetch('/api/user/settings/difficulty', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include', // 쿠키 전달 필수! (HttpOnly 쿠키 포함)
          body: JSON.stringify(difficultyRequestData)
        });
        
        console.log('🔵 [ProfileEdit] POST 응답 상태:', difficultyResponse.status, difficultyResponse.statusText);
        console.log('🔵 [ProfileEdit] POST 응답 헤더:', Object.fromEntries(difficultyResponse.headers.entries()));
        
        // 응답 본문 확인 (에러인 경우)
        if (!difficultyResponse.ok) {
          const errorText = await difficultyResponse.text();
          console.error('🔵 [ProfileEdit] POST 에러 응답 본문:', errorText);
          
          // 500 에러인 경우 상세 정보
          if (difficultyResponse.status === 500) {
            console.error('🚨 [ProfileEdit] 500 Internal Server Error 발생!');
            console.error('🚨 [ProfileEdit] 가능한 원인:');
            console.error('   1. 게이트웨이에서 X-User-Id 헤더가 주입되지 않음 (쿠키 없음 또는 필터 실패)');
            console.error('   2. 백엔드 컨트롤러에서 @RequestHeader("X-User-Id")가 null');
            console.error('   3. DTO 변환 실패 (필드명 불일치)');
            console.error('   4. 서비스 로직에서 NullPointerException');
            console.error('   5. CSRF 토큰 검증 실패');
            console.error('🚨 [ProfileEdit] 백엔드 로그를 확인하세요!');
          }
          
          throw new Error(`난이도 업데이트 실패: ${difficultyResponse.status} - ${errorText}`);
        }
        
        // 성공 응답 본문 확인
        const responseText = await difficultyResponse.text();
        console.log('🔵 [ProfileEdit] POST 성공 응답 본문:', responseText || '(빈 응답)');
        
        // JSON 응답인 경우 파싱
        if (responseText) {
          try {
            const responseJson = JSON.parse(responseText);
            console.log('🔵 [ProfileEdit] POST 성공 응답 (JSON):', responseJson);
          } catch (e) {
            // JSON이 아니면 그냥 텍스트로 처리
          }
        }
      } catch (fetchError) {
        console.error('🚨 [ProfileEdit] fetch 요청 자체가 실패:', fetchError);
        console.error('🚨 [ProfileEdit] 네트워크 오류 또는 CORS 문제일 수 있습니다.');
        throw fetchError;
      }

      // 2. 카테고리 설정 업데이트 (PUT 방식으로 전체 교체)
      console.log('🟢 [ProfileEdit] PUT 요청 시작 - /api/user/settings/categories');
      console.log('🟢 [ProfileEdit] 요청 URL:', '/api/user/settings/categories');
      console.log('🟢 [ProfileEdit] 요청 메서드: PUT');
      console.log('🟢 [ProfileEdit] 요청 데이터:', JSON.stringify(categoryRequestData, null, 2));
      console.log('🟢 [ProfileEdit] 요청 헤더:', {
        'Content-Type': 'application/json',
        'credentials': 'include (쿠키 자동 전송)'
      });
      
      let categoryResponse;
      try {
        // PUT 방식으로 전체 카테고리를 교체 (기존 데이터 삭제 후 새로 추가)
        categoryResponse = await fetch('/api/user/settings/categories', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include', // 쿠키 전달 필수! (HttpOnly 쿠키 포함)
          body: JSON.stringify(categoryRequestData)
        });
        
        console.log('🟢 [ProfileEdit] PUT 응답 상태:', categoryResponse.status, categoryResponse.statusText);
        console.log('🟢 [ProfileEdit] PUT 응답 헤더:', Object.fromEntries(categoryResponse.headers.entries()));
        
        // 응답 본문 확인 (에러인 경우)
        if (!categoryResponse.ok) {
          const errorText = await categoryResponse.text();
          console.error('🟢 [ProfileEdit] PUT 에러 응답 본문:', errorText);
          
          // 500 에러인 경우 상세 정보
          if (categoryResponse.status === 500) {
            console.error('🚨 [ProfileEdit] 500 Internal Server Error 발생!');
            console.error('🚨 [ProfileEdit] 가능한 원인:');
            console.error('   1. 게이트웨이에서 X-User-Id 헤더가 주입되지 않음 (쿠키 없음 또는 필터 실패)');
            console.error('   2. 백엔드 컨트롤러에서 @RequestHeader("X-User-Id")가 null');
            console.error('   3. DTO 변환 실패 (필드명 불일치, categories 구조 불일치)');
            console.error('   4. 서비스 로직에서 NullPointerException');
            console.error('   5. 데이터베이스 제약 조건 위반 (UNIQUE, NOT NULL 등)');
            console.error('   6. CSRF 토큰 검증 실패');
            console.error('🚨 [ProfileEdit] 백엔드 로그를 확인하세요!');
          }
          
          throw new Error(`카테고리 업데이트 실패: ${categoryResponse.status} - ${errorText}`);
        }
        
        // 성공 응답 본문 확인
        const responseText = await categoryResponse.text();
        console.log('🟢 [ProfileEdit] PUT 성공 응답 본문:', responseText || '(빈 응답)');
        
        // JSON 응답인 경우 파싱
        if (responseText) {
          try {
            const responseJson = JSON.parse(responseText);
            console.log('🟢 [ProfileEdit] PUT 성공 응답 (JSON):', responseJson);
          } catch (e) {
            // JSON이 아니면 그냥 텍스트로 처리
          }
        }
      } catch (fetchError) {
        console.error('🚨 [ProfileEdit] fetch 요청 자체가 실패:', fetchError);
        console.error('🚨 [ProfileEdit] 네트워크 오류 또는 CORS 문제일 수 있습니다.');
        throw fetchError;
      }

      // 모든 요청이 성공적으로 완료됨
      console.log('✅ [ProfileEdit] 프로필 업데이트 완료');
      
      // AppContext의 user 상태 업데이트
      setUser(prevUser => ({
        ...prevUser,
        level: editForm.level,
        keywords: editForm.keywords
      }));

      // alert('프로필이 성공적으로 업데이트되었습니다.');
      onSave(); // 부모 컴포넌트의 onSave 호출 (편집 모드 종료)
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