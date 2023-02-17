import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Chip } from "./Chip";
import { ThemeProvider } from "@emotion/react";
import { lightTheme } from "../styles/theme";
import { FlexContainer, FlexWrapper } from "./Common";
import { ReactComponent as IconClear } from "../../public/clear.svg";

export default {
  title: "blog/Chip",
  component: Chip,
} as ComponentMeta<typeof Chip>;

const Template: ComponentStory<typeof Chip> = (args) => (
  <ThemeProvider theme={lightTheme}>
    <FlexContainer>
      <FlexWrapper>
        <Chip {...args}>Chip</Chip>
        <Chip {...args}>
          Chip <IconClear />
        </Chip>
      </FlexWrapper>
      <FlexWrapper>
        <Chip {...args} color="secondary">
          Chip
        </Chip>
        <Chip {...args} color="secondary">
          Chip <IconClear />
        </Chip>
      </FlexWrapper>
      <FlexWrapper>
        <Chip {...args} color="background">
          Chip
        </Chip>
        <Chip {...args} color="background">
          Chip <IconClear />
        </Chip>
      </FlexWrapper>
    </FlexContainer>
  </ThemeProvider>
);

export const Filter = Template.bind({});
Filter.args = { variant: "filter" };
// Filled.parameters = { pseudo: PSEUDO };

export const Input = Template.bind({});
Input.args = { variant: "input" };
