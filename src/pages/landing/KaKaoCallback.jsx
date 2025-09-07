import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

// JWT 토큰에서 사용자 정보를 추출하는 함수
const decodeJWT = (token) => {
    try {
        // JWT 토큰은 base64로 인코딩된 3부분으로 구성: header.payload.signature
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT token format');
        }
        
        // payload 부분을 디코딩
        const payload = parts[1];
        // base64 padding 추가 (필요한 경우)
        const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
        const decodedPayload = atob(paddedPayload);
        
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error('JWT 디코딩 실패:', error);
        return null;
    }
};

// 백엔드에서 전달받은 userId를 통해 새로운/기존 사용자 판별
const determineUserType = (userId) => {
    console.log('=== 사용자 타입 판별 ===');
    console.log('받은 userId:', userId, 'type:', typeof userId);
    
    // userId가 null이거나 'null' 문자열이면 새로운 사용자
    if (userId === 'null' || userId === null || userId === undefined) {
        console.log('✅ 새로운 사용자로 판별됨 (userId가 null)');
        return 'new';
    }
    
    // userId가 존재하면 기존 사용자
    console.log('✅ 기존 사용자로 판별됨 (userId:', userId, ')');
    return 'existing';
};

export default function KakaoCallback() {
    const navigate = useNavigate();
    const { setUser } = useApp();

    useEffect(() => {
        // 더 자세한 디버깅을 위한 로그
        console.log('=== KaKaoCallback 컴포넌트 마운트 ===');
        console.log('현재 URL:', window.location.href);
        console.log('현재 경로:', window.location.pathname);
        console.log('쿼리 스트링:', window.location.search);
        
        // KaKaoCallback이 처리해야 하는 경로들
        const validPaths = ['/', '/kakao-callback', '/login/oauth2/code/kakao', '/login/success'];
        const currentPath = window.location.pathname;
        
        if (!validPaths.includes(currentPath)) {
            console.log('❌ KaKaoCallback이 처리하지 않는 경로입니다:', currentPath);
            return;
        }
        
        // URL에서 쿼리 파라미터 추출
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userId = urlParams.get('userId');
        const username = urlParams.get('username');
        const profileImage = urlParams.get('profileImage');
        const error = urlParams.get('error');
        
        // 모든 파라미터 값 출력
        console.log('추출된 파라미터들:');
        console.log('- token:', token);
        console.log('- userId:', userId, 'type:', typeof userId);
        console.log('- username:', username, 'type:', typeof username);
        console.log('- profileImage:', profileImage, 'type:', typeof profileImage);
        console.log('- error:', error);
        
        // URL 디코딩 확인
        console.log('URL 디코딩된 username:', decodeURIComponent(username || ''));
        console.log('URL 디코딩된 profileImage:', decodeURIComponent(profileImage || ''));
        
        // 파라미터 존재 여부 체크
        const hasToken = token && token !== 'null' && token !== '';
        // userId가 null이어도 새로운 사용자일 수 있으므로 허용
        const hasValidUserId = userId !== undefined && userId !== '';
        const hasUsername = username && username !== 'null' && username !== '';
        
        console.log('파라미터 존재 여부:');
        console.log('- hasToken:', hasToken);
        console.log('- hasValidUserId:', hasValidUserId, '(userId:', userId, ')');
        console.log('- hasUsername:', hasUsername);
        
        if (hasToken && hasValidUserId && hasUsername) {
            console.log('✅ 모든 필수 파라미터가 존재합니다. 로그인 성공 처리 시작');
            // JWT 토큰과 사용자 정보를 저장 (async 함수 호출)
            handleKakaoLoginSuccess(token, userId, username, profileImage).catch(error => {
                console.error('로그인 처리 중 오류:', error);
                alert('로그인 처리 중 오류가 발생했습니다.');
                navigate('/landing');
            });
        } else if (error) {
            console.log('❌ 에러 파라미터 발견:', error);
            // 로그인 실패
            alert(`로그인에 실패했습니다: ${error}`);
            navigate('/landing');
        } else {
            console.log('❌ 필수 파라미터가 부족합니다');
            
            // 쿼리 파라미터가 전혀 없는 경우 (일반적인 홈 접근)
            if (!window.location.search) {
                console.log('쿼리 파라미터가 없습니다. 홈으로 리다이렉트');
                navigate('/dashboard/home');
                return;
            }
            
            // 필수 정보가 없는 경우 - 디버깅 정보 포함
            alert(`로그인 처리 중 오류가 발생했습니다.\n토큰: ${token || '없음'}\n사용자ID: ${userId || '없음'}\n사용자명: ${username || '없음'}\n\n전체 URL: ${window.location.href}`);
            navigate('/landing');
        }
    }, [navigate]);

    const handleKakaoLoginSuccess = async (token, userId, username, profileImage) => {
        try {
            // JWT 토큰을 localStorage에 저장
            console.log('KaKaoCallback - 토큰 저장 중:');
            console.log('- token:', token);
            console.log('- token type:', typeof token);
            console.log('- token length:', token ? token.length : 0);
            
            // 토큰 저장을 더 안전하게 처리 (localStorage + sessionStorage 이중 저장)
            try {
                // localStorage에 저장
                localStorage.setItem('token', token);
                // sessionStorage에도 백업 저장
                sessionStorage.setItem('token', token);
                
                // 저장 후 즉시 확인
                const savedToken = localStorage.getItem('token');
                const sessionToken = sessionStorage.getItem('token');
                console.log('KaKaoCallback - localStorage 토큰 확인:', savedToken);
                console.log('KaKaoCallback - sessionStorage 토큰 확인:', sessionToken);
                
                if (savedToken !== token) {
                    console.error('localStorage 토큰 저장이 제대로 되지 않았습니다!');
                    // sessionStorage에서 복구 시도
                    if (sessionToken === token) {
                        console.log('sessionStorage에서 토큰 복구 성공');
                    } else {
                        throw new Error('토큰 저장 실패');
                    }
                }
                
                // 추가 검증: 잠시 후 다시 확인
                setTimeout(() => {
                    const delayedToken = localStorage.getItem('token');
                    const delayedSessionToken = sessionStorage.getItem('token');
                    console.log('KaKaoCallback - 지연된 localStorage 토큰 확인:', delayedToken);
                    console.log('KaKaoCallback - 지연된 sessionStorage 토큰 확인:', delayedSessionToken);
                    
                    if (delayedToken !== token && delayedSessionToken !== token) {
                        console.error('모든 저장소에서 토큰이 사라졌습니다!');
                    }
                }, 100);
                
            } catch (storageError) {
                console.error('토큰 저장 오류:', storageError);
                throw new Error('토큰 저장 중 오류가 발생했습니다.');
            }
            
            // URL 디코딩된 사용자 정보
            const decodedUsername = decodeURIComponent(username || '');
            const decodedProfileImage = decodeURIComponent(profileImage || '');
            
            console.log('디코딩된 사용자 정보:');
            console.log('- decodedUsername:', decodedUsername);
            console.log('- decodedProfileImage:', decodedProfileImage);
            
            // 사용자 정보를 localStorage에 저장
            localStorage.setItem('user', JSON.stringify({
                userId: userId === 'null' ? null : userId, // null 문자열을 실제 null로 변환
                username: decodedUsername, 
                profileImage: decodedProfileImage
            }));
            
            // AppContext의 사용자 정보 직접 업데이트
            const userData = {
                id: userId === 'null' ? null : userId, // null 문자열을 실제 null로 변환
                name: decodedUsername,
                profileImage: decodedProfileImage,
                level: 'B',
                joinDate: '2024-01-15',
                streak: 7
            };
            
            console.log('AppContext에 저장할 사용자 데이터:', userData);
            setUser(userData);
            
            // AppContext 업데이트 완료
            console.log('KaKaoCallback - setUser 호출 완료');
            
            // 백엔드에서 전달받은 userId로 사용자 타입 판별
            const userType = determineUserType(userId);
            
            if (userType === 'new') {
                console.log('🆕 새로운 사용자 - add-info 페이지로 이동');
                
                // 네비게이션 전 토큰 상태 재확인
                const tokenBeforeNav = localStorage.getItem('token');
                console.log('네비게이션 전 토큰 확인:', tokenBeforeNav);
                
                if (!tokenBeforeNav) {
                    console.error('네비게이션 전 토큰이 사라졌습니다!');
                    alert('로그인 상태가 유지되지 않았습니다. 다시 로그인해주세요.');
                    navigate('/landing');
                    return;
                }
                
                navigate('/add-info');
            } else {
                console.log('👤 기존 사용자 - 대시보드로 이동');
                
                // 기존 사용자도 토큰과 사용자 정보를 저장
                console.log('기존 사용자 정보 저장 중...');
                
                // 네비게이션 전 토큰 상태 재확인
                const tokenBeforeNav = localStorage.getItem('token');
                console.log('기존 사용자 - 네비게이션 전 토큰 확인:', tokenBeforeNav);
                
                if (!tokenBeforeNav) {
                    console.error('기존 사용자 - 네비게이션 전 토큰이 사라졌습니다!');
                    alert('로그인 상태가 유지되지 않았습니다. 다시 로그인해주세요.');
                    navigate('/landing');
                    return;
                }
                
                navigate('/dashboard/home');
            } 
        } catch (error) {
            console.error('Token save error:', error);
            alert('토큰 저장 중 오류가 발생했습니다.');
            navigate('/landing');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">로그인 처리 중...</p>
            </div>
        </div>
    );
}