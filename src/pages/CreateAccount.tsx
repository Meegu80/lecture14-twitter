import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.ts";

const Wrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 420px;
    padding: 50px 0;
`;

type FormValues = {
    name: string;
    email: string;
    password: string;
};

const Title = styled.h1`
    font-size: 42px;
`;

const Form = styled.form`
    margin-top: 50px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Input = styled.input`
    padding: 10px 20px;
    border-radius: 10px;
    border: none;
    font-size: 16px;
`;

const ErrorText = styled.span`
    font-weight: 600;
    color: tomato;
`;

const Switcher = styled.span`
    margin-top: 20px;

    a {
        color: #1d9bf0;
    }
`;

const Button = styled.button`
    padding: 10px 20px;
    border-radius: 10px;
    border: none;
    font-size: 16px;
    cursor: pointer;
    background-color: #1d9bf0;
    color: white;
    &:hover {
        opacity: 0.8;
    }
`;

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
        // react-hook-form이 관리하고 있는 errors객체에  기록되어 있는 내용을 삭제해줌
        clearErrors();

        try {
            //firebase에서 관리하는 사용자 객체를 만들어서
            const credentials = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password,
            );

            // 그 객체를 통해 firebase 기록
            await updateProfile(credentials.user, {
                displayName: data.name,
            });
            navigate("/");
        } catch (e) {
            console.log(e);
            setError("root", { message: "계정 생성에 실패하였습니다. " });
        }
    };

    return (
        <Wrapper>
            <Title>Join X</Title>
            <Form>
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
