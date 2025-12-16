import type { TweetType } from "./TimeLine.tsx";
import { auth } from "../firebase.ts";
import styled from "styled-components";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 20px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);

    &:hover {
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }
`;

const Username = styled.span`
    font-weight: 600;
    font-size: 16px;
    color: #60a5fa;
    letter-spacing: 0.3px;
`;

const TweetText = styled.p`
    margin: 0;
    font-size: 15px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
    word-break: break-word;
`;

const DeleteButton = styled.button`
    align-self: flex-end;
    padding: 8px 16px;
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: rgba(239, 68, 68, 0.2);
        border-color: rgba(239, 68, 68, 0.5);
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.98);
    }
`;

type Props = {
    item: TweetType;
};

function Tweet({ item }: Props) {
    const user = auth.currentUser;

    return (
        <Wrapper>
            <Username>{item.username}</Username>
            <TweetText>{item.tweet}</TweetText>
            {/* 접속한 사용자와, 글 작성자가 동일할 때에는 삭제 버튼을 출력 */}
            {user?.uid === item.userId && <DeleteButton>Delete</DeleteButton>}
        </Wrapper>
    );
}

export default Tweet;
