import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Button } from "./Button";
import { ThemeProvider } from "@emotion/react";
import { lightTheme } from "../styles/theme";
import styled from "@emotion/styled";
import { ReactComponent as BackArrowIcon } from "../../public/arrow_back.svg";

export default {
  title: "Go/Button",
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => (
  <ThemeProvider theme={lightTheme}>
    <FlexWrapper>
      <FlexContainer>
        <Button {...args}>Button</Button>
        <Button id="hover" {...args}>
          Hover
        </Button>
        <Button id="focus" {...args}>
          Focused
        </Button>
        <Button id="active" {...args}>
          Actived
        </Button>
        <Button disabled {...args}>
          Disabled
        </Button>
      </FlexContainer>
      <FlexContainer>
        <Button icon {...args}>
          <BackArrowIcon />
          Button
        </Button>
        <Button id="hover" {...args}>
          Hover
        </Button>
        <Button id="focus" {...args}>
          Focused
        </Button>
        <Button id="active" {...args}>
          Actived
        </Button>
        <Button disabled {...args}>
          Disabled
        </Button>
      </FlexContainer>
    </FlexWrapper>
  </ThemeProvider>
);

export const Filled = Template.bind({});
Filled.args = {
  mode: "filled",
};
Filled.parameters = {
  pseudo: {
    hover: "#hover",
    focus: "#focus",
    active: "#active",
  },
};

export const Outlined = Template.bind({});
Outlined.args = { mode: "outlined" };
Outlined.parameters = {
  pseudo: {
    hover: "#hover",
    focus: "#focus",
    active: "#active",
  },
};

export const Text = Template.bind({});
Text.args = { mode: "text" };
Text.parameters = {
  pseudo: {
    hover: "#hover",
    focus: "#focus",
    active: "#active",
  },
};

export const Elevated = Template.bind({});
Elevated.args = { mode: "elevated" };
Elevated.parameters = {
  pseudo: {
    hover: "#hover",
    focus: "#focus",
    active: "#active",
  },
};

export const Tonal = Template.bind({});
Tonal.args = { mode: "tonal" };
Tonal.parameters = {
  pseudo: {
    hover: "#hover",
    focus: "#focus",
    active: "#active",
  },
};

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 8px;
`;
