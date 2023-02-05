import styled from "@emotion/styled";

const Footer: React.FC = () => {
  return (
    <Container>
      {/*  */}
      {/*  */}
      Footer
    </Container>
  );
};

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.primary.primary};
  color: ${(props) => props.theme.colors.primary.onPrimary};

  width: 100%;
`;

export default Footer;
