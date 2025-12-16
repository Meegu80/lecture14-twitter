// styled-components 라이브러리로 CSS-in-JS 스타일 작성
import styled from "styled-components";

// useForm: react-hook-form의 핵심 훅
// 폼 상태 관리, 유효성 검증을 간편하게 해주는 도구
import { useForm } from "react-hook-form";

// Firebase 서비스 인스턴스들을 import
// auth: 인증 서비스 (현재 로그인한 사용자 정보)
// db: Firestore 데이터베이스 서비스 (트윗 데이터 저장)
// storage: Storage 서비스 (이미지 파일 저장)
import { auth, db, storage } from "../firebase.ts";

// Firestore 데이터베이스 관련 함수들
// addDoc: 새로운 문서(document)를 컬렉션에 추가하는 함수
// collection: Firestore의 컬렉션(테이블과 유사)에 접근하는 함수
// updateDoc: 기존 문서의 내용을 업데이트하는 함수
import { addDoc, collection, updateDoc } from "firebase/firestore";

// useNavigate: 프로그래밍 방식으로 페이지를 이동하거나 새로고침하는 훅
import { useNavigate } from "react-router";

// Firebase Storage 관련 함수들
// getDownloadURL: 업로드된 파일의 다운로드 URL을 받아오는 함수
// ref: Storage 내의 특정 위치(경로)를 참조하는 객체를 만드는 함수
// uploadBytes: 파일을 Storage에 업로드하는 함수
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// Form: 트윗 작성 폼을 감싸는 컨테이너
const Form = styled.form`
    // flexbox로 자식 요소들을 세로로 배치
    display: flex;
    flex-direction: column;
    // 각 요소 사이에 10px 간격
    gap: 10px;
`;

// Textarea: 트윗 내용을 입력하는 텍스트 영역
const Textarea = styled.textarea`
    // 테두리: 2px 두께의 흰색 실선
    border: 2px solid white;
    // 내부 여백 20px (텍스트와 테두리 사이 공간)
    padding: 20px;
    // 모서리를 20px 둥글게
    border-radius: 20px;
    // 배경색 검정
    background-color: black;
    // 텍스트 색상 흰색
    color: white;
    // textarea는 크기를 사용자가 변경할 수 있는데 그걸 막음
    // 기본적으로 textarea는 우측 하단에 드래그 핸들이 있어서 크기 조절 가능
    // resize: none으로 이 기능을 비활성화
    resize: none;

    // placeholder에 대한 CSS를 적용할 때
    // ::placeholder는 가상 요소 선택자
    // placeholder 텍스트의 스타일을 지정
    &::placeholder {
        // placeholder 텍스트 색상을 연한 회색으로
        color: lightgray;
    }

    // &:focus - textarea에 포커스가 갔을 때 (클릭하거나 탭으로 선택했을 때)
    &:focus {
        // outline: none - 포커스 시 나타나는 기본 테두리(파란색 외곽선)를 제거
        // 브라우저 기본 스타일을 제거하여 깔끔한 UI 구현
        outline: none;
    }
`;

// AttachFileButton: 파일 첨부 버튼 (실제로는 label 요소)
// label을 버튼처럼 스타일링하여 숨겨진 input[type="file"]을 대신함
const AttachFileButton = styled.label`
    // 상하 10px, 좌우 0px 여백
    padding: 10px 0;
    // 트위터 블루 색상
    color: #1d9bf0;
    // 텍스트 가운데 정렬
    text-align: center;
    // 모서리를 20px 둥글게
    border-radius: 20px;
    // 트위터 블루 색상의 1px 테두리
    border: 1px solid #1d9bf0;
    // 글자 크기 14px
    font-size: 14px;
    // 글자 두께 600 (약간 굵게)
    font-weight: 600;
    // 마우스를 올렸을 때 손가락 모양 커서 (클릭 가능함을 표시)
    cursor: pointer;
`;

// AttachFileInput: 실제 파일 선택 input (화면에서 숨김)
const AttachFileInput = styled.input`
    // display: none으로 input을 완전히 숨김
    // label(AttachFileButton)을 클릭하면 이 input이 동작
    // 이렇게 하는 이유: input[type="file"]의 기본 디자인은 못생겨서
    // label로 예쁘게 꾸미고 실제 input은 숨기는 패턴
    display: none;
`;

// SubmitBtn: 트윗 제출 버튼
const SubmitBtn = styled.button`
    // 상하 10px, 좌우 0px 여백
    padding: 10px 0;
    // 배경색을 트위터 블루로
    background-color: #1d9bf0;
    // 텍스트 색상 흰색
    color: white;
    // 텍스트 가운데 정렬
    text-align: center;
    // 모서리를 20px 둥글게
    border-radius: 20px;
    // 트위터 블루 색상의 1px 테두리
    border: 1px solid #1d9bf0;
    // 글자 크기 14px
    font-size: 14px;
    // 글자 두께 600 (약간 굵게)
    font-weight: 600;
    // 마우스를 올렸을 때 손가락 모양 커서
    cursor: pointer;

    // &:hover - 마우스를 버튼 위에 올렸을 때
    // &:active - 버튼을 클릭하고 있을 때
    // , (쉼표)로 여러 선택자를 한 번에 적용
    &:hover,
    &:active {
        // opacity: 0.9 - 불투명도를 90%로 (약간 투명하게)
        // 호버/클릭 시 살짝 어두워지는 시각적 피드백 제공
        opacity: 0.9;
    }
`;

// TweetFormValues: 트윗 폼에서 관리할 데이터의 타입 정의
type TweetFormValues = {
    // tweet: 트윗 내용 (문자열)
    tweet: string;
    // file: 첨부할 이미지 파일
    // FileList: input[type="file"]에서 선택된 파일들의 목록
    // | null: 파일을 선택하지 않았을 수도 있음
    file: FileList | null;
};

// PostTweetForm: 트윗 작성 폼 컴포넌트
function PostTweetForm() {
    // navigate: 페이지 이동/새로고침을 위한 함수
    // navigate(0)을 호출하면 현재 페이지를 새로고침
    const navigate = useNavigate();

    // useForm: react-hook-form의 핵심 훅
    const {
        // register: input/textarea 요소를 폼에 등록하는 함수
        register,
        // handleSubmit: 폼 제출을 처리하는 함수
        handleSubmit,
        // watch: 특정 필드의 값을 실시간으로 감시(구독)하는 함수
        // 값이 변경될 때마다 컴포넌트가 리렌더링되면서 최신 값을 반환
        watch,
        // setValue: 특정 필드의 값을 프로그래밍 방식으로 변경하는 함수
        // 폼 제출 후 입력값을 초기화하는데 사용
        setValue,
        // formState: 폼의 현재 상태
        formState: {
            // isSubmitting: 폼이 제출 중인지 여부
            isSubmitting,
        },
    } = useForm<TweetFormValues>();

    // input type="file"은 옵션을 통해 여러개의 파일도 선택이 가능함
    // 그래서 FileList 타입은 Array 형태인 것이고, 그 중 첫번째 파일을 선택해줘야 할 필요가 있음
    // watch : react-hook-form과 연결되어져 있는 해당 input의 값이 변경될 때마다
    // 그 변경된 값을 가져옴

    // watch("file"): "file" 필드의 값을 실시간으로 감시
    // 사용자가 파일을 선택하면 이 값이 자동으로 업데이트됨
    // fileList: 선택된 파일 목록 (FileList 타입)
    const fileList = watch("file");

    // file: 실제로 사용할 단일 파일
    // fileList가 존재하고 && 파일이 정확히 1개 선택되었으면 → fileList[0] (첫 번째 파일)
    // 그렇지 않으면 → null
    // 이렇게 하는 이유: input은 여러 파일을 선택할 수 있지만,
    // 이 앱에서는 한 번에 하나의 이미지만 첨부하도록 제한
    const file = fileList && fileList.length === 1 ? fileList[0] : null;

    // onSubmit: 폼이 제출될 때 실행되는 비동기 함수
    // data 매개변수: 폼에서 입력된 데이터 (tweet 내용과 file)
    const onSubmit = async (data: TweetFormValues) => {
        // 작성된 데이터 + 이 글을 누가 작성했는가를 firebase에 전달

        // auth.currentUser: 현재 로그인한 사용자 정보
        // 트윗을 누가 작성했는지 알기 위해 필요
        const user = auth.currentUser;

        // auth.currentUser를 하게 되면 User | null 타입으로 반환됨
        // 물론, ProtectedRoute를 통해 프로그램 내 논리로서 null은 없겠지만,
        // 다른 파일에서 이뤄지는 일이기 때문에 자바스크립트 엔진은 알 수 없음
        // 따라서 (그럴리는 없겠지만), user가 null일 때 return으로 선 처리 해줘서
        // user의 타입을 User만 남도록 함

        // user가 null이면 (로그인 안 했으면) 함수 종료
        // 이 체크 이후로는 TypeScript가 user를 User 타입으로 인식 (null 제외)
        // 이를 "타입 가드(Type Guard)" 또는 "타입 좁히기(Type Narrowing)"라고 함
        if (!user) return;

        // try-catch: 에러 처리 구문
        // Firebase 업로드 중 발생할 수 있는 에러를 잡아서 처리
        try {
            // === 1단계: Firestore에 트윗 텍스트 저장 ===

            // firestore에서 사용할 수 있는 규격에 맞춘 객체를 준비
            // 트윗 문서(document)에 저장될 데이터
            const tweet = {
                // tweet: 사용자가 입력한 트윗 내용
                tweet: data.tweet,
                // createdAt: 트윗 작성 시간 (현재 날짜/시간)
                createdAt: new Date(), // 생성시간
                // username: 사용자 이름
                // user.displayName이 없으면 (null/undefined) "Anonymous"를 기본값으로 사용
                // || 연산자: 좌측이 falsy면 우측 값 사용
                username: user.displayName || "Anonymous",
                // userId: 사용자의 고유 ID (Firebase Auth에서 자동 생성)
                // 나중에 "이 사람이 쓴 트윗만 보기" 같은 필터링에 사용
                userId: user.uid,
            };

            // 그 객체를 firestore에 저장
            // addDoc: Firestore에 새 문서 추가
            // 매개변수 1: collection(db, "tweets") - "tweets" 컬렉션에 접근
            //   컬렉션은 SQL의 테이블과 유사한 개념
            // 매개변수 2: tweet - 저장할 데이터 객체
            // 반환값: doc - 생성된 문서의 참조 (문서 ID 포함)
            const doc = await addDoc(collection(db, "tweets"), tweet);

            // 일단, 글을 DB에 씀
            // 이후, 파일이 있다면 파일을 업로드함
            // 이후, 파일을 업로드하고 얻은 파일 정보를 글에 업데이트 함

            // === 2단계: 이미지가 있으면 Storage에 업로드 ===

            // data.file?.[0]: 옵셔널 체이닝으로 안전하게 첫 번째 파일 접근
            // data.file이 null이면 undefined 반환, 있으면 data.file[0] 반환
            // if문: 파일이 선택되었을 때만 실행
            if (data.file?.[0]) {
                // 파일을 storage에 어떻게 업로드 할 것인지를 준비
                // ref: import { ref } from "firebase/storage";

                // ref: Storage 내의 파일 저장 위치를 지정
                // storage: Firebase Storage 인스턴스
                // `tweets/${user.uid}/${doc.id}`: 저장 경로
                //   - tweets 폴더 안에
                //   - 사용자 ID(user.uid) 폴더 안에
                //   - 문서 ID(doc.id)로 파일명 지정
                // 예시 경로: tweets/abc123/xyz789
                // 이렇게 하면 각 사용자, 각 트윗마다 고유한 경로가 생김
                const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);

                // 실제 업로드를 하고 그 결과 데이터를 result에 저장
                // uploadBytes: 파일을 Storage에 업로드
                // 매개변수 1: locationRef - 저장 위치 참조
                // 매개변수 2: data.file[0] - 업로드할 파일 객체
                // 반환값: result - 업로드 결과 (파일 메타데이터 포함)
                const result = await uploadBytes(locationRef, data.file[0]);

                // 업로드 된 파일의 URL 경로를 받아옴
                // getDownloadURL: 업로드된 파일에 접근할 수 있는 공개 URL 생성
                // result.ref: 업로드된 파일의 참조
                // url: 이미지를 브라우저에서 볼 수 있는 전체 URL
                // 예시: https://firebasestorage.googleapis.com/v0/b/.../tweets%2Fabc123%2Fxyz789
                const url = await getDownloadURL(result.ref);

                // === 3단계: 이미지 URL을 Firestore 문서에 추가 ===

                // 이렇게 업로드가 완료되고, 그 정보까지 받아서 URL을 마련을 해준 뒤,
                // 그 URL을 방금 쓴 db에 업데이트 저장

                // updateDoc: 기존 Firestore 문서를 업데이트
                // 매개변수 1: doc - 업데이트할 문서의 참조 (1단계에서 생성한 문서)
                // 매개변수 2: { photo: url } - 추가할 필드
                //   photo 필드에 이미지 URL을 저장
                // 이렇게 하면 트윗 문서에 photo 속성이 추가됨
                // 최종 문서 구조: { tweet, createdAt, username, userId, photo }
                await updateDoc(doc, { photo: url });
            }

            // === 4단계: 폼 초기화 ===

            // setValue: 폼 필드의 값을 프로그래밍 방식으로 변경
            // "tweet" 필드를 빈 문자열로 초기화 (textarea 비우기)
            setValue("tweet", "");
            // "file" 필드를 null로 초기화 (선택된 파일 제거)
            setValue("file", null);

            // 원래는, 그 불러오는 부분만 재실행해서 Timeline 부분만 갱신해줘야 함

            // navigate(0): 현재 페이지를 새로고침
            // 0은 "현재 위치에서 0만큼 이동" = "새로고침"
            // 이렇게 하면 Timeline 컴포넌트가 다시 렌더링되면서
            // 새로 작성한 트윗을 포함한 목록을 불러옴
            // 더 나은 방법: React Query나 상태 관리를 사용하여
            // 페이지 새로고침 없이 데이터만 업데이트
            navigate(0); // 새로고침
        } catch (e) {
            // catch: try 블록에서 에러가 발생하면 실행
            // 에러를 콘솔에 출력 (디버깅용)
            console.log(e);
            // 실제 프로덕션에서는 사용자에게 에러 메시지를 표시해야 함
        }
    };

    // JSX 반환: 실제 화면에 렌더링될 트윗 작성 폼
    return (
        // Form: 폼 컨테이너
        // onSubmit: 폼 제출 시 handleSubmit으로 유효성 검증 후 onSubmit 함수 실행
        <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Textarea: 트윗 내용 입력 영역 */}
            <Textarea
                // rows : 화면에 출력되는 최소 줄 수
                // 5줄의 높이로 textarea를 표시
                rows={5}
                // maxLength : 기록할 수 있는 글자 수
                // 최대 180자까지만 입력 가능 (트위터 스타일)
                maxLength={180}
                // placeholder: 입력 필드가 비어있을 때 표시되는 안내 텍스트
                placeholder={"오늘은 무슨 일이 있었나요?"}
                // {...register("tweet", {...})}: react-hook-form에 이 textarea를 등록
                // "tweet": 폼 데이터의 키 이름 (data.tweet로 접근)
                // { required: true }: 이 필드는 필수 (비어있으면 제출 불가)
                {...register("tweet", { required: true })}
            />

            {/* AttachFileButton: 파일 첨부 버튼 (label 요소) */}
            <AttachFileButton
                // htmlFor : 이 label이 바라보고 있는 input 요소의 id를 기재
                // id가 "attachment"인 input과 연결
                // 이 label을 클릭하면 연결된 input이 클릭된 것처럼 동작
                htmlFor={"attachment"}>
                {/* 삼항 연산자: 파일이 선택되었는지에 따라 다른 텍스트 표시 */}
                {/* file이 존재하면 "Photo Added" */}
                {/* file이 null이면 "Add Photo" */}
                {/* 사용자에게 파일이 선택되었음을 시각적으로 알려줌 */}
                {file ? "Photo Added" : "Add Photo"}
            </AttachFileButton>

            {/* AttachFileInput: 실제 파일 선택 input (화면에서 숨김) */}
            <AttachFileInput
                // id: label의 htmlFor와 연결되는 고유 ID
                id={"attachment"}
                // type="file": 파일 선택 input
                type={"file"}
                // accept : 첨부할 수 있는 파일의 종류를 제한할 수 있음
                // "image/*": 모든 종류의 이미지 파일만 선택 가능
                // (jpg, png, gif, webp 등)
                accept={"image/*"}
                // {...register("file")}: react-hook-form에 이 input을 등록
                // "file": 폼 데이터의 키 이름
                // required를 지정하지 않아서 파일 첨부는 선택사항
                {...register("file")}
            />

            {/* SubmitBtn: 트윗 제출 버튼 */}
            <SubmitBtn
                // disabled: 제출 중일 때 버튼 비활성화
                // isSubmitting이 true면 버튼 클릭 불가
                // 중복 제출을 방지
                disabled={isSubmitting}>
                {/* 삼항 연산자: 제출 중일 때와 아닐 때 다른 텍스트 표시 */}
                {/* isSubmitting이 true면 "Posting..." (제출 중) */}
                {/* isSubmitting이 false면 "Post Tweet" (제출 대기) */}
                {isSubmitting ? "Posting..." : "Post Tweet"}
            </SubmitBtn>
        </Form>
    );
}

// PostTweetForm 컴포넌트를 다른 파일에서 import할 수 있도록 내보냄
export default PostTweetForm;
