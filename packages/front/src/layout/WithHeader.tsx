import styled from "@emotion/styled";
import Footer from "./Footer";
import Header from "./Header";
import React, { Suspense, useEffect, useState } from "react";
import LocalErrorBoundary from "../hooks/error/LocalErrorBoundary";
import useScrollDirection from "../hooks/useScrollDirection";

type Props = {
  children: React.ReactNode;
};

const WithHeader = ({ children }: Props) => {
  const [direction, setDirection] = useState("");
  const { scrollDirection } = useScrollDirection();

  // useEffect(() => {
  //   const handleScroll = (event: any) => {
  //     console.log("마우스 스크롤 이벤트");
  //     console.log(event);
  //     console.log(window.scrollY);
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  const handleScroll = (event: React.UIEvent) => {
    console.log("마우스 스크롤 이벤트");
    console.log(event);
    // if (event.deltaY > 0) {
    //   setDirection("down");
    //   console.log("down");
    // } else {
    //   setDirection("up");
    //   console.log("up");
    // }
  };

  const handleWheel = (event: React.WheelEvent) => {
    console.log("마우스 휠 이벤트");
    console.log(event);
    // if (event.deltaY > 0) {
    //   setDirection("down");
    //   console.log("down");
    // } else {
    //   setDirection("up");
    //   console.log("up");
    // }
  };

  return (
    <Container>
      <LocalErrorBoundary>
        {/* <Suspense fallback={<p>loading...</p>}> */}
        <Header scrollDirection={scrollDirection} />
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
