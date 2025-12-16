// TweetType: 트윗 데이터의 타입 정의
// Timeline.tsx에서 정의하고 export한 타입을 가져옴
// 트윗의 구조를 알기 위해 필요
import type { TweetType } from "./Timeline.tsx";

// Firebase 서비스 인스턴스들
// auth: 현재 로그인한 사용자 정보 확인용
// db: Firestore 데이터베이스에서 트윗 삭제용
// storage: Storage에서 이미지 파일 삭제용
import { auth, db, storage } from "../firebase.ts";

import styled from "styled-components";

// Firestore 관련 함수들
// deleteDoc: Firestore 문서를 삭제하는 함수
// doc: Firestore의 특정 문서를 참조하는 함수
import { deleteDoc, doc } from "firebase/firestore";

// useNavigate: 페이지 이동/새로고침을 위한 훅
import { useNavigate } from "react-router";

// Firebase Storage 관련 함수들
// deleteObject: Storage에서 파일을 삭제하는 함수
// ref: Storage의 특정 파일 위치를 참조하는 함수
import { deleteObject, ref } from "firebase/storage";

// Props: Tweet 컴포넌트가 받을 props의 타입 정의
type Props = {
    // item: 표시할 트윗 데이터 (Timeline에서 전달받음)
    item: TweetType;
};

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
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

const Column = styled.div``;

const Photo = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 15px;
`;

// Tweet: 개별 트윗을 표시하는 컴포넌트
// { item }: Props - 구조 분해 할당으로 props에서 item만 추출
function Tweet({ item }: Props) {
    // navigate: 페이지 이동/새로고침을 위한 함수
    // 트윗 삭제 후 navigate(0)으로 페이지 새로고침
    const navigate = useNavigate();

    // user: 현재 로그인한 사용자 정보
    // 이 사용자가 트윗 작성자와 동일한지 확인하여 삭제 버튼 표시 여부 결정
    const user = auth.currentUser;

    // onDelete: 트윗 삭제를 처리하는 비동기 함수
    const onDelete = async () => {
        // 사용자에게 삭제할건지를 재확인
        // confirm: 브라우저 기본 확인 대화상자 표시
        // 확인 클릭 시 true, 취소 클릭 시 false 반환
        const ok = confirm("정말 이 트윗을 삭제하실건가요?");

        // ok가 false면 (취소를 눌렀으면) 함수 종료
        // return으로 이후 삭제 로직 실행 방지
        if (!ok) return;

        // try-catch: 에러 처리 구문
        // Firebase 삭제 작업 중 발생할 수 있는 에러를 잡아서 처리
        try {
            // === 1단계: Firestore 문서 삭제 ===

            // 재확인 시 진짜 삭제한다면 firestore에서 삭제 처리

            // deleteDoc: Firestore 문서를 삭제하는 함수
            // doc: 삭제할 문서의 참조를 생성
            // 매개변수 1: db - Firestore 인스턴스
            // 매개변수 2: "tweets" - 컬렉션 이름
            // 매개변수 3: item.id - 삭제할 문서의 ID
            // await: 삭제가 완료될 때까지 기다림
            await deleteDoc(doc(db, "tweets", item.id));

            // === 2단계: Storage에서 이미지 파일 삭제 (있는 경우만) ===

            // item.photo가 존재하거나 || user?.uid가 존재하면 실행
            // 원래 의도: 이미지가 있는 트윗만 Storage 삭제 실행
            // 논리적 오류: user?.uid는 항상 존재하므로 || 대신 && 사용해야 함
            // 올바른 조건: if (item.photo && user?.uid)
            if (item.photo || user?.uid) {
                // 파일 경로에 user.uid가 들어갔어야 함
                // 이는 2개 변수에서 값을 뽑아올 수 있는데
                // 1. 우리가 상단에서 준비한 user라는 값을 통해서 user.uid 를 가져오면 되나
                //    user는 User | null 타입이라 null이 아닐 때를 조건으로 걸어줘야 함
                // 2. 글정보 (item) 에서 item.userId에 사용자 정보가 존재함

                // ref: Storage의 파일 위치를 참조하는 객체 생성
                // storage: Firebase Storage 인스턴스
                // `tweets/${item.userId}/${item.id}`: 삭제할 파일의 경로
                //   - PostTweetForm에서 업로드할 때 사용한 경로와 동일해야 함
                //   - item.userId 사용 (user.uid 대신) - 더 안전하고 명확함
                const photoRef = ref(storage, `tweets/${item.userId}/${item.id}`);

                // 준비된 파일 정보를 통해 storage에 삭제 요청
                // deleteObject: Storage에서 파일을 삭제하는 함수
                // photoRef: 삭제할 파일의 참조
                // await: 파일 삭제가 완료될 때까지 기다림
                await deleteObject(photoRef);
            }

            // === 3단계: 페이지 새로고침 ===

            // 이후 새로고침
            // navigate(0): 현재 페이지를 새로고침
            // 이렇게 하면 Timeline이 다시 렌더링되면서 삭제된 트윗이 사라진 목록을 불러옴
            // 더 나은 방법: React Query나 상태 관리를 사용하여
            // 페이지 새로고침 없이 해당 트윗만 목록에서 제거
            navigate(0);
        } catch (e) {
            // catch: try 블록에서 에러가 발생하면 실행
            // 에러를 콘솔에 출력 (디버깅용)
            console.log(e);
            // 실제 프로덕션에서는 사용자에게 에러 메시지를 표시해야 함
            // 예: alert("트윗 삭제에 실패했습니다.")
        }
    };

    // JSX 반환: 실제 화면에 렌더링될 트윗 UI
    return (
        // Wrapper: 전체 트윗을 감싸는 컨테이너
        <Wrapper>
            {/* Column: 왼쪽 영역 (사용자명, 트윗 내용, 삭제 버튼) */}
            <Column>
                {/* Username: 트윗 작성자 이름 표시 */}
                <Username>{item.username}</Username>

                {/* Text: 트윗 내용 표시 */}
                <Text>{item.tweet}</Text>

                {/* 조건부 렌더링: 삭제 버튼 */}
                {/* 접속한 사용자와, 글 작성자가 동일할 때에는 삭제 버튼을 출력 */}
                {/* user?.uid: 현재 로그인한 사용자의 ID (optional chaining) */}
                {/* === item.userId: 트윗 작성자의 ID */}
                {/* 둘이 같으면 true → DeleteBtn 렌더링 */}
                {/* 둘이 다르면 false → 아무것도 렌더링 안 함 */}
                {/* 이렇게 하면 본인이 작성한 트윗만 삭제 가능 */}
                {user?.uid === item.userId && <DeleteBtn onClick={onDelete}>Delete</DeleteBtn>}
            </Column>

            {/* 조건부 렌더링: 이미지가 있을 때만 표시 */}
            {/* item.photo가 존재하면 (truthy) → Column과 Photo 렌더링 */}
            {/* item.photo가 없으면 (falsy) → 아무것도 렌더링 안 함 */}
            {/* && 연산자: 좌측이 true일 때만 우측 실행 (short-circuit evaluation) */}
            {item.photo && (
                <Column>
                    <Photo src={item.photo} />
                </Column>
            )}
        </Wrapper>
    );
}

// Tweet 컴포넌트를 다른 파일에서 import할 수 있도록 내보냄
export default Tweet;
