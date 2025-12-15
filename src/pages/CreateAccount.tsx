import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase.ts";
import { Button, ErrorText, Form, Input, Switcher, Title, Wrapper } from "../styles/AuthStyles.tsx";

type FormValues = {
    name: string;
    email: string;
    password: string;
};

function CreateAccount() {
    const navigate = useNavigate();

    // errors 객체는 errors.root => 이건 대표 에러가 기록되는 프로퍼티
    //              errors.타입에서 지정해준 프로퍼티명
    //              errors.name , errors.email , errors.password
    //              실제 에러 메세지는 이 프로퍼티들이 갖고있는 .message에 접근 사용
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        clearErrors,
    } = useForm<FormValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: FormValues) => {
        // react-hook-form이 관리하고 있는 errors 객체에 기록되어 있는 내용을 삭제해줌
        clearErrors();

        // firebase에 실질적으로 받은 input 내용들을 전달 해줘야 함
        try {
            // firebase에서 관리하는 사용자 객체를 만들어서
            const credentials = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password,
            );

            // 그 객체를 통해 firebase에 기록
            await updateProfile(credentials.user, {
                displayName: data.name,
            });
            navigate("/");
        } catch (e) {
            console.log(e);
            setError("root", { message: "계정 생성에 실패하였습니다."});
        }
    };

    return (
        <Wrapper>
            <Title>Join X</Title>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    placeholder={"Name"}
                    required
                    {...register("name", { required: "이름을 입력해주세요." })}
                />
                {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
                <Input
                    placeholder={"Email"}
                    type={"email"}
                    required
                    {...register("email", { required: "이메일을 입력해주세요." })}
                />
                {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
                <Input
                    placeholder={"Password"}
                    type={"password"}
                    required
                    {...register("password", { required: "비밀번호를 입력해주세요." })}
                />
                {errors.password && <ErrorText>{errors.password.message}</ErrorText>}

                <Button disabled={isSubmitting}>
                    {isSubmitting ? "Loading..." : "Create Account"}
                </Button>
            </Form>
            {errors.root && <ErrorText>{errors.root.message}</ErrorText>}

            <Switcher>
                Already have an account? <Link to={"/login"}>Log in &rarr;</Link>
            </Switcher>
        </Wrapper>
    );
}

export default CreateAccount;