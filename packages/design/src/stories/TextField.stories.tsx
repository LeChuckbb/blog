import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ThemeProvider } from "@emotion/react";
import TextField from "./TextField";
import { lightTheme } from "../styles/theme";
import { FlexContainer, FlexWrapper } from "./Common";
import { ReactComponent as IconClear } from "../../public/clear.svg";

export default {
  title: "blog/TextField",
  component: TextField,
} as ComponentMeta<typeof TextField>;

const Template: ComponentStory<typeof TextField> = (args) => (
  <ThemeProvider theme={lightTheme}>
    <FlexContainer>
      <FlexWrapper>
        <TextField {...args} label="id"></TextField>
        <TextField {...args} type="password" label="password"></TextField>
      </FlexWrapper>
    </FlexContainer>
  </ThemeProvider>
);

export const Filled = Template.bind({});
Filled.args = { variant: "filled" };
// Filled.parameters = { pseudo: PSEUDO };

export const Outlined = Template.bind({});
Outlined.args = { variant: "outlined" };
