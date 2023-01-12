import { SubmitHandler, useForm } from "react-hook-form";
import styled from "@emotion/styled";
import { loginAPI } from "../../apis/authApi";
import axios, { isAxiosError, AxiosError } from "axios";
import axiosInstance from "../../apis";
import { useRouter } from "next/router";
import WithHeader from "../../layout/WithHeader";

export type LoginForm = {
  id: string;
  password: string;
};

export class MyError extends AxiosError {
  constructor(message: string) {
    super(message);
  }
}

class AppError {
  code: string;
  message: string;
  constructor(code: string, message: any) {
    this.message = message;
    this.code = code;
  }
}
interface CustomError {
  code: string;
  message: string;
}

const onClickBtnHandler = () => {
  console.log("onClick!");
};

const Login = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      id: "",
      password: "",
    },
  });

  const onValidSubmit: SubmitHandler<LoginForm> = async (data: LoginForm) => {
    try {
      console.log("onValid");
      console.log(data);
      const result = await loginAPI(data);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${result.data.accessToken}`;
      router.push("/");
    } catch (err) {
      console.log("catch error");
      console.log(err);
      if (err instanceof AxiosError) {
        const data = err?.response?.data as CustomError;
        console.log(data);
        if (data.code === "AUE001") console.log("HERE");
      }
    }
  };

  const onInvalidSubmit = async () => {
    console.log("onInvalid");
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}>
        <InputWrapper>
          <label htmlFor="id">ID</label>
          <input id="id" type="text" {...register("id")} />
        </InputWrapper>

        <InputWrapper>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" {...register("password")} />
        </InputWrapper>

        <input type="submit" value="로그인" />
      </Form>
    </Container>
  );
};

Login.getLayout = function getLayout(page: React.ReactElement) {
  return <WithHeader>{page}</WithHeader>;
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 64px);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 400px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export default Login;
