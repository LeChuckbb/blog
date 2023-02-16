import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Button } from "./Button";
import { ThemeProvider } from "@emotion/react";
import { lightTheme } from "../styles/theme";
import { ReactComponent as BackArrowIcon } from "../../public/arrow_back.svg";
import { FlexContainer, FlexWrapper } from "./Common";

export default {
  title: "blog/Button",
  component: Button,
} as ComponentMeta<typeof Button>;

type Props = {
  args: any;
  icon?: boolean;
};

const Template: ComponentStory<typeof Button> = (args) => (
  <ThemeProvider theme={lightTheme}>
    <FlexContainer>
      <FlexWrapper>
        <Buttons args={args} />
      </FlexWrapper>
      <FlexWrapper>
        <Buttons args={args} icon={true} />
      </FlexWrapper>
    </FlexContainer>
  </ThemeProvider>
);

const Buttons = ({ args, icon }: Props) => {
  return (
    <>
      <Button icon={icon} {...args}>
        {icon && <BackArrowIcon />}Button
      </Button>
      <Button icon={icon} id="hover" {...args}>
        {icon && <BackArrowIcon />} Hover
      </Button>
      <Button icon={icon} id="focus" {...args}>
        {icon && <BackArrowIcon />}Focused
      </Button>
      <Button icon={icon} id="active" {...args}>
        {icon && <BackArrowIcon />}Actived
      </Button>
      <Button icon={icon} disabled {...args}>
        {icon && <BackArrowIcon />}Disabled
      </Button>
    </>
  );
};

const PSEUDO = {
  hover: "#hover",
  focus: "#focus",
  active: "#active",
};

export const Filled = Template.bind({});
Filled.args = { variant: "filled" };
Filled.parameters = { pseudo: PSEUDO };

export const Outlined = Template.bind({});
Outlined.args = { variant: "outlined" };
Outlined.parameters = { pseudo: PSEUDO };

export const Text = Template.bind({});
Text.args = { variant: "text" };
Text.parameters = { pseudo: PSEUDO };

export const Elevated = Template.bind({});
Elevated.args = { variant: "elevated" };
Elevated.parameters = { pseudo: PSEUDO };

export const Tonal = Template.bind({});
Tonal.args = { variant: "tonal" };
Tonal.parameters = { pseudo: PSEUDO };
