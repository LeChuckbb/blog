import WithHeader from "../layout/WithHeader";
import styled from "@emotion/styled";

const NotFoundPage = () => {
  return (
    <Container>
      <TextWrapper>
        <p>404 Not Found.</p>
        <p>존재하지 않는 페이지 URL입니다.</p>
      </TextWrapper>
    </Container>
  );
};

NotFoundPage.getLayout = function getLayout(page: React.ReactElement) {
  return <WithHeader>{page}</WithHeader>;
};

export default NotFoundPage;

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
