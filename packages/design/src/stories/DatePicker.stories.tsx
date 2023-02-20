import { ComponentStory, ComponentMeta } from "@storybook/react";
import MyDatePicker from "./DatePicker";
import { ThemeProvider } from "@emotion/react";
import { lightTheme } from "../styles/theme";
import { FlexContainer, FlexWrapper } from "./Common";
import { ReactComponent as IconClear } from "../../public/clear.svg";

export default {
  title: "blog/DatePicker",
  component: MyDatePicker,
} as ComponentMeta<typeof MyDatePicker>;

const Template: ComponentStory<typeof MyDatePicker> = (args) => (
  <ThemeProvider theme={lightTheme}>
    <FlexContainer>
      <FlexWrapper>{/* <MyDatePicker /> */}</FlexWrapper>
    </FlexContainer>
  </ThemeProvider>
);

export const Filter = Template.bind({});
Filter.args = { variant: "filter" };
// Filled.parameters = { pseudo: PSEUDO };

export const Input = Template.bind({});
Input.args = { variant: "input" };
