import styled from "@emotion/styled";

const Header: React.FC = () => {
  return (
    <Container>
      <div>
        <span>Lechuck</span>
      </div>
      <div>
        <button>야간모드</button>
      </div>
    </Container>
  );
};

const Container = styled.div`
  padding: 16px;
  background-color: blue;
  width: min(1200px, 100%);
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default Header;
