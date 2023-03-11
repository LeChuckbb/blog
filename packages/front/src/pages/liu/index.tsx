import { SubmitHandler, SubmitErrorHandler, useForm } from "react-hook-form";
import styled from "@emotion/styled";
import WithHeader from "../../layout/WithHeader";
import TextField from "design/src/stories/TextField";
import { Button } from "design/src/stories/Button";
import useMyToast from "../../hooks/useMyToast";
import { ToastContainer } from "react-toastify";
import { useLoginMutation } from "../../hooks/query/useLoginMutation";
import { NextSeo } from "next-seo";

export type LoginForm = {
  id: string;
  password: string;
};

const Login = () => {
  const { register, handleSubmit, getValues } = useForm<LoginForm>({
    defaultValues: {
      id: "",
      password: "",
    },
  });
  const { callToast } = useMyToast();
  const { mutate: loginAPI } = useLoginMutation();

  const onValidSubmit: SubmitHandler<LoginForm> = async (data: LoginForm) => {
    loginAPI(data);
  };

  const onInvalidSubmit: SubmitErrorHandler<LoginForm> = async (error) => {
    error?.id?.message && callToast(error.id.message, "Id");
    error?.password?.message && callToast(error.password.message, "password");
  };

  return (
    <>
      <Container>
        <NextSeo noindex={true} nofollow={true} />
        <Form
          autoComplete="new-password"
          onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
        >
          <TextField id="id" getValues={getValues} variant="filled">
            <TextField.InputBox>
              <TextField.Input
                register={register}
                registerOptions={{ required: "id를 입력해주세요" }}
              />
              <TextField.Label label="ID" />
            </TextField.InputBox>
          </TextField>
          <TextField id="password" getValues={getValues} variant="filled">
            <TextField.InputBox>
              <TextField.Input
                type="password"
                register={register}
                registerOptions={{ required: "password를 입력해주세요" }}
              />
              <TextField.Label label="password" />
            </TextField.InputBox>
          </TextField>

          <Button type="submit">로그인</Button>
        </Form>
      </Container>
      <ToastContainer />
    </>
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
  gap: 24px;
  width: 400px;
`;

export default Login;
