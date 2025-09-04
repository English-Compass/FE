import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "../layouts/Layout.jsx";

// dashboard
import HomePage from "../pages/dashboard/HomePage";
import MediaPage from "../pages/dashboard/MediaPage";
import StudyPage from "../pages/dashboard/StudyPage";
import ReviewPage from "../pages/dashboard/ReviewPage";
import MyPage from "../pages/dashboard/MyPage";
import ConversationPage from "../pages/dashboard/ConversationPage";
import WordbookPage from "../pages/dashboard/WordbookPage";

// auth
import LandingPage from "../pages/landing/LandingPage";
import KakaoCallback from "../pages/landing/KaKaoCallback";
import AddInfoPage from "../pages/landing/AddInfoPage";

const AllRoutes = () => {
    return (
        <Routes>
            <Route path="/landing" element={<LandingPage />} /> 
            <Route path="/add-info" element={<AddInfoPage />} />
            <Route path="/kakao-callback" element={<KakaoCallback />} />
            <Route path="/login/oauth2/code/kakao" element={<KakaoCallback />} />
            <Route path="/login/success" element={<KakaoCallback />} />
            <Route element={<Layout />}>
                {/* 기본 경로 - 쿼리 파라미터가 있으면 KaKaoCallback, 없으면 홈으로 리다이렉트 */}
                <Route path="/" element={<KakaoCallback />} />
                
                {/* dashboard routes */}
                <Route path="/dashboard/home" element={<HomePage />} />
                <Route path="/dashboard/media" element={<MediaPage />} />
                <Route path="/dashboard/study" element={<StudyPage />} />
                <Route path="/dashboard/review" element={<ReviewPage />} />
                <Route path="/dashboard/my" element={<MyPage />} />
                <Route path="/dashboard/conversation" element={<ConversationPage />} />
                <Route path="/dashboard/wordbook" element={<WordbookPage />} />
            </Route>
        </Routes>
    );
}

export default AllRoutes;