import type { TweetType } from "./Timeline.tsx";
import { auth, db } from "../firebase.ts";
import styled from "styled-components";
import { deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router";

type Props = {
    item: TweetType;
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    border: 1px solid white;
    border-radius: 15px;
`;

const Username = styled.span`
    font-weight: 600;
    font-size: 15px;
`;

const Text = styled.p`
    margin: 10px 0;
    font-size: 18px;
`;

const DeleteBtn = styled.button`
    background-color: tomato;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
`;

function Tweet({ item }: Props) {
    const navigate = useNavigate();

    const user = auth.currentUser;

    const onDelete = async () => {
        // 사용자에게 삭제할건지를 재확인
        const ok = confirm("정말 이 트윗을 삭제하실건가요?");
        if (!ok) return;

        try {
            // 재확인 시 진짜 삭제한다면 firestore에서 삭제 처리
            await deleteDoc(doc(db, "tweets", item.id));
            // 이후 새로고침
            navigate(0);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Wrapper>
            <Username>{item.username}</Username>
            <Text>{item.tweet}</Text>
            {/* 접속한 사용자와, 글 작성자가 동일할 때에는 삭제 버튼을 출력 */}
            {user?.uid === item.userId && <DeleteBtn onClick={onDelete}>Delete</DeleteBtn>}
        </Wrapper>
    );
}

export default Tweet;
