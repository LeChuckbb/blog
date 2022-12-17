import styled from "@emotion/styled";
import Image from "next/image";
import React from "react";

type Props = {
  children?: React.ReactNode;
};

const Card = ({ children }: Props) => {
  return (
    <CardBox>
      {children}
      {/*  */}
    </CardBox>
  );
};

Card.Thumbnail = ({ children }: Props) => {
  return (
    <Image
      src="/thumbnail/thumb_redux.png"
      alt="thumbnail"
      width={320}
      height={176}
    />
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

const CardBox = styled.div`
  width: min(320px, 100%);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;

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
