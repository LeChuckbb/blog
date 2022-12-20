import styled from "@emotion/styled";
import Image from "next/image";
import React from "react";

type Props = {
  children?: React.ReactNode;
};

const Card = ({ children, ...rest }: Props) => {
  return (
    <CardBox>
      {children}
      {/*  */}
    </CardBox>
  );
};

Card.Thumbnail = ({ children }: Props) => {
  return (
    // <Image
    //   src="/thumbnail/thumb_redux.png"
    //   alt="thumbnail"
    //   width={320}
    //   height={176}
    // />
    <img src="/thumbnail/thumb_redux.png" alt="hi" />
  );
};

Card.SecondSection = ({ children }: Props) => {
  return <StyledTextSection>{children}</StyledTextSection>;
};

Card.TitleWrapper = ({ children }: Props) => {
  return <div>{children}</div>;
};

Card.Title = ({ children }: Props) => {
  return <StyledTitle>{children}</StyledTitle>;
};

Card.SubTitle = ({ children }: Props) => {
  return <span>{children}</span>;
};

Card.Date = ({ children }: Props) => {
  return <StyledDate>{children}</StyledDate>;
};

Card.ThirdSection = ({ children }: Props) => {
  return <StyledTagsSection>{children}</StyledTagsSection>;
};

Card.Tags = ({ children }: Props) => {
  const arr = React.Children.toArray(children);
  return (
    <TagWrapper>
      {arr.map((child, idx) => (
        <Tag key={idx}>{child}</Tag>
      ))}
    </TagWrapper>
  );
};
1;
const CardBox = styled.div`
  width: 100%;
  flex-grow: 1;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.primary};
  /* 
    768px 이상일 때, (두 개 카드 표시)
    1) 50% 미만 33% 이상의 백분율을 카드의 width로 부여.
      즉, 카드 두 개는 초과하지만 3개에는 도달하지 않는 백분율을 부여하고 나머지 여백은 flex-grow로 채운다.
    2) max-width를 지정해서 마지막 줄의 한 개가 flex-grow:1 에 의하여 모든 칸을 차지하지 않도록
  */
  ${(props) => props.theme.mq[0]} {
    width: 47%;
    max-width: calc(50% - 8px);
  }
  // 1058px 이상일 때
  ${(props) => props.theme.mq[1]} {
    width: 30%;
    max-width: calc(33.3% - 8px);
  }
  // 1464px 이상일 때
  ${(props) => props.theme.mq[2]} {
    width: 21%;
    max-width: calc(25% - 8px);
  }
  // 1920px 이상일 때
  ${(props) => props.theme.mq[3]} {
    width: 16%;
    max-width: calc(20% - 8px);
  }
`;
const CardBoxObj = styled.div((props) => ({}));

const StyledTextSection = styled.div`
  padding: 8px 16px;
  flex: 1 1 auto;
  height: 162px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledTitle = styled.h2`
  font-size: 24px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledDate = styled.span`
  /* color: #999; */
  color: #acacac;
  font-size: 12px;
  font-weight: 700;
`;

const StyledTagsSection = styled.div`
  padding: 8px 16px;
  background-color: #efefef;
`;

const TagWrapper = styled.div`
  display: flex;
  gap: 8px;
  overflow: hidden;
`;

const Tag = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #b92b27;
  border: 1px solid #b92b27;
  border-radius: 6px;
  padding: 2px 4px;
`;

export default Card;
