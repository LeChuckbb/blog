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
import { useEffect } from "react";
import { useRouter } from "next/router";

interface HeaderProps {
  scrollDirection: string;
}

const Header = ({ scrollDirection }: HeaderProps) => {
  const { data } = useIsAuthQuery();
  const { refetch } = useLogoutQuery();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const router = useRouter();

  const onClickLogoutHandler = async () => {
    const response = await refetch();
    if (response.data?.status === 200) {
      window.location.href = "/";
    }
  };

  useEffect(() => {
    if (router.pathname === "/liu") {
      if (data?.status === 200)
        // isAuth가 200을 반환 -> 로그인 완료된 것 (토큰이 모두 유효한 것) -> /로 리디렉트
        router.push("/");
    }
  }, [data, router]);

  return (
    <Container scrollDirection={scrollDirection}>
      <InnerContainer>
        <LogoWrapper>
          <Link href="/">LeChuck</Link>
        </LogoWrapper>
        <RightWrapper>
          {data?.status === 200 && (
            <>
              <Link href="/post/write">
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
          <Link href="/about">
            <a>
              <IconButton tooltip="소개">
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

const Container = styled.div<HeaderProps>`
  width: 100%;
  position: fixed;
  z-index: 100;
  transition: all 0.1s;
  transition-timing-function: cubic-bezier(0, 0, 0.22, 0.99);
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
  ${(props) => props.theme.mq[3]} {
    width: 1376px;
  }
  ${(props) => props.theme.mq[4]} {
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
