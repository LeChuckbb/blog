import styled from "@emotion/styled";
import Footer from "./Footer";
import Header from "./Header";
import React from "react";

type Prop = {
  children: React.ReactNode;
};

const WithHeader = ({ children }: Prop) => {
  return (
    <Container>
      <Header />
      {children}
      <Footer />
    </Container>
  );
};

const Container = styled.div`
  background-color: red;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default WithHeader;
