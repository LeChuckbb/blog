/* 
  768px 미만 -> Card 1개
  768 ~ 1058 -> Card 2개
  1058 ~ 1464 -> Card 3개
  1464 ~ 1920 -> Card 4개
  1920 ~ -> Card 5개
*/
const BREAK_POINTS = [768, 1058, 1464, 1920];

const theme = {
  colors: {
    primary: "hotpink",
  },
  mq: BREAK_POINTS.map((bp) => `@media (min-width:${bp}px)`),
};

export default theme;
