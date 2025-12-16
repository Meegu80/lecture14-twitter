// GlobalStyle: 전역 CSS 스타일을 적용하는 컴포넌트
// 애플리케이션 전체에 공통으로 적용될 기본 스타일을 정의
import GlobalStyle from "./styles/GlobalStyle.tsx";

// RouterProvider: React Router v6의 라우팅을 제공하는 컴포넌트
// router 객체를 받아서 페이지 간 이동 기능을 제공
import { RouterProvider } from "react-router";

// router: 애플리케이션의 라우팅 설정 객체
// 어떤 URL에서 어떤 컴포넌트를 보여줄지 정의되어 있음
import router from "./router/router.tsx";

// styled-components 라이브러리로 CSS-in-JS 스타일 작성
import styled from "styled-components";

// Spinner: 로딩 중일 때 표시할 스피너(로딩 애니메이션) 컴포넌트
import Spinner from "./components/Spinner.tsx";

// useEffect: 컴포넌트가 마운트될 때 부수 효과(side effect)를 실행하는 훅
// useState: 컴포넌트의 상태를 관리하는 훅
import { useEffect, useState } from "react";

// auth: Firebase Authentication 인스턴스
// Firebase 인증 서비스에 접근하기 위한 객체
import { auth } from "./firebase.ts";

// 전체 앱을 감싸는 최상위 컨테이너
const Wrapper = styled.div`
    // 100dvh: 동적 뷰포트 높이 (모바일 브라우저의 주소창 등을 고려한 실제 화면 높이)
    // vh 대신 dvh를 사용하면 모바일에서 더 정확한 화면 높이를 얻을 수 있음
    height: 100dvh;

    // flexbox로 내부 요소를 중앙 정렬
    display: flex;

    // 가로 방향 중앙 정렬 (Spinner 또는 RouterProvider를 중앙에 배치)
    justify-content: center;
`;

// App: 애플리케이션의 최상위 루트 컴포넌트
function App() {
    // isLoading 상태: Firebase 초기화가 완료되었는지 여부를 저장
    // true: 아직 초기화 중 (Spinner 표시)
    // false: 초기화 완료 (실제 앱 내용 표시)
    // 초기값은 true (처음엔 로딩 중 상태)
    const [isLoading, setIsLoading] = useState(true);

    // init: Firebase 인증 상태를 초기화하는 함수
    const init = () => {
        // auth.authStateReady(): Firebase가 현재 사용자의 인증 상태를 확인할 준비가 되었는지 체크
        // 이 Promise가 resolve되면 Firebase가 "지금 로그인한 사람이 누구인지" 판단할 준비가 완료된 것
        // 로그인 여부를 확실히 알 수 있는 시점까지 기다림
        // .then(): 준비가 완료되면 실행
        // setIsLoading(false): 로딩 상태를 false로 변경하여 로딩 화면 종료
        return auth.authStateReady().then(() => setIsLoading(false));
    };

    // useEffect: 컴포넌트가 처음 마운트될 때 한 번만 실행
    // 의존성 배열 []이 비어있으므로 컴포넌트 생성 시 딱 한 번만 실행됨
    useEffect(() => {
        // Promise<void>이기 때문에 실패할 확률이 있음. (초기화가 안될 가능성)
        // firebase에 접속을 못하는 상황이 될 수 있으나,
        // 그렇게 되면 아예 이 프로젝트는 구동할 이유가 없기 때문에 catch를 써주지 않았음

        // init() 함수 실행
        // .then(() => {}): Promise가 완료되면 빈 함수 실행 (아무것도 안 함)
        // 여기서 빈 then을 쓰는 이유는 useEffect가 Promise를 직접 반환하는 것을 허용하지 않기 때문
        // useEffect 내부에서 async/await를 바로 쓸 수 없어서 이런 패턴 사용
        init().then(() => {});
    }, []); // 빈 의존성 배열: 컴포넌트 마운트 시 한 번만 실행

    // JSX 반환: 실제 화면에 렌더링될 내용
    return (
        // 전체 앱을 감싸는 Wrapper 컨테이너
        <Wrapper>
            {/* GlobalStyle: 전역 CSS 스타일 적용 */}
            {/* 이 컴포넌트는 화면에 보이지 않고 스타일만 적용함 */}
            <GlobalStyle />

            {/* 조건부 렌더링: 삼항 연산자 사용 */}
            {/* isLoading이 true면: Spinner 컴포넌트 표시 (로딩 중) */}
            {/* isLoading이 false면: RouterProvider로 실제 앱 라우팅 시작 */}
            {/* RouterProvider router={router}: router 설정에 따라 페이지 렌더링 */}
            {isLoading ? <Spinner /> : <RouterProvider router={router} />}
        </Wrapper>
    );
}

// App 컴포넌트를 다른 파일에서 import할 수 있도록 내보냄
// main.tsx에서 이 컴포넌트를 불러와서 렌더링함
export default App;
