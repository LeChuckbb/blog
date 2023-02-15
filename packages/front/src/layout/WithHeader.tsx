import styled from "@emotion/styled";
import Footer from "./Footer";
import Header from "./Header";
import React from "react";
import LocalErrorBoundary from "../hooks/error/LocalErrorBoundary";
import useScrollDirection from "../hooks/useScrollDirection";

type Props = {
  children: React.ReactNode;
};

const WithHeader = ({ children }: Props) => {
  const { scrollDirection } = useScrollDirection();

  return (
    <Container>
      <LocalErrorBoundary>
        {/* <Suspense fallback={<p>loading...</p>}> */}
        <Header scrollDirection={scrollDirection} />
        {/* </Suspense> */}
      </LocalErrorBoundary>
      <div style={{ marginTop: "64px" }}>{children}</div>
      {/* <Footer /> */}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default WithHeader;
