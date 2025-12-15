import PostTweetForm from "../components/PostTweetForm.tsx";
import styled from "styled-components";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 50px;
`;

function Home() {
    return (
        <Wrapper>
            <PostTweetForm />
            <div>글이 나열되는 곳</div>
        </Wrapper>
    );
}

export default Home;
