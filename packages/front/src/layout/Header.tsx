import styled from "@emotion/styled";
import Link from "next/link";
import { useIsAuthQuery } from "../hooks/query/useIsAuthQuery";
import { ErrorBoundary } from "react-error-boundary";
// import { logoutAPI } from "../apis/authApi";
import { useLogoutQuery } from "../hooks/query/useLogoutQuery";

const Header: React.FC = () => {
  const { data } = useIsAuthQuery();
  const { refetch } = useLogoutQuery();

  const onClickLogoutHandler = async () => {
    console.log("logout");
    const response = await refetch();
    console.log(response);
  };

  console.log(data);

  return (
    // <ErrorBoundary FallbackComponent={() => <div>hi</div>}>
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
    // </ErrorBoundary>
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
