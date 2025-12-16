import styled from "styled-components";

// useEffect: 컴포넌트가 마운트될 때 부수 효과(side effect)를 실행하는 훅
// useState: 컴포넌트의 상태를 관리하는 훅
import { useEffect, useState } from "react";

// Firestore 데이터베이스 관련 함수들
// collection: Firestore의 컬렉션(테이블과 유사)에 접근하는 함수
// getDocs: 쿼리 결과로 여러 문서들을 가져오는 함수
// orderBy: 데이터를 정렬하는 쿼리 조건 함수
// query: Firestore 쿼리를 생성하는 함수 (조건을 조합하여 데이터 검색)
import { collection, getDocs, orderBy, query } from "firebase/firestore";

// db: Firestore 데이터베이스 인스턴스
// Firestore 데이터베이스에 접근하기 위한 연결 객체
import { db } from "../firebase.ts";

// Tweet: 개별 트윗을 표시하는 컴포넌트
// Timeline에서 각 트윗 데이터를 Tweet 컴포넌트로 전달하여 렌더링
import Tweet from "./Tweet.tsx";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

// TweetType: 트윗 데이터의 타입 정의
// Firestore에서 가져온 트윗 데이터의 구조를 명시
// export로 내보내서 다른 컴포넌트(Tweet.tsx 등)에서도 사용 가능
export type TweetType = {
    // id: 트윗의 고유 식별자 (Firestore 문서 ID)
    id: string;
    // tweet: 트윗 내용 (텍스트)
    tweet: string;
    // createdAt: 트윗 작성 시간 (숫자 타임스탬프)
    // Firestore에서 Date 객체를 숫자로 변환한 값
    createdAt: number;
    // userId: 작성자의 고유 ID (Firebase Auth uid)
    userId: string;
    // username: 작성자 이름
    username: string;
    // photo?: 첨부된 이미지 URL (선택사항)
    // ?는 optional을 의미 - 이미지가 없을 수도 있음
    photo?: string;
};

// Timeline: 트윗 목록을 표시하는 컴포넌트
function Timeline() {
    // tweets 상태: 트윗 목록을 저장하는 배열
    // TweetType[]: TweetType 객체들의 배열 타입
    // 초기값: 빈 배열 [] (아직 데이터를 불러오기 전)
    const [tweets, setTweets] = useState<TweetType[]>([]);

    // fetchTweets: Firestore에서 트윗 목록을 가져오는 비동기 함수
    const fetchTweets = async () => {
        // === 1단계: Firestore 쿼리 작성 ===

        // firestore에서 데이터를 검색해오는 명령(query)를 작성
        // query(콜렉션정보, 검색조건)
        // orderBy : 생성일자 기준으로 내림차순 정렬
        // 내림차순 : desc , 오름차순 : asc

        // query: Firestore 쿼리를 생성하는 함수
        // 여러 조건들을 조합하여 데이터 검색 규칙을 만듦
        const tweetsQuery = query(
            // 매개변수 1: collection(db, "tweets")
            // "tweets" 컬렉션에 접근 (모든 트윗 데이터가 저장된 곳)
            collection(db, "tweets"),

            // 매개변수 2: orderBy("createdAt", "desc")
            // 정렬 조건을 지정
            // "createdAt": 정렬 기준 필드 (작성 시간)
            // "desc": 내림차순 정렬 (최신 트윗이 먼저)
            // 결과: 가장 최근에 작성된 트윗부터 순서대로 가져옴
            orderBy("createdAt", "desc"),
        );

        // === 2단계: 쿼리 실행하여 데이터 가져오기 ===

        // 작성된 query문으로 실제 요청
        // getDocs: 쿼리를 실행하여 문서들을 가져오는 함수
        // 매개변수: tweetsQuery - 위에서 작성한 쿼리
        // 반환값: snapshot - 쿼리 결과를 담고 있는 객체
        // await: Firestore에서 데이터를 가져올 때까지 기다림
        const snapshot = await getDocs(tweetsQuery);

        // === 3단계: 가져온 데이터를 가공 ===

        // 도착된 데이터를 가공
        // 실질적으로 도착한 데이터 중 우리가 필요한 내용은 snapshot.docs에 있음 (docs는 Array)
        // Array 내부 요소는 객체로 존재 item = {
        //                                     data: data(), -> 이게 우리가 작성한 데이터
        //                                     id: id, -> 이 요소의 고유한 id
        //                                   }

        // snapshot.docs: 가져온 문서들의 배열
        // .map(): 배열의 각 요소를 변환하여 새로운 배열 생성
        // item: 각 Firestore 문서 객체 (DocumentSnapshot)
        const tweets = snapshot.docs.map(item => {
            // item.data(): 문서의 실제 데이터를 가져오는 메서드
            // 우리가 Firestore에 저장했던 { tweet, createdAt, userId, username, photo } 같은 데이터
            const data = item.data();

            // return: 각 문서를 TweetType 형태로 변환
            // data에서 필요한 필드들을 추출하여 새 객체 생성
            return {
                // tweet: 트윗 내용
                tweet: data.tweet,
                // createdAt: 작성 시간
                createdAt: data.createdAt,
                // userId: 작성자 ID
                userId: data.userId,
                // username: 작성자 이름
                username: data.username,
                // id: 문서의 고유 ID
                // item.id: Firestore가 자동으로 생성한 문서 ID
                // data에는 포함되지 않고 item에서 직접 가져와야 함
                id: item.id,
                // photo: 첨부 이미지 URL (있을 수도, 없을 수도)
                photo: data.photo,
            };
        });

        // === 4단계: 상태 업데이트 ===

        // setTweets: tweets 상태를 새로운 데이터로 업데이트
        // 이렇게 하면 컴포넌트가 리렌더링되면서 화면에 트윗 목록이 표시됨
        setTweets(tweets);
    };

    // useEffect: 컴포넌트가 처음 마운트될 때 실행
    // 의존성 배열 []이 비어있으므로 컴포넌트 생성 시 딱 한 번만 실행
    useEffect(() => {
        // fetchTweets() 함수 실행
        // .then(() => {}): Promise가 완료되면 빈 함수 실행 (아무것도 안 함)
        // useEffect가 Promise를 직접 반환하는 것을 허용하지 않아서 이런 패턴 사용
        fetchTweets().then(() => {});
    }, []); // 빈 의존성 배열: 컴포넌트 마운트 시 한 번만 실행

    // JSX 반환: 실제 화면에 렌더링될 트윗 목록
    return (
        <Wrapper>
            {/* tweets 배열을 순회하면서 각 트윗을 Tweet 컴포넌트로 렌더링 */}
            {/* .map(): 배열의 각 요소를 JSX 요소로 변환 */}
            {tweets.map((item, index) => {
                // item: 현재 트윗 데이터 (TweetType 객체)
                // index: 배열에서의 인덱스 (0, 1, 2, ...)

                // Tweet 컴포넌트 반환
                return (
                    <Tweet
                        // key: React가 각 요소를 구별하기 위한 고유 식별자
                        // 리스트 렌더링 시 필수 prop
                        // index를 key로 사용 (더 나은 방법: item.id 사용)
                        // key={item.id}가 더 좋은 선택 (고유하고 안정적)
                        key={index}
                        // item: Tweet 컴포넌트에 전달할 트윗 데이터
                        // Tweet 컴포넌트에서 props.item으로 접근 가능
                        item={item}
                    />
                );
            })}
        </Wrapper>
    );
}

// Timeline 컴포넌트를 다른 파일에서 import할 수 있도록 내보냄
export default Timeline;
