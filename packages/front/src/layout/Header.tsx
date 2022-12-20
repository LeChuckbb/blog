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
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  width: min(1024px, 100%);
  ${(props) => props.theme.mq[1]} {
    width: 1024px;
  }
  ${(props) => props.theme.mq[2]} {
    width: 1376px;
  }
  ${(props) => props.theme.mq[3]} {
    width: 1728px;
  }
`;

export default Header;
