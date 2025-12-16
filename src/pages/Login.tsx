// 스타일 컴포넌트들을 import
// Button, ErrorText, Form, Input 등 인증 페이지에서 사용하는 공통 스타일들
import { Button, ErrorText, Form, Input, Switcher, Title, Wrapper } from "../styles/AuthStyles.tsx";

// Link: React Router의 페이지 이동 컴포넌트 (새로고침 없이 SPA 방식 이동)
// useNavigate: 프로그래밍 방식으로 페이지를 이동하는 훅
import { Link, useNavigate } from "react-router";

// useForm: react-hook-form의 핵심 훅
// 폼 상태 관리, 유효성 검증, 에러 처리를 간편하게 해주는 도구
import { useForm } from "react-hook-form";

// signInWithEmailAndPassword: Firebase Auth에서 이메일/비밀번호로 로그인하는 함수
// 기존에 등록된 사용자 계정으로 로그인 처리
import { signInWithEmailAndPassword } from "firebase/auth";

// auth: Firebase Authentication 인스턴스
// Firebase 인증 서비스에 접근하기 위한 연결 객체
import { auth } from "../firebase.ts";

// FirebaseError: Firebase에서 발생하는 에러의 타입
// 에러가 Firebase에서 발생한 것인지 확인하고, Firebase 특정 에러 코드를 처리하기 위해 사용
import { FirebaseError } from "firebase/app";

// FormValues: 로그인 폼에서 관리할 데이터의 타입 정의
// react-hook-form이 이 타입을 기반으로 폼 데이터를 타입 체크
type FormValues = {
    // email: 이메일 주소 (문자열)
    email: string;
    // password: 비밀번호 (문자열)
    // 로그인은 회원가입과 달리 name(이름) 필드가 필요 없음
    password: string;
};

// Login: 로그인 페이지 컴포넌트
function Login() {
    // navigate: 페이지 이동을 위한 함수
    // 로그인 성공 후 navigate("/")를 호출하여 홈으로 이동
    const navigate = useNavigate();

    // useForm: react-hook-form의 핵심 훅, 폼 관리에 필요한 모든 기능 제공
    const {
        // register: input 요소를 폼에 등록하는 함수
        // {...register("email")} 형태로 사용하여 input을 폼에 연결
        register,

        // handleSubmit: 폼 제출 이벤트를 처리하는 함수
        // 유효성 검증을 자동으로 수행하고, 통과하면 전달받은 콜백 함수 실행
        handleSubmit,

        // formState: 폼의 현재 상태를 담고 있는 객체
        formState: {
            // errors: 각 필드의 유효성 검증 에러를 담는 객체
            errors,
            // isSubmitting: 현재 폼이 제출 중인지 여부 (true/false)
            isSubmitting,
        },

        // setError: 수동으로 에러를 설정하는 함수
        // Firebase 로그인 실패 시 에러 메시지를 표시하는데 사용
        setError,
    } = useForm<FormValues>();

    // onSubmit: 폼이 제출될 때 실행되는 비동기 함수
    // data 매개변수: FormValues 타입의 폼 데이터 (email, password)
    const onSubmit = async (data: FormValues) => {
        // try-catch: 에러 처리 구문
        // Firebase 로그인 과정에서 발생할 수 있는 에러를 잡아서 처리
        try {
            // 들어온 input 데이터들로 firebase에 로그인 요청

            // signInWithEmailAndPassword: Firebase에 로그인 요청
            // 매개변수 1: auth - Firebase Authentication 인스턴스
            // 매개변수 2: data.email - 사용자가 입력한 이메일
            // 매개변수 3: data.password - 사용자가 입력한 비밀번호
            // await: 로그인 처리가 완료될 때까지 기다림
            // 로그인 성공 시 Firebase가 자동으로 인증 상태를 관리 (auth.currentUser에 저장됨)
            await signInWithEmailAndPassword(auth, data.email, data.password);

            // 로그인 성공 후 홈 페이지("/")로 이동
            // navigate 함수로 페이지 새로고침 없이 라우팅
            navigate("/");
        } catch (e) {
            // catch: try 블록에서 에러가 발생하면 실행
            // e: 발생한 에러 객체

            // 만약, 이 error가 Firebase의 에러라면 그 에러 내용을 출력해주고
            // 만약, 이 error가 Firebase의 에러가 아닌 다른 방식의 에러라면 string 출력

            // instanceof : 지정된 객체가 이 타입이라면 true, 아니라면 false

            // instanceof: e가 FirebaseError 타입인지 확인
            // FirebaseError인 경우: Firebase에서 발생한 에러 (인증 실패, 네트워크 오류 등)
            // 아닌 경우: 다른 JavaScript 에러 (예상치 못한 오류)
            if (e instanceof FirebaseError) {
                // Firebase 에러인 경우, 구체적인 에러 코드로 분기 처리

                // e.message: Firebase가 제공하는 에러 메시지
                // "auth/invalid-credential": 이메일 또는 비밀번호가 틀렸을 때 발생
                // Firebase의 표준 에러 코드 중 하나
                if (e.message === "Firebase: Error (auth/invalid-credential)") {
                    // 인증 정보가 잘못된 경우 사용자 친화적인 메시지 표시
                    setError("root", { message: "사용자 정보가 없습니다." });
                } else {
                    // 그 외 Firebase 에러는 원본 메시지를 그대로 표시
                    // 예: "auth/too-many-requests" (너무 많은 시도),
                    //     "auth/network-request-failed" (네트워크 오류) 등
                    setError("root", { message: e.message });
                }
            } else {
                // Firebase 에러가 아닌 경우 (예상치 못한 JavaScript 에러)
                // 일반적인 로그인 실패 메시지 표시
                setError("root", { message: "로그인이 실패되었습니다." });
            }
        }
    };

    // JSX 반환: 실제 화면에 렌더링될 로그인 폼
    return (
        // Wrapper: 전체 로그인 페이지를 감싸는 컨테이너
        <Wrapper>
            {/* Title: 페이지 제목 "Login" */}
            <Title>Login</Title>

            {/* Form: 로그인 폼 요소 */}
            {/* onSubmit: 폼 제출 시 실행될 함수 */}
            {/* handleSubmit(onSubmit): react-hook-form의 handleSubmit으로 감싸서 */}
            {/* 유효성 검증 후 onSubmit 함수 실행 */}
            <Form onSubmit={handleSubmit(onSubmit)}>
                {/* Email 입력 필드 */}
                <Input
                    // type="email": 이메일 형식 유효성 검증 (@ 포함 여부 등)
                    type={"email"}
                    // placeholder: 입력 필드가 비어있을 때 표시되는 안내 텍스트
                    placeholder={"Email"}
                    // {...register("email", {...})}: react-hook-form에 이 input을 등록
                    // "email": 폼 데이터의 키 이름 (data.email로 접근)
                    // { required: "..." }: 유효성 검증 규칙
                    //   email이 비어있으면 지정한 에러 메시지 표시
                    {...register("email", {
                        required: "이메일은 필수값입니다.",
                    })}
                />
                {/* 조건부 렌더링: errors.email이 존재하면 에러 메시지 표시 */}
                {errors.email && <ErrorText>{errors.email.message}</ErrorText>}

                {/* Password 입력 필드 */}
                <Input
                    placeholder={"Password"}
                    // type="password": 입력 내용을 점(●)으로 가려서 표시
                    type={"password"}
                    // required: HTML5 기본 유효성 검증 (비어있으면 제출 불가)
                    required
                    // password 필드를 폼에 등록
                    {...register("password", { required: "비밀번호를 입력해주세요." })}
                />
                {/* password 필드 에러 메시지 */}
                {errors.password && <ErrorText>{errors.password.message}</ErrorText>}

                {/* 제출 버튼 */}
                <Button
                    // disabled: 버튼 비활성화 여부
                    // isSubmitting이 true(제출 중)일 때 버튼을 비활성화하여
                    // 중복 제출을 방지 (여러 번 로그인 시도 방지)
                    disabled={isSubmitting}>
                    {/* 삼항 연산자: 제출 중일 때와 아닐 때 다른 텍스트 표시 */}
                    {/* isSubmitting이 true면 "Loading..." 표시 */}
                    {/* isSubmitting이 false면 "Log in" 표시 */}
                    {isSubmitting ? "Loading..." : "Log in"}
                </Button>
            </Form>

            {/* 전체 폼 에러 메시지 (root error) */}
            {/* Firebase 로그인 실패 등 특정 필드가 아닌 전체 에러 표시 */}
            {/* 예: "사용자 정보가 없습니다.", "로그인이 실패되었습니다." 등 */}
            {errors.root && <ErrorText>{errors.root.message}</ErrorText>}

            {/* Switcher: 회원가입 페이지로 이동하는 링크 */}
            <Switcher>
                {/* 일반 텍스트 */}
                Don't have an account?
                {/* Link: React Router의 페이지 이동 컴포넌트 */}
                {/* to="/createAccount": 클릭 시 /createAccount 경로로 이동 */}
                {/* &rarr;: HTML 엔티티 코드로 오른쪽 화살표(→) 표시 */}
                <Link to={"/createAccount"}>Create one &rarr;</Link>
            </Switcher>
        </Wrapper>
    );
}

// Login 컴포넌트를 다른 파일에서 import할 수 있도록 내보냄
export default Login;
