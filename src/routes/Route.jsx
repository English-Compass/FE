import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

import Layout from "../layouts/Layout.jsx";

// dashboard
import HomePage from "../pages/dashboard/HomePage";
import MediaPage from "../pages/dashboard/MediaPage";
import StudyPage from "../pages/dashboard/StudyPage";
import ReviewPage from "../pages/dashboard/ReviewPage";
import MyPage from "../pages/dashboard/MyPage";
// import ConversationPage from "../pages/dashboard/ConversationPage";

// auth
// import LandingPage from "../pages/landing/LandingPage";
// import LoginPage from "../pages/landing/LoginPage";
import AddInfoPage from "../pages/landing/AddInfoPage";


const AllRoutes = () => {
    const { user } = useApp();
    
    return (
        <Routes>
            {/* <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} /> */}
            <Route path="/add-info" element={<AddInfoPage />} />
            <Route element={<Layout />}>
                {/* 기본 경로를 홈으로 리다이렉트 */}
                <Route path="/" element={<Navigate to="/dashboard/home" replace />} />
                
                {/* dashboard routes */}
                <Route path="/dashboard/home" element={<HomePage />} />
                <Route path="/dashboard/media" element={<MediaPage />} />
                <Route path="/dashboard/study" element={<StudyPage />} />
                <Route path="/dashboard/review" element={<ReviewPage />} />
                <Route path="/dashboard/my" element={<MyPage />} />
                {/* <Route path="/dashboard/conversation" element={<ConversationPage />} /> */}
            </Route>
        </Routes>
    );
}

export default AllRoutes;