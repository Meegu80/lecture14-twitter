// Link: React Router의 페이지 이동 컴포넌트 (<a> 태그 대신 사용)
// 페이지 새로고침 없이 SPA 방식으로 페이지 이동
// useNavigate: 프로그래밍 방식으로 페이지를 이동하는 훅
// navigate("/경로")를 호출하면 해당 페이지로 이동
import { Link, useNavigate } from "react-router";

// useForm: react-hook-form 라이브러리의 핵심 훅
// 폼 상태 관리, 유효성 검증, 에러 처리를 간편하게 해주는 강력한 도구
import { useForm } from "react-hook-form";

// createUserWithEmailAndPassword: Firebase Auth에서 이메일/비밀번호로 새 계정을 생성하는 함수
// updateProfile: Firebase Auth에서 사용자 프로필 정보(이름, 사진 등)를 업데이트하는 함수
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

// auth: Firebase Authentication 인스턴스 (firebase.ts에서 생성한 객체)
// Firebase 인증 서비스에 접근하기 위한 연결 객체
import { auth } from "../firebase.ts";

// 스타일 컴포넌트들을 한 번에 import
// Button, ErrorText, Form, Input 등 인증 페이지에서 사용하는 공통 스타일들
import { Button, ErrorText, Form, Input, Switcher, Title, Wrapper } from "../styles/AuthStyles.tsx";

// FormValues: 폼에서 관리할 데이터의 타입 정의
// react-hook-form이 이 타입을 기반으로 폼 데이터를 타입 체크
type FormValues = {
    // name: 사용자 이름 (문자열)
    name: string;
    // email: 이메일 주소 (문자열)
    email: string;
    // password: 비밀번호 (문자열)
    password: string;
};

// CreateAccount: 회원가입 페이지 컴포넌트
function CreateAccount() {
    // navigate: 페이지 이동을 위한 함수
    // 회원가입 성공 후 navigate("/")를 호출하여 홈으로 이동
    const navigate = useNavigate();

    // errors 객체는 errors.root => 이건 대표 에러가 기록되는 프로퍼티
    //              errors.타입에서 지정해준 프로퍼티명
    //              errors.name , errors.email , errors.password
    //              실제 에러 메세지는 이 프로퍼티들이 갖고있는 .message에 접근 사용

    // useForm: react-hook-form의 핵심 훅, 폼 관리에 필요한 모든 기능 제공
    const {
        // register: input 요소를 폼에 등록하는 함수
        // {...register("name")} 형태로 사용하여 input을 폼에 연결
        // 이렇게 하면 자동으로 value, onChange, onBlur 등이 설정됨
        register,

        // handleSubmit: 폼 제출 이벤트를 처리하는 함수
        // 유효성 검증을 자동으로 수행하고, 통과하면 전달받은 콜백 함수를 실행
        handleSubmit,

        // formState: 폼의 현재 상태를 담고 있는 객체
        formState: {
            // errors: 각 필드의 유효성 검증 에러를 담는 객체
            // errors.name, errors.email, errors.password 형태로 접근
            errors,

            // isSubmitting: 현재 폼이 제출 중인지 여부 (true/false)
            // 제출 중일 때 버튼을 비활성화하거나 로딩 표시를 하는데 사용
            isSubmitting,
        },

        // setError: 수동으로 에러를 설정하는 함수
        // setError("root", { message: "에러 메시지" }) 형태로 사용
        // Firebase 인증 실패 시 에러 메시지를 표시하는데 사용
        setError,

        // clearErrors: 모든 에러를 삭제하는 함수
        // 폼 제출 전에 이전 에러들을 깨끗하게 지우는데 사용
        clearErrors,
    } = useForm<FormValues>({
        // defaultValues: 폼 필드의 초기값 설정
        // 컴포넌트가 처음 렌더링될 때 각 input의 초기값
        defaultValues: {
            // name 입력 필드의 초기값: 빈 문자열
            name: "",
            // email 입력 필드의 초기값: 빈 문자열
            email: "",
            // password 입력 필드의 초기값: 빈 문자열
            password: "",
        },
    });

    // onSubmit: 폼이 제출될 때 실행되는 비동기 함수
    // data 매개변수: FormValues 타입의 폼 데이터 (name, email, password)
    // react-hook-form이 유효성 검증을 통과한 데이터만 이 함수로 전달
    const onSubmit = async (data: FormValues) => {
        // react-hook-form이 관리하고 있는 errors 객체에 기록되어 있는 내용을 삭제해줌
        // 새로운 제출 시도 전에 이전 에러 메시지들을 모두 지움
        clearErrors();

        // firebase에 실질적으로 받은 input 내용들을 전달 해줘야 함

        // try-catch: 에러 처리 구문
        // Firebase 인증 과정에서 발생할 수 있는 에러를 잡아서 처리
        try {
            // firebase에서 관리하는 사용자 객체를 만들어서

            // createUserWithEmailAndPassword: Firebase에 새 사용자 계정 생성
            // 매개변수 1: auth - Firebase Authentication 인스턴스
            // 매개변수 2: data.email - 사용자가 입력한 이메일
            // 매개변수 3: data.password - 사용자가 입력한 비밀번호
            // 반환값: credentials - 생성된 사용자 정보를 담은 객체
            // await: 비동기 작업이 완료될 때까지 기다림
            const credentials = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password,
            );

            // 그 객체를 통해 firebase에 기록
            // updateProfile(사용자정보, 함수)

            // updateProfile: Firebase 사용자 프로필 정보 업데이트
            // 매개변수 1: credentials.user - 방금 생성된 사용자 객체
            // 매개변수 2: 업데이트할 프로필 정보 객체
            //   displayName: 사용자의 표시 이름 (data.name)
            //   photoURL도 여기에 추가 가능 (프로필 사진 URL)
            // 계정 생성 직후에는 이메일/비밀번호만 설정되므로
            // 이름 같은 추가 정보는 updateProfile로 별도로 설정해야 함
            await updateProfile(credentials.user, {
                displayName: data.name,
            });

            // 회원가입 성공 후 홈 페이지("/")로 이동
            // navigate 함수로 페이지 새로고침 없이 라우팅
            navigate("/");
        } catch (e) {
            // catch: try 블록에서 에러가 발생하면 실행
            // e: 발생한 에러 객체

            // 에러 내용을 콘솔에 출력 (디버깅용)
            // 실제 프로덕션에서는 제거하거나 로깅 서비스로 전송
            console.log(e);

            // setError: 에러 메시지를 폼에 설정
            // "root": 전체 폼에 대한 에러 (특정 필드가 아닌 일반 에러)
            // { message: "..." }: 사용자에게 보여줄 에러 메시지
            // 이 에러는 폼 하단에 표시됨 (errors.root.message)
            setError("root", { message: "계정 생성에 실패하였습니다." });
        }
    };

    // JSX 반환: 실제 화면에 렌더링될 회원가입 폼
    return (
        // Wrapper: 전체 회원가입 페이지를 감싸는 컨테이너
        <Wrapper>
            {/* Title: 페이지 제목 "Join X" */}
            <Title>Join X</Title>

            {/* Form: 회원가입 폼 요소 */}
            {/* onSubmit: 폼 제출 시 실행될 함수 */}
            {/* handleSubmit(onSubmit): react-hook-form의 handleSubmit으로 감싸서 */}
            {/* 유효성 검증 후 onSubmit 함수 실행 */}
            <Form onSubmit={handleSubmit(onSubmit)}>
                {/* Name 입력 필드 */}
                <Input
                    // placeholder: 입력 필드가 비어있을 때 표시되는 안내 텍스트
                    placeholder={"Name"}
                    // required: HTML5 기본 유효성 검증 (비어있으면 제출 불가)
                    required
                    // {...register("name", {...})}: react-hook-form에 이 input을 등록
                    // "name": 폼 데이터의 키 이름 (data.name으로 접근)
                    // { required: "..." }: 유효성 검증 규칙
                    //   required가 충족되지 않으면 지정한 에러 메시지 표시
                    // ...register()는 onChange, onBlur, ref 등을 자동으로 설정
                    {...register("name", { required: "이름을 입력해주세요." })}
                />
                {/* 조건부 렌더링: errors.name이 존재하면 에러 메시지 표시 */}
                {/* &&: 좌측이 true일 때만 우측을 렌더링 (short-circuit evaluation) */}
                {/* errors.name.message: register에서 지정한 에러 메시지 */}
                {errors.name && <ErrorText>{errors.name.message}</ErrorText>}

                {/* Email 입력 필드 */}
                <Input
                    placeholder={"Email"}
                    // type="email": 이메일 형식 유효성 검증 (@ 포함 여부 등)
                    type={"email"}
                    required
                    // email 필드를 폼에 등록
                    {...register("email", { required: "이메일을 입력해주세요." })}
                />
                {/* email 필드 에러 메시지 */}
                {errors.email && <ErrorText>{errors.email.message}</ErrorText>}

                {/* Password 입력 필드 */}
                <Input
                    placeholder={"Password"}
                    // type="password": 입력 내용을 점(●)으로 가려서 표시
                    type={"password"}
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
                    // 중복 제출을 방지
                    disabled={isSubmitting}>
                    {/* 삼항 연산자: 제출 중일 때와 아닐 때 다른 텍스트 표시 */}
                    {/* isSubmitting이 true면 "Loading..." 표시 */}
                    {/* isSubmitting이 false면 "Create Account" 표시 */}
                    {isSubmitting ? "Loading..." : "Create Account"}
                </Button>
            </Form>

            {/* 전체 폼 에러 메시지 (root error) */}
            {/* Firebase 인증 실패 등 특정 필드가 아닌 전체 에러 표시 */}
            {errors.root && <ErrorText>{errors.root.message}</ErrorText>}

            {/* Switcher: 로그인 페이지로 이동하는 링크 */}
            <Switcher>
                {/* 일반 텍스트 */}
                Already have an account?
                {/* Link: React Router의 페이지 이동 컴포넌트 */}
                {/* to="/login": 클릭 시 /login 경로로 이동 */}
                {/* &rarr;: HTML 엔티티 코드로 오른쪽 화살표(→) 표시 */}
                <Link to={"/login"}>Log in &rarr;</Link>
            </Switcher>
        </Wrapper>
    );
}

// CreateAccount 컴포넌트를 다른 파일에서 import할 수 있도록 내보냄
export default CreateAccount;
