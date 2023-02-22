import styled from "@emotion/styled";
import Link from "next/link";
import { useIsAuthQuery } from "../hooks/query/useIsAuthQuery";
import { useLogoutQuery } from "../hooks/query/useLogoutQuery";
import IconDark from "../../public/icons/dark_mode.svg";
import IconLight from "../../public/icons/light_mode.svg";
import IconCreateNewPost from "../../public/icons/create.svg";
import IconLogout from "../../public/icons/logout.svg";
import IconInfo from "../../public/icons/info.svg";
import useDarkMode from "../hooks/useDarkMode";
import IconButton from "design/src/stories/IconButton";

const Header = ({ scrollDirection }: any) => {
  const { data } = useIsAuthQuery();
  const { refetch } = useLogoutQuery();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const onClickLogoutHandler = async () => {
    const response = await refetch();
    if (response.data?.status === 200) {
      window.location.href = "/";
    }
  };

  return (
    <Container scrollDirection={scrollDirection}>
      <InnerContainer className="HeaderContainer">
        <LogoWrapper>
          <Link href="http://localhost:3000/">LeChuck</Link>
        </LogoWrapper>
        <RightWrapper>
          {data?.status === 200 && (
            <>
              <Link href="http://localhost:3000/post/write">
                <a>
                  <IconButton tooltip="새 글 작성">
                    <IconCreateNewPost />
                  </IconButton>
                </a>
              </Link>
              <IconButton onClick={onClickLogoutHandler} tooltip="로그아웃">
                <IconLogout />
              </IconButton>
            </>
          )}
          <Link href="http://localhost:3000/about">
            <a>
              <IconButton tooltip="About">
                <IconInfo />
              </IconButton>
            </a>
          </Link>
          <IconButton onClick={toggleDarkMode} tooltip="테마 전환">
            {isDarkMode ? <IconDark /> : <IconLight />}
          </IconButton>
        </RightWrapper>
      </InnerContainer>
    </Container>
  );
};

interface ContainerProps {
  scrollDirection: string;
}

const Container = styled.div<ContainerProps>`
  width: 100%;
  position: fixed;
  z-index: 100;
  transition: all 0.3s;
  background: ${(props) => props.theme.colors.primary.primary};
  transform: ${(props) =>
    props.scrollDirection === "down" && "translateY(-64px)"};
`;

const InnerContainer = styled.div`
  padding: 16px;
  background-color: ${(props) => props.theme.colors.primary.primary};
  color: ${(props) => props.theme.colors.primary.onPrimary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  width: min(1024px, 100%);
  margin: 0 auto;
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

const LogoWrapper = styled.div`
  display: "flex";
  align-items: "center";
  gap: "4px";
  & a {
    color: ${(props) => props.theme.colors.primary.onPrimary};
    font-size: ${(props) => props.theme.fonts.headline.small.size};
    font-family: ${(props) => props.theme.fonts.family.brand};
  }
`;

const RightWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

export default Header;
