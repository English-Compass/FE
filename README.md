# 1. 클론
git clone https://github.com/English-Compass/FE.git

# 2. 디렉토리 이동
cd FE

# 3. 패키지 설치
npm install

# 4. 개발 서버 실행
npm run dev

# 📘 영어 학습 웹 애플리케이션

React + Vite 기반의 AI 영어 학습 웹앱입니다.  
학습 목적, 실력에 따른 맞춤 커리큘럼과 실시간 피드백, OTT 기반 콘텐츠 추천을 제공합니다.

## 🚀 주요 기능

- 카카오 로그인 및 사용자 정보 입력
- 학습 목적 및 난이도 설정 (CEFR 기준)
- AI 기반 단어/문장 학습, 퀴즈 제공
- 학습 피드백 및 틀린 문제 리뷰
- 관심사 기반 미디어 추천 (OTT 연동)
- 마이페이지에서 학습 통계 및 진도 확인

## 🧩 주요 화면

- **랜딩 페이지**: 로그인 진입 (카카오)
- **추가 정보 입력**: 학습 목적 및 레벨 선택
- **대시보드**: 홈, 미디어, 학습, 리뷰, 마이페이지
- **하단 바**: 홈 / 미디어 / 학습 / 리뷰 / 마이페이지
- **상단 바**: 사용자 이름, 마이페이지, 로그아웃

## 📁 프로젝트 구조

```
src/
├── App.jsx
├── main.jsx
├── assets/              # 정적 에셋 (이미지, svg 등)
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── add-info/        # 추가 정보 입력 관련 컴포넌트
│   ├── conversation/    # 회화 연습 관련 컴포넌트
│   ├── home/            # 홈 화면 관련 컴포넌트
│   ├── landing/         # 랜딩 페이지 관련 컴포넌트
│   ├── media/           # 미디어 추천 관련 컴포넌트
│   ├── mypage/          # 마이페이지 관련 컴포넌트
│   ├── question-types/  # 문제 유형별 컴포넌트
│   ├── review/          # 복습 관련 컴포넌트
│   ├── study/           # 학습 세션 관련 컴포넌트
│   └── ui/              # 기본 UI 요소 (버튼, 카드 등)
├── context/             # 전역 상태 관리 (AppContext)
├── layouts/             # 페이지 레이아웃 컴포넌트
├── pages/               # 라우팅되는 페이지 컴포넌트
│   ├── dashboard/       # 대시보드 관련 페이지
│   └── landing/         # 랜딩 및 로그인 관련 페이지
├── routes/              # 라우팅 설정
├── services/            # API 연동 서비스 (현재 비어있음)
└── styles/              # SCSS 스타일시트
```

## 🔌 API 연동 필요 파일

아래 파일들은 서버와의 API 연동이 필요한 주요 컴포넌트입니다. 각 파일에는 필요한 API 호출에 대한 설명이 주석으로 추가되어 있습니다.

-   `src/components/add-info/KeywordSelection.jsx`: 키워드 목록 조회
-   `src/components/conversation/ConversationPractice.jsx`: 대화 세션 시작/종료, 음성 메시지 전송
-   `src/components/conversation/CustomSituation.jsx`: 커스텀 상황 전송
-   `src/components/conversation/ScenarioSelection.jsx`: 시나리오 목록 조회
-   `src/components/home/HistoryChart.jsx`: 학습 기록 조회
-   `src/components/home/TodayWordsCard.jsx`: 오늘의 단어 조회
-   `src/components/home/WrongAnswerCard.jsx`: 오답 목록 조회
-   `src/components/media/MediaGrid.jsx`: 미디어 콘텐츠 조회
-   `src/components/mypage/CalendarTab.jsx`: 월별 학습 기록 조회
-   `src/components/mypage/ProfileView.jsx`: 사용자 프로필 조회
-   `src/components/mypage/ProfileEdit.jsx`: 사용자 프로필 수정
-   `src/components/mypage/StatsBoard.jsx`: 학습 통계 조회
-   `src/components/review/ReviewList.jsx`: 복습 문제 목록 조회
-   `src/components/review/ReviewQuiz.jsx`: 퀴즈 결과 전송
-   `src/components/study/StudySession.jsx`: 학습 문제 조회 및 결과 전송
-   `src/components/study/StudyCompleteSummary.jsx`: 추천 미디어 조회
-   `src/context/AppContext.jsx`: 전역 사용자 데이터 및 통계 조회
-   `src/pages/dashboard/ConversationPage.jsx`: 회화 시나리오 목록 조회
-   `src/pages/dashboard/HomePage.jsx`: 대시보드 데이터 조회
-   `src/pages/dashboard/MediaPage.jsx`: 미디어 콘텐츠 조회 및 시청 기록 전송
-   `src/pages/dashboard/ReviewPage.jsx`: 복습 문제 조회 및 정답 처리
-   `src/pages/dashboard/WordbookPage.jsx`: 추천 단어장 조회
-   `src/pages/landing/AddInfoPage.jsx`: 사용자 추가 정보 전송
-   `src/pages/landing/KaKaoCallback.jsx`: 카카오 로그인 콜백 처리
