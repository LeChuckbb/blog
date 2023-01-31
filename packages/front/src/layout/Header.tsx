import styled from "@emotion/styled";
import Link from "next/link";
import { useIsAuthQuery } from "../hooks/query/useIsAuthQuery";
import { useLogoutQuery } from "../hooks/query/useLogoutQuery";

const Header = () => {
  const { data } = useIsAuthQuery();
  const { refetch } = useLogoutQuery();

  const onClickLogoutHandler = async () => {
    const response = await refetch();
    if (response.data?.status === 200) {
      window.location.href = "/";
    }
  };

  console.log(data);

  return (
    <Container>
      <div>
        <span>
          <Link href="http://localhost:3000/">Lechuck</Link>
        </span>
      </div>
      <RightWrapper>
        {data?.status === 200 && (
          <>
            <Link href="http://localhost:3000/post/write">
              <Button>새 글 작성</Button>
            </Link>
            <button onClick={onClickLogoutHandler}>로그아웃</button>
          </>
        )}
        <button>야간모드</button>
      </RightWrapper>
    </Container>
  );
};

const Container = styled.div`
  padding: 16px;
  background-color: aqua;
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

const Button = styled.button`
  border: 1px solid black;
  transition: all 0.125s ease-in;
  padding: 8px;
  border-radius: 16px;
  :hover {
    background-color: black;
    color: white;
  }
`;

const RightWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

export default Header;
