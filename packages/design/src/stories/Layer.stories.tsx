import { ComponentStory, ComponentMeta } from "@storybook/react";
import Layer from "./Layer";
import { ThemeProvider } from "@emotion/react";
import { lightTheme } from "../styles/theme";

export default {
  title: "blog/Layer",
  component: Layer,
} as ComponentMeta<typeof Layer>;

const Template: ComponentStory<typeof Layer> = (args) => (
  <ThemeProvider theme={lightTheme}>
    <div
      style={{
        width: "100px",
        height: "100px",
        backgroundColor: "red",
        position: "relative",
      }}
    >
      <Layer />
    </div>
  </ThemeProvider>
);

export const Plain = Template.bind({});
