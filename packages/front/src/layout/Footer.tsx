import styled from "@emotion/styled";
import IconButton from "design/src/stories/IconButton";
import IconGithub from "../../public/icons/github_mark.svg";

const Footer = () => {
  return (
    <Container>
      <div>
        <a
          href="https://github.com/LeChuckbb"
          target={"_blank"}
          rel="noreferrer"
        >
          <IconButton tooltip="github" direction="top" size="small">
            <IconGithub />
          </IconButton>
        </a>
      </div>
      <p>© 2021-2023. Lechuck all right reserved</p>
    </Container>
  );
};

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.neutral.background};
  color: ${(props) => props.theme.colors.primary.onPrimary};
  height: 96px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 8px;
  box-shadow: -1px -1px 1px ${(props) => props.theme.colors.neutralVariant.outlineVariant};
  & svg {
    fill: ${(props) => props.theme.colors.neutral.onBackground};
  }
  p {
    color: ${(props) => props.theme.colors.neutralVariant.outline};
    font-size: ${(props) => props.theme.fonts.label.small.size};
    font-style: italic;
  }
`;

export default Footer;
