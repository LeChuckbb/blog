import WithHeader from "../layout/WithHeader";
import styled from "@emotion/styled";
import { NextSeo } from "next-seo";

const About = () => {
  return (
    <Container className="Container">
      <NextSeo noindex={true} nofollow={true} />
      <ContentWrapper>
        {/* Junior Frontend Developer
        <p>github: https://github.com/LeChuckbb</p>
        <p>E-mail: pjwts9412@gmail.com</p> */}
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
