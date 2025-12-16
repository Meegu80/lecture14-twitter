// createBrowserRouter: React Router v6에서 라우터를 생성하는 함수
// 브라우저의 History API를 사용하여 URL 기반 라우팅을 구현
// 배열 형태로 라우트 설정을 받아서 라우터 객체를 반환
import { createBrowserRouter } from "react-router";

// Layout: 공통 레이아웃 컴포넌트 (헤더, 사이드바 등 페이지 공통 요소)
// 여러 페이지에서 공통으로 사용되는 UI 구조를 담당
import Layout from "../layouts/Layout.tsx";

// Home: 홈(메인) 페이지 컴포넌트
// 경로: "/" - 앱의 첫 화면
import Home from "../pages/Home.tsx";

// Profile: 프로필 페이지 컴포넌트
// 경로: "/profile" - 사용자 프로필을 보여주는 페이지
import Profile from "../pages/Profile.tsx";

// Login: 로그인 페이지 컴포넌트
// 경로: "/login" - 사용자가 로그인하는 페이지
import Login from "../pages/Login.tsx";

// CreateAccount: 회원가입 페이지 컴포넌트
// 경로: "/createAccount" - 새 계정을 만드는 페이지
import CreateAccount from "../pages/CreateAccount.tsx";

// ProtectedRoute: 인증이 필요한 페이지를 보호하는 컴포넌트
// 로그인하지 않은 사용자가 접근하면 로그인 페이지로 리다이렉트
import ProtectedRoute from "./ProtectedRoute.tsx";

// router: 애플리케이션의 전체 라우팅 설정 객체
// createBrowserRouter에 라우트 배열을 전달하여 생성
const router = createBrowserRouter([
    // 첫 번째 라우트 그룹: 인증이 필요한 페이지들 (ProtectedRoute로 감싸짐)
    {
        // path: URL 경로 (최상위 경로 "/")
        path: "/",

        // element: 이 경로에서 렌더링할 컴포넌트
        // ProtectedRoute로 Layout을 감싸서 로그인 검증 후 접근 가능하게 함
        element: (
            // ProtectedRoute: 로그인 여부를 확인하는 보호 컴포넌트
            // 로그인 안 했으면 → /login으로 리다이렉트
            // 로그인 했으면 → 자식 컴포넌트(Layout) 렌더링
            <ProtectedRoute>
                {/* Layout: 공통 레이아웃 (네비게이션 바, 사이드바 등) */}
                {/* Layout 내부에서 Outlet을 통해 children이 렌더링됨 */}
                <Layout />
            </ProtectedRoute>
        ),

        // children: 중첩 라우트 (부모 라우트 내부에서 렌더링될 자식 라우트들)
        // Layout 컴포넌트의 <Outlet /> 위치에 이 자식 컴포넌트들이 렌더링됨
        children: [
            // 홈 페이지 라우트
            {
                // path: "" → 부모 경로("/")와 동일
                // 실제 경로: "/" (부모 path + 자식 path)
                path: "",
                // element: 이 경로에서 보여줄 컴포넌트 (Home 페이지)
                element: <Home />,
            }, // 경로 : /

            // 프로필 페이지 라우트
            {
                // path: "profile" → 부모 경로에 이어붙여짐
                // 실제 경로: "/profile" (부모 "/" + 자식 "profile")
                path: "profile",
                // element: 이 경로에서 보여줄 컴포넌트 (Profile 페이지)
                element: <Profile />,
            }, // 경로 : /profile
        ],
    },

    // 두 번째 라우트: 로그인 페이지 (인증 불필요, ProtectedRoute 없음)
    {
        // path: "/login" - 로그인 페이지 경로
        path: "/login",
        // element: Login 컴포넌트를 직접 렌더링
        // ProtectedRoute로 감싸지 않아서 로그인 없이도 접근 가능
        element: <Login />,
    },

    // 세 번째 라우트: 회원가입 페이지 (인증 불필요, ProtectedRoute 없음)
    {
        // path: "/createAccount" - 회원가입 페이지 경로
        path: "/createAccount",
        // element: CreateAccount 컴포넌트를 직접 렌더링
        // ProtectedRoute로 감싸지 않아서 로그인 없이도 접근 가능
        element: <CreateAccount />,
    },
]);

// router 객체를 다른 파일에서 사용할 수 있도록 내보냄
// App.tsx에서 <RouterProvider router={router} />로 사용됨
export default router;
