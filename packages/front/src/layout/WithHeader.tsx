import styled from "@emotion/styled";
import Footer from "./Footer";
import Header from "./Header";
import React, { Suspense } from "react";
import LocalErrorBoundary from "../hooks/error/LocalErrorBoundary";

type Props = {
  children: React.ReactNode;
};

const WithHeader = ({ children }: Props) => {
  return (
    <Container>
      <LocalErrorBoundary>
        {/* <Suspense fallback={<p>loading...</p>}> */}
        <Header />
        {/* </Suspense> */}
      </LocalErrorBoundary>
      {children}
      <Footer />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default WithHeader;
