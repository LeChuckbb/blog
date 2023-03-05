import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ThemeProvider } from "@emotion/react";
import Badge from "./Badge";
import { lightTheme } from "../styles/theme";
import { FlexContainer, FlexWrapper } from "./Common";
import { Chip } from "./Chip";
import { ReactComponent as IconClear } from "../../public/clear.svg";

export default {
  title: "blog/Badge",
  component: Badge,
} as ComponentMeta<typeof Badge>;

const Template: ComponentStory<typeof Badge> = (args) => (
  <ThemeProvider theme={lightTheme}>
    <FlexContainer>
      <FlexWrapper>
        <Badge badgeContent={1}></Badge>
        <Badge badgeContent={13}></Badge>
        <Badge badgeContent={999}></Badge>
        <Badge badgeContent={1}>
          <Chip>Chip</Chip>
        </Badge>
        <Badge badgeContent={1}>
          <IconClear width={24} height={24} />
        </Badge>
      </FlexWrapper>
      <FlexWrapper>
        <Badge color="error" badgeContent={1}></Badge>
        <Badge color="error" badgeContent={13}></Badge>
        <Badge color="error" badgeContent={999}></Badge>
        <Badge badgeContent={1}>
          <Chip>태그12</Chip>
        </Badge>
      </FlexWrapper>
      <FlexWrapper>
        <Badge color="errorContainer" badgeContent={1}></Badge>
        <Badge color="errorContainer" badgeContent={13}></Badge>
        <Badge color="errorContainer" badgeContent={999}></Badge>
      </FlexWrapper>
    </FlexContainer>
  </ThemeProvider>
);

export const Large = Template.bind({});
Large.args = { variant: "large" };
// Filled.parameters = { pseudo: PSEUDO };
