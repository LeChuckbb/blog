import { ComponentStory, ComponentMeta } from "@storybook/react";
import Modal from "./Modal";
import { ThemeProvider } from "@emotion/react";
import { lightTheme } from "../styles/theme";
import { FlexContainer, FlexWrapper } from "./Common";
import { ReactComponent as IconClear } from "../../public/clear.svg";

export default {
  title: "blog/Modal",
  component: Modal,
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => (
  <ThemeProvider theme={lightTheme}>
    <FlexContainer>
      <FlexWrapper>
        <Modal {...args}>
          <Modal.Title>포스트 삭제</Modal.Title>
          <Modal.Content>정말로 삭제하시겠습니까?</Modal.Content>
          <Modal.Buttons confirmHandler={() => console.log("모달 종료")} />
        </Modal>
      </FlexWrapper>
    </FlexContainer>
  </ThemeProvider>
);

export const Basic = Template.bind({});
Basic.args = { variant: "basic" };

// export const Full = Template.bind({});
// Full.args = { variant: "full" };
