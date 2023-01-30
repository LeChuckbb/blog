import styled from "@emotion/styled";
import Footer from "./Footer";
import Header from "./Header";
import React, { Suspense } from "react";
import { HeaderErrorBoundary } from "../hooks/\berror/HeaderErrorBoundary";

type WithHeaderProps = {
  children: React.ReactNode;
};

const WithHeader = ({ children }: WithHeaderProps) => {
  return (
    <Container>
      <HeaderErrorBoundary>
        <Suspense fallback={<p>loading...</p>}>
          <Header />
        </Suspense>
      </HeaderErrorBoundary>
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
