// 로그인이 안된 사용자라면, 이걸 포함하는 라우트에서
// 사용자 정보를 확인하고, 사용자정보가 없다면 /login으로 보내는 컴포넌트

// auth: Firebase Authentication 인스턴스
// 현재 로그인한 사용자 정보를 확인하기 위해 필요
import { auth } from "../firebase.ts";

// Navigate: React Router의 페이지 리다이렉트 컴포넌트
// 렌더링되면 자동으로 지정된 경로로 이동
// useNavigate와 달리 JSX로 직접 사용 가능
import { Navigate } from "react-router";

// ReactNode: React 요소의 타입
// JSX, 문자열, 숫자, 배열, Fragment 등 React가 렌더링할 수 있는 모든 것
import type { ReactNode } from "react";

// Props: ProtectedRoute 컴포넌트가 받을 props의 타입 정의
type Props = {
    // children: 이 컴포넌트로 감싸진 자식 컴포넌트들
    // ReactNode 타입: 모든 종류의 React 요소를 받을 수 있음
    // 예: <ProtectedRoute><Layout /></ProtectedRoute>에서 <Layout />이 children
    children: ReactNode;
};

// ProtectedRoute: 인증이 필요한 페이지를 보호하는 컴포넌트
// 로그인하지 않은 사용자가 접근하면 로그인 페이지로 리다이렉트
// { children }: Props - 구조 분해 할당으로 props에서 children만 추출
function ProtectedRoute({ children }: Props) {
    // user: 현재 로그인한 사용자 정보
    // auth.currentUser: Firebase가 관리하는 현재 사용자 객체
    // 로그인 상태면 User 객체, 로그아웃 상태면 null 반환
    const user = auth.currentUser;

    // 사용자가 로그인하지 않았는지 확인 (user === null)
    if (user === null) {
        // Navigate 컴포넌트를 반환하여 로그인 페이지로 리다이렉트
        // to="/login": 이동할 경로
        // Navigate가 렌더링되면 즉시 /login 페이지로 이동
        // 이후 children은 렌더링되지 않음
        // 이렇게 하면 로그인하지 않은 사용자는 보호된 페이지에 접근할 수 없음
        return <Navigate to={"/login"} />;
    }

    // user가 null이 아니면 (로그인되어 있으면)
    // children(자식 컴포넌트들)을 그대로 렌더링
    // 예: router.tsx에서 <ProtectedRoute><Layout /></ProtectedRoute>
    // → Layout 컴포넌트가 정상적으로 렌더링됨
    return children;
}

// ProtectedRoute 컴포넌트를 다른 파일에서 import할 수 있도록 내보냄
// router.tsx에서 이 컴포넌트를 사용하여 보호된 라우트를 만듦
export default ProtectedRoute;
