import styled from "styled-components";
import { auth, db, storage } from "../firebase.ts";
import { type ChangeEvent, useEffect, useState } from "react";
import type { TweetType } from "../components/Timeline.tsx";
import { FaUser } from "react-icons/fa";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import Tweet from "../components/Tweet.tsx";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
`;

const AvatarUpload = styled.label`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #1d9bf0;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    // 본인의 영역을 넘어간 자식 요소들을 안 보이도록 처리
    overflow: hidden;
`;

const AvatarInput = styled.input`
    display: none;
`;

const Name = styled.span`
    font-size: 22px;
`;

const TweetList = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const AvatarImage = styled.img`
    width: 100%;
`;

function Profile() {
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState(user?.photoURL);
    const [list, setList] = useState<TweetType[]>([]);

    console.log(user);

    const onAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        if (!user) return;

        if (files && files.length === 1) {
            const file = files[0];

            // 파일업로드 1. 파일 경로에 대한 정보를 작성
            const locationRef = ref(storage, `avatars/${user.uid}`);
            // 파일업로드 2. 파일을 업로드하고
            //             만약, 같은 파일명의 파일을 업로드 하더라도, 묻지도 따지지도 않고 덮어쓰기
            const result = await uploadBytes(locationRef, file);
            // 파일업로드 3. 파일 업로드된 경로를 받아옴
            const avatarUrl = await getDownloadURL(result.ref);

            // 업로드가 끝난 URL로 화면에 출력
            setAvatar(avatarUrl);
            // 업로드가 끝난 URL로 사용자 정보를 업데이트
            await updateProfile(user, { photoURL: avatarUrl });
        }
    };

    const fetchTweets = async () => {
        // firestore에서 데이터를 검색해오는 명령(query)를 작성
        // query(콜렉션정보, 검색조건)
        // orderBy : 생성일자 기준으로 내림차순 정렬
        // 내림차순 : desc , 오름차순 : asc
        const tweetsQuery = query(
            collection(db, "tweets"),
            // where절은 어떠한 항목에 대한 조건을 걸 때 사용
            where("userId", "==", user?.uid),
            orderBy("createdAt", "desc"),
            // limit는 조회해오는 갯수 제한
            limit(25),
        );

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
                photo: data.photo,
            };
        });
        setList(tweets);
    };

    useEffect(() => {
        fetchTweets().then(() => {});
    }, []);

    return (
        <Wrapper>
            <AvatarUpload htmlFor={"avatar"}>
                {avatar ? <AvatarImage src={avatar} /> : <FaUser size={40} />}
            </AvatarUpload>
            <AvatarInput type={"file"} id={"avatar"} accept={"image/*"} onChange={onAvatarChange} />
            <Name>이름</Name>

            <TweetList>
                {list.map((item, index) => {
                    return <Tweet key={index} item={item} />;
                })}
            </TweetList>
        </Wrapper>
    );
}

export default Profile;
