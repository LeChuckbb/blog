import { ComponentStory, ComponentMeta } from "@storybook/react";
import IconButton from "./IconButton";
import { ThemeProvider } from "@emotion/react";
import { lightTheme } from "../styles/theme";
import { FlexContainer, FlexWrapper } from "./Common";
import { ReactComponent as IconClear } from "../../public/clear.svg";

export default {
  title: "blog/IconButton",
  component: IconButton,
} as ComponentMeta<typeof IconButton>;

const Template: ComponentStory<typeof IconButton> = (args) => (
  <ThemeProvider theme={lightTheme}>
    <FlexContainer style={{ backgroundColor: "black" }}>
      <FlexWrapper>
        <IconButton {...args}>
          <IconClear />
        </IconButton>
      </FlexWrapper>
    </FlexContainer>
  </ThemeProvider>
);

export const Standard = Template.bind({});
Standard.args = { variant: "standard" };
// Filled.parameters = { pseudo: PSEUDO };

export const Contained = Template.bind({});
Contained.args = { variant: "contained" };
