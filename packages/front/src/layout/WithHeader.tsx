import styled from "@emotion/styled";
import Footer from "./Footer";
import Header from "./Header";
import React from "react";
import LocalErrorBoundary from "../hooks/error/LocalErrorBoundary";
import useScrollDirection from "design/src/hooks/useScrollDirection";

type Props = {
  children: React.ReactNode;
};

const WithHeader = ({ children }: Props) => {
  const { scrollDirection } = useScrollDirection();

  return (
    <Container className="Conteinasd">
      <LocalErrorBoundary>
        {/* <Suspense fallback={<p>loading...</p>}> */}
        <Header scrollDirection={scrollDirection} />
        {/* </Suspense> */}
      </LocalErrorBoundary>
      <ContentContainer>{children}</ContentContainer>
      <Footer />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentContainer = styled.div`
  margin-top: 64px;
  min-height: 100vh;
  width: 100%;
  ${(props) => props.theme.mq[1]} {
    width: unset;
  }
`;

export default WithHeader;
