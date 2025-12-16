// React Router 관련 import
// Link: 페이지 이동을 위한 컴포넌트 (새로고침 없이 SPA 방식 이동)
// Outlet: 중첩 라우트의 자식 컴포넌트를 렌더링하는 위치를 지정
// useNavigate: 프로그래밍 방식으로 페이지를 이동하는 훅
import { Link, Outlet, useNavigate } from "react-router";

import styled from "styled-components";

// react-icons 라이브러리에서 아이콘들을 import
// FaHome: 홈 아이콘 (Font Awesome)
// FaUserCog: 사용자 설정 아이콘 (Font Awesome)
import { FaHome, FaUserCog } from "react-icons/fa";

// MdLogout: 로그아웃 아이콘 (Material Design)
import { MdLogout } from "react-icons/md";

// auth: Firebase Authentication 인스턴스
// 로그아웃 기능을 사용하기 위해 필요
import { auth } from "../firebase.ts";

const Wrapper = styled.div`
    width: 100%;
    max-width: 860px;
    padding: 50px 0;
    display: flex;
    gap: 20px;
`;

const Menu = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
`;

const MenuItem = styled.div`
    width: 35px;
    height: 35px;
    border: 2px solid white;
    font-size: 16px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`;

// Layout: 애플리케이션의 공통 레이아웃 컴포넌트
// 사이드 메뉴(네비게이션)와 메인 콘텐츠 영역으로 구성
// router.tsx에서 "/"와 "/profile" 경로의 공통 부모로 사용됨
function Layout() {
    // navigate: 페이지 이동을 위한 함수
    // 로그아웃 후 로그인 페이지로 이동하는데 사용
    const navigate = useNavigate();

    // onLogOut: 로그아웃을 처리하는 비동기 함수
    const onLogOut = async () => {
        // 사용자에게 진짜 로그아웃할 것인지 물어보고

        // confirm: 브라우저 기본 확인 대화상자 표시
        // "확인" 클릭 시 true, "취소" 클릭 시 false 반환
        const ok = confirm("정말로 로그아웃 하시겠습니까?");

        // ok가 true면 (확인을 눌렀으면) 로그아웃 실행
        if (ok) {
            // 로그아웃 처리

            // auth.signOut(): Firebase 로그아웃 함수
            // 현재 로그인된 사용자의 인증 세션을 종료
            // 이후 auth.currentUser는 null이 됨
            // await: 로그아웃 처리가 완료될 때까지 기다림
            await auth.signOut();

            // 사용자 이동 -> /login
            // navigate("/login"): 로그인 페이지로 이동
            // 로그아웃 후 자동으로 로그인 페이지로 리다이렉트
            navigate("/login");
        }
        // ok가 false면 (취소를 눌렀으면) 아무것도 하지 않고 함수 종료
    };

    // JSX 반환: 실제 화면에 렌더링될 레이아웃
    return (
        // Wrapper: 전체 레이아웃을 감싸는 컨테이너
        <Wrapper>
            {/* Menu: 왼쪽 사이드바 메뉴 */}
            <Menu>
                {/* 홈 메뉴 아이템 */}
                {/* Link: React Router의 페이지 이동 컴포넌트 */}
                {/* to="/": 클릭 시 홈("/") 페이지로 이동 */}
                <Link to={"/"}>
                    {/* MenuItem: 메뉴 아이템의 스타일 컨테이너 */}
                    <MenuItem>
                        {/* FaHome: 홈 아이콘 표시 */}
                        <FaHome />
                    </MenuItem>
                </Link>

                {/* 프로필 메뉴 아이템 */}
                {/* Link to="/profile": 클릭 시 프로필("/profile") 페이지로 이동 */}
                <Link to={"/profile"}>
                    <MenuItem>
                        {/* FaUserCog: 사용자 설정 아이콘 표시 */}
                        <FaUserCog />
                    </MenuItem>
                </Link>

                {/* 로그아웃 메뉴 아이템 */}
                {/* Link로 감싸지 않음 - 페이지 이동이 아닌 기능 실행용 */}
                {/* onClick={onLogOut}: 클릭 시 onLogOut 함수 실행 */}
                <MenuItem onClick={onLogOut}>
                    {/* MdLogout: 로그아웃 아이콘 표시 */}
                    <MdLogout />
                </MenuItem>
            </Menu>

            {/* Outlet: React Router의 중첩 라우트 렌더링 위치 */}
            {/* router.tsx에서 정의한 children 컴포넌트들이 여기에 렌더링됨 */}
            {/* "/" 경로 → <Home /> 컴포넌트가 여기에 렌더링 */}
            {/* "/profile" 경로 → <Profile /> 컴포넌트가 여기에 렌더링 */}
            {/* Outlet이 없으면 자식 라우트가 표시되지 않음 */}
            <Outlet />
        </Wrapper>
    );
}

// Layout 컴포넌트를 다른 파일에서 import할 수 있도록 내보냄
export default Layout;
