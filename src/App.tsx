import GlobalStyle from "./styles/GlobalStyle.tsx";
import { RouterProvider } from "react-router";
import router from "./router/router.tsx";
import styled from "styled-components";

const Wrapper = styled.div`
    height: 100dvh;
    display: flex;
    justify-content: center;
`;

function App() {
    return (
        <Wrapper>
            <GlobalStyle />
            <RouterProvider router={router} />
        </Wrapper>
    );
}

export default App;
