import styled from "styled-components";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase.ts";
import Tweet from "./Tweet.tsx";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export type TweetType = {
    id: string;
    tweet: string;
    createdAt: number;
    userId: string;
    username: string;
};

function Timeline() {
    const [tweets, setTweets] = useState<TweetType[]>([]);

    const fetchTweets = async () => {
        // firestore에서 데이터를 검색해오는 명령(query)를 작성
        // query(콜렉션정보, 검색조건)
        // orderBy : 생성일자 기준으로 내림차순 정렬
        // 내림차순 : desc , 오름차순 : asc
        const tweetsQuery = query(collection(db, "tweets"), orderBy("createdAt", "desc"));

        // 작성된 query문으로 실제 요청
        const snapshot = await getDocs(tweetsQuery);

        // 도착된 데이터를 가공
        // 실질적으로 도착한 데이터 중 우리가 필요한 내용은 snapshot.docs에 있음 (docs는 Array)
        // Array 내부 요소는 객체로 존재 item = {
        //                                     data: data(), -> 이게 우리가 작성한 데이터
        //                                     id: id, -> 이 요소의 고유한 id
        //                                   }

        const tweets = snapshot.docs.map(item => {
            const data = item.data();
            return {
                tweet: data.tweet,
                createdAt: data.createdAt,
                userId: data.userId,
                username: data.username,
                id: item.id,
            };
        });
        setTweets(tweets);
    };

    useEffect(() => {
        fetchTweets().then(() => {});
    }, []);

    return (
        <Wrapper>
            {tweets.map((item, index) => {
                return <Tweet key={index} item={item} />;
            })}
        </Wrapper>
    );
}

export default Timeline;
