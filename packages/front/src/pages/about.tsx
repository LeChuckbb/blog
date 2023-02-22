import WithHeader from "../layout/WithHeader";
import styled from "@emotion/styled";

const About = () => {
  return (
    <Container className="Container">
      <ContentWrapper>
        Junior Frontend Developer
        <p>글로 생각을 정리하고자 만든 블로그입니다. </p>
        <p>게시글에는 잘못된 정보가 포함되어 있을 수 있습니다.</p>
        <p>github: https://github.com/LeChuckbb</p>
        <p>E-mail: pjwts9412@gmail.com</p>
      </ContentWrapper>
    </Container>
  );
};

const Container = styled.div`
  background-color: ${(props) =>
    props.theme.colors.neutralVariant.surfaceVariant};
  min-width: 1024px;
  width: 100%;
  height: calc(100vh - 64px);
  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  padding: 64px;
`;

About.getLayout = function getLayout(page: React.ReactElement) {
  return <WithHeader>{page}</WithHeader>;
};

export default About;
