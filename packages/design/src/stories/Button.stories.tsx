import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Button } from "./Button";
import { ThemeProvider } from "@emotion/react";
import { lightTheme } from "../styles/theme";

export default {
  title: "Go/Button",
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => (
  <ThemeProvider theme={lightTheme}>
    <Button {...args}>Button</Button>
  </ThemeProvider>
);

export const Primary = Template.bind({});
Primary.args = {
  mode: "primary",
};

export const Secondary = Template.bind({});
Secondary.args = { ...Primary.args, mode: "secondary" };

export const Tertiary = Template.bind({});
Tertiary.args = { ...Primary.args, mode: "tertiary" };

export const Error = Template.bind({});
Error.args = { ...Primary.args, mode: "error" };
