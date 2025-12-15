import GlobalStyle from "./styles/GlobalStyle.tsx";
import { RouterProvider } from "react-router";
import router from "./router/router.tsx";
import styled from "styled-components";
import Spinner from "./components/Spinner.tsx";
import { useEffect, useState } from "react";
import { auth } from "./firebase.ts";

const Wrapper = styled.div`
    height: 100dvh;
    display: flex;
    justify-content: center;
`;

function App() {
    const [isLoading, setIsLoading] = useState(true);

    const init = () => {
        return auth.authStateReady().then(() => setIsLoading(false));
    };

    useEffect(() => {
        // Promise<void>이기 때무에 실패할 확율이 있음(초기화가 안될 가능성)
        init().then(() => {});
    }, []);

    return (
        <Wrapper>
            <GlobalStyle />
            {isLoading ? <Spinner /> : <RouterProvider router={router} />}
        </Wrapper>
    );
}

export default App;
