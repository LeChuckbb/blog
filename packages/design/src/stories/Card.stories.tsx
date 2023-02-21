import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ThemeProvider } from "@emotion/react";
import { lightTheme } from "../styles/theme";
import { FlexContainer, FlexWrapper } from "./Common";
import Card from "./Card";

export default {
  title: "blog/Card",
  component: Card,
} as ComponentMeta<typeof Card>;

const Template: ComponentStory<typeof Card> = (args) => (
  <ThemeProvider theme={lightTheme}>
    <FlexContainer>
      <FlexWrapper>
        <Card
          isLastItem={false}
          id="card"
          urlSlug="test"
          fetchNext={() => console.log("test")}
        >
          <Card.Thumbnail img="redux.png" />
          <Card.SecondSection>
            <Card.TitleWrapper>
              <Card.Title>제목</Card.Title>
              <Card.SubTitle>부제</Card.SubTitle>
            </Card.TitleWrapper>
            <Card.Date>2023년 02월 08일</Card.Date>
          </Card.SecondSection>
          <Card.ThirdSection>
            <Card.Tags>독서</Card.Tags>
          </Card.ThirdSection>
        </Card>
      </FlexWrapper>
    </FlexContainer>
  </ThemeProvider>
);

export const Post = Template.bind({});
// Filled.parameters = { pseudo: PSEUDO };

// export const Input = Template.bind({});
