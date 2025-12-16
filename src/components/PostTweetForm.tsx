import styled from "styled-components";
import { useForm } from "react-hook-form";
import { auth, db } from "../firebase.ts";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router";

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Textarea = styled.textarea`
    border: 2px solid white;
    padding: 20px;
    border-radius: 20px;
    background-color: black;
    color: white;
    // textarea는 크기를 사용자가 변경할 수 있는데 그걸 막음
    resize: none;

    // placeholder에 대한 CSS를 적용할 때
    &::placeholder {
        color: lightgray;
    }

    &:focus {
        outline: none;
    }
`;

const AttachFileButton = styled.label`
    padding: 10px 0;
    color: #1d9bf0;
    text-align: center;
    border-radius: 20px;
    border: 1px solid #1d9bf0;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
`;

const AttachFileInput = styled.input`
    display: none;
`;

const SubmitBtn = styled.button`
    padding: 10px 0;
    background-color: #1d9bf0;
    color: white;
    text-align: center;
    border-radius: 20px;
    border: 1px solid #1d9bf0;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;

    &:hover,
    &:active {
        opacity: 0.9;
    }
`;

type TweetFormValues = {
    tweet: string;
    file: FileList | null;
};

function PostTweetForm() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { isSubmitting },
    } = useForm<TweetFormValues>();

    const onSubmit = async (data: TweetFormValues) => {
        // 작성된 데이터 + 이 글을 누가 작성했는가를 firebase에 전달
        const user = auth.currentUser;

        // auth.currentUser를 하게 되면 User | null 타입으로 반환됨
        // 물론, ProtectedRoute를 통해 프로그램 내 논리로서 null은 없겠지만,
        // 다른 파일에서 이뤄지는 일이기 때문에 자바스크립트 엔진은 알 수 없음
        // 따라서 (그럴리는 없겠지만), user가 null일 때 return으로 선 처리 해줘서
        // user의 타입을 User만 남도록 함
        if (!user) return;

        try {
            // firestore에서 사용할 수 있는 규격에 맞춘 객체를 준비
            const tweet = {
                tweet: data.tweet,
                createdAt: new Date(), // 생성시간
                username: user.displayName || "Anonymous",
                userId: user.uid,
            };
            // 그 객체를 firestore에 저장
            const doc = await addDoc(collection(db, "tweets"), tweet);

            setValue("tweet", "");

            // 원래는, 그 불러오는 부분만 재실행해서 Timeline 부분만 갱신해줘야 함
            navigate(0); // 새로고침
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Textarea
                // rows : 화면에 출력되는 최소 줄 수
                rows={5}
                // maxLength : 기록할 수 있는 글자 수
                maxLength={180}
                placeholder={"오늘은 무슨 일이 있었나요?"}
                {...register("tweet", { required: true })}
            />
            <AttachFileButton
                // htmlFor : 이 label이 바라보고 있는 input 요소의 id를 기재
                htmlFor={"attachment"}>
                Add Photo
            </AttachFileButton>
            <AttachFileInput
                id={"attachment"}
                type={"file"}
                // accept : 첨부할 수 있는 파일의 종류를 제한할 수 있음
                accept={"image/*"}
                {...register("file")}
            />
            <SubmitBtn disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post Tweet"}
            </SubmitBtn>
        </Form>
    );
}

export default PostTweetForm;
