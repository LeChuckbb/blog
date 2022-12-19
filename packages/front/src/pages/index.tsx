import Card from "../components/card/Index";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

const fetchedData = [
  {
    id: 1,
    title: "React Redux 코드 리팩토링",
    subTitle: "코드 짤 때 헷갈리기 쉬운 문법들을 정리했다.",
    date: "2021-08-20",
    tags: ["redux-actions", "Immer", "Redux-toolkit"],
  },
  {
    id: 2,
    title: "어딘가 상상도 못 할 곳에, 수 많은 순록 떼가",
    subTitle: "종이동물원 안 본 흑우 없제~",
    date: "2021-08-02",
    tags: ["켄 리우", "황금가지"],
  },
  {
    id: 3,
    title: "새로운 가난이 온다",
    subTitle: "책은 이래야지",
    date: "2021-07-23",
    tags: ["redux-actions", "Immer", "Redux-toolkit"],
  },
  {
    id: 4,
    title: "11월 독서",
    subTitle: "재밌었다",
    date: "2022-11-30",
    tags: [
      "생계형 개발자",
      "SI에서 살아남기",
      "사람이 싫다",
      "피,땀,픽셀",
      "최소한의 선의",
    ],
  },
  {
    id: 5,
    title: "11월 독서",
    subTitle: "재밌었다",
    date: "2022-11-30",
    tags: [
      "생계형 개발자",
      "SI에서 살아남기",
      "사람이 싫다",
      "피,땀,픽셀",
      "최소한의 선의",
    ],
  },
  {
    id: 6,
    title: "11월 독서",
    subTitle: "재밌었다",
    date: "2022-11-30",
    tags: [
      "생계형 개발자",
      "SI에서 살아남기",
      "사람이 싫다",
      "피,땀,픽셀",
      "최소한의 선의",
    ],
  },
];

const dateFormatter = (date: string): string => {
  const arr = date.split("-");
  return `${arr[0]}년 ${arr[1]}월 ${arr[2]}일`;
};

const BREAK_POINTS = [768, 1058, 1464, 1920];
const mq = BREAK_POINTS.map((bp) => `@media (min-width:${bp}px)`);

export default function Home() {
  return (
    <Container>
      <CardContainer>
        {fetchedData.map((data) => {
          return (
            <Card key={data.id}>
              <Card.Thumbnail />
              <Card.SecondSection>
                <Card.TitleWrapper>
                  <Card.Title>{data.title}</Card.Title>
                  <Card.SubTitle>{data.subTitle}</Card.SubTitle>
                </Card.TitleWrapper>
                <Card.Date>{dateFormatter(data.date)}</Card.Date>
              </Card.SecondSection>
              <Card.ThirdSection>
                <Card.Tags>{data.tags}</Card.Tags>
              </Card.ThirdSection>
            </Card>
          );
        })}
      </CardContainer>
    </Container>
  );
}

const Container = styled.div`
  width: min(1200px, 100%);
  background-color: orange;
  display: flex;
  justify-content: center;
  padding: 8px;
`;

const CardContainer = styled.div`
  /* width: min(900px, 100%); */
  width: 100%;
  background-color: yellow;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;
