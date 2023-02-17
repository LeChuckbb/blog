import { ComponentStory, ComponentMeta } from "@storybook/react";
import Tooltip from "./Tooltip";
import { ThemeProvider } from "@emotion/react";
import { lightTheme } from "../styles/theme";
import { FlexContainer, FlexWrapper } from "./Common";

export default {
  title: "blog/Tooltip",
  component: Tooltip,
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args) => (
  <ThemeProvider theme={lightTheme}>
    <FlexContainer>
      <FlexWrapper>
        <Tooltip style={{ opacity: 1 }} {...args}>
          Tooltip
        </Tooltip>
      </FlexWrapper>
    </FlexContainer>
  </ThemeProvider>
);

export const Short = Template.bind({});
Short.args = { variant: "short" };
// Filled.parameters = { pseudo: PSEUDO };

export const Long = Template.bind({});
Long.args = { variant: "long" };
