import { Button, ErrorText, Form, Input, Switcher, Title, Wrapper } from "../styles/AuthStyles.tsx";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.ts";
import { FirebaseError } from "firebase/app";

type FormValues = {
    email: string;
    password: string;
};

function Login() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<FormValues>();

    const onSubmit = async (data: FormValues) => {
        try {
            // 들어온 input 데이터들로 firebase에 로그인 요청
            await signInWithEmailAndPassword(auth, data.email, data.password);
            navigate("/");
        } catch (e) {
            // 만약, 이 error가 Firebase의 에러라면 그 에러 내용을 출력해주고
            // 만약, 이 error가 Firebase의 에러가 아닌 다른 방식의 에러라면 string 출력

            // instanceof : 지정된 객체가 이 타입이라면 true, 아니라면 false
            if (e instanceof FirebaseError) {
                if (e.message === "Firebase: Error (auth/invalid-credential)") {
                    setError("root", { message: "사용자 정보가 없습니다." });
                } else {
                    setError("root", { message: e.message });
                }
            } else {
                setError("root", { message: "로그인이 실패되었습니다." });
            }
        }
    };

    return (
        <Wrapper>
            <Title>Login</Title>

            <Form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    type={"email"}
                    placeholder={"Email"}
                    {...register("email", {
                        required: "이메일은 필수값입니다.",
                    })}
                />
                {errors.email && <ErrorText>{errors.email.message}</ErrorText>}

                <Input
                    placeholder={"Password"}
                    type={"password"}
                    required
                    {...register("password", { required: "비밀번호를 입력해주세요." })}
                />
                {errors.password && <ErrorText>{errors.password.message}</ErrorText>}

                <Button disabled={isSubmitting}>{isSubmitting ? "Loading..." : "Log in"}</Button>
            </Form>

            {errors.root && <ErrorText>{errors.root.message}</ErrorText>}

            <Switcher>
                Don't have an account? <Link to={"/createAccount"}>Create one &rarr;</Link>
            </Switcher>
        </Wrapper>
    );
}

export default Login;
