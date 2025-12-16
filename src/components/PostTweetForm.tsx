import styled from "styled-components";
import { useForm } from "react-hook-form";
import { auth, db, storage } from "../firebase.ts";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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

    // input type="file"은 옵션을 통해 여러개의 파일도 선택이 가능함
    // 그래서 FileList 타입은 Array 형태인 것이고, 그 중 첫번째 파일을 선택해줘야 할 필요가 있음
    // watch : react-hook-form과 연결되어져 있는 해당 input의 값이 변경될 때마다
    // 그 변경된 값을 가져옴
    const fileList = watch("file");
    const file = fileList && fileList.length === 1 ? fileList[0] : null;

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

            // 일단, 글을 DB에 씀
            // 이후, 파일이 있다면 파일을 업로드함
            // 이후, 파일을 업로드하고 얻은 파일 정보를 글에 업데이트 함

            if (data.file?.[0]) {
                // 파일을 storage에 어떻게 업로드 할 것인지를 준비
                // ref: import { ref } from "firebase/storage";
                const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
                // 실제 업로드를 하고 그 결과 데이터를 result에 저장
                const result = await uploadBytes(locationRef, data.file[0]);
                // 업로드 된 파일의 URL 경로를 받아옴
                const url = await getDownloadURL(result.ref);

                // 이렇게 업로드가 완료되고, 그 정보까지 받아서 URL을 마련을 해준 뒤, 그 URL을 방금 쓴 db에 업데이트 저장
                await updateDoc(doc, { photo: url });
            }

            setValue("tweet", "");
            setValue("file", null);

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
                {file ? "Photo Added" : "Add Photo"}
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