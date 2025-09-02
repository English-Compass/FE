import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function KakaoCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        // URL에서 인증 코드 추출
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
            // 백엔드에 인증 코드 전송하여 토큰 받기
            handleKakaoLogin(code);
        } else {
            // 로그인 실패
            alert('로그인에 실패했습니다.');
            navigate('/landing');
        }
    }, [navigate]);

    const handleKakaoLogin = async (code) => {
        try {
            // API: 백엔드에 인가 코드를 전송하여 카카오 로그인을 처리하고 JWT 토큰을 발급받습니다.
            const response = await fetch('/api/auth/kakao', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code })
            });

            const data = await response.json();
            
            if (response.ok) {
                // 토큰 저장
                localStorage.setItem('accessToken', data.accessToken);
                
                // 로그인 성공 후 대시보드 홈 페이지로 이동
                navigate('/add-info'); 
            } else {
                alert('로그인 처리 중 오류가 발생했습니다.');
                navigate('/landing');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('로그인 처리 중 오류가 발생했습니다.');
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