import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function KakaoCallback() {
    const navigate = useNavigate();
    const { updateUserFromStorage } = useApp();

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
        console.log('- userId:', userId);
        console.log('- username:', username);
        console.log('- profileImage:', profileImage);
        console.log('- error:', error);
        
        // 파라미터 존재 여부 체크
        const hasToken = token && token !== 'null' && token !== '';
        const hasUserId = userId && userId !== 'null' && userId !== '';
        const hasUsername = username && username !== 'null' && username !== '';
        
        console.log('파라미터 존재 여부:');
        console.log('- hasToken:', hasToken);
        console.log('- hasUserId:', hasUserId);
        console.log('- hasUsername:', hasUsername);
        
        if (hasToken && hasUserId && hasUsername) {
            console.log('✅ 모든 필수 파라미터가 존재합니다. 로그인 성공 처리 시작');
            // JWT 토큰과 사용자 정보를 저장
            handleKakaoLoginSuccess(token, userId, username, profileImage);
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

    const handleKakaoLoginSuccess = (token, userId, username, profileImage) => {
        try {
            // JWT 토큰을 localStorage에 저장
            localStorage.setItem('token', token);
            
            // 사용자 정보를 localStorage에 저장
            localStorage.setItem('user', JSON.stringify({
                userId, 
                username, 
                profileImage
            }));
            
            // AppContext의 사용자 정보 업데이트
            updateUserFromStorage();
            
            // 로그인 성공 후 대시보드 홈 페이지로 이동
            navigate('/add-info'); 
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