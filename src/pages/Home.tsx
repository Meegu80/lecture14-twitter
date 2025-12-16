import PostTweetForm from "../components/PostTweetForm.tsx";
import styled from "styled-components";
import TimeLine from "../components/TimeLine.tsx";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 50px;
`;

function Home() {
    return (
        <Wrapper>
            <PostTweetForm />
            <TimeLine />
        </Wrapper>
    );
}

export default Home;
