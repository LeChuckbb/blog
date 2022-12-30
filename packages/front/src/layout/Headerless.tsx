import styled from "@emotion/styled";

type Props = {
  children: React.ReactNode;
};

const Headerless = ({ children }: Props) => {
  return <Container>{children}</Container>;
};

const Container = styled.div`
  background-color: red;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default Headerless;
