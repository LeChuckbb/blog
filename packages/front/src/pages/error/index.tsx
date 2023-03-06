import WithHeader from "../../layout/WithHeader";
import styled from "@emotion/styled";

const ErrorPage = () => {
  return (
    <Container>
      <TextWrapper>
        <p>알 수 없는 오류가 발생했습니다..</p>
        <p>잠시 후 다시 시도해주세요.</p>
      </TextWrapper>
    </Container>
  );
};

ErrorPage.getLayout = function getLayout(page: React.ReactElement) {
  return <WithHeader>{page}</WithHeader>;
};

export default ErrorPage;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100vh - 64px);
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  font-size: 32px;
`;
