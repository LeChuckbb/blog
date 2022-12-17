import styled from "@emotion/styled";
import Footer from "./Footer";
import Header from "./Header";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
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

export default Layout;
