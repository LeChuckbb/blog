import styled from "@emotion/styled";
import Link from "next/link";
import { useIsAuthQuery } from "../hooks/query/useIsAuthQuery";
import { useLogoutQuery } from "../hooks/query/useLogoutQuery";
import IconDark from "../../public/icons/dark_mode.svg";
import IconLight from "../../public/icons/light_mode.svg";
import IconCreateNewPost from "../../public/icons/create.svg";
import IconLogout from "../../public/icons/logout.svg";
import lechuckLogo from "../../public/lechuck.jpeg";
import Image from "next/image";
import useDarkMode from "../hooks/useDarkmode";

const Header = () => {
  const { data } = useIsAuthQuery();
  const { refetch } = useLogoutQuery();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  // const isDarkMode = true;
  // const toggleDarkMode = () => console.log("hi");

  const onClickLogoutHandler = async () => {
    const response = await refetch();
    if (response.data?.status === 200) {
      window.location.href = "/";
    }
  };

  return (
    <Container>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <div style={{ width: "48px", height: "48px" }}>
          <Image src={lechuckLogo} style={{ borderRadius: "50%" }} />
        </div>
        <Link href="http://localhost:3000/">LeChuck</Link>
      </div>
      <RightWrapper>
        {data?.status === 200 && (
          <>
            <Link href="http://localhost:3000/post/write">
              <IconContainerButton>
                <IconCreateNewPost />
              </IconContainerButton>
            </Link>
            <IconContainerButton onClick={onClickLogoutHandler}>
              <IconLogout />
            </IconContainerButton>
          </>
        )}
        <IconContainerButton onClick={() => toggleDarkMode()}>
          {isDarkMode ? <IconDark /> : <IconLight />}
        </IconContainerButton>
      </RightWrapper>
    </Container>
  );
};

const Container = styled.div`
  padding: 16px;
  background-color: ${(props) => props.theme.colors.primary.primary};
  color: ${(props) => props.theme.colors.primary.onPrimary};
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

const IconContainerButton = styled.button`
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: 0.1s all;
  :hover {
    background-color: ${(props) => props.theme.colors.secondary.container};
  }
`;

const RightWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

export default Header;
