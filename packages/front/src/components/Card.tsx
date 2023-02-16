import styled from "@emotion/styled";
import Image from "next/image";
import React, { useRef, useEffect } from "react";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import { useRouter } from "next/router";
import { Chip as TagChip } from "design/src/stories/Chip";

type Props = {
  children?: React.ReactNode;
  img?: string;
};

type CardProps = {
  children?: React.ReactNode;
  isLastItem: boolean;
  id: string;
  urlSlug: string;
  fetchNext: () => void;
};

const Card = ({ children, id, urlSlug, isLastItem, fetchNext }: CardProps) => {
  const ref = useRef<HTMLDivElement | null>(null); // 감시할 엘리먼트
  const entry = useIntersectionObserver(ref, {});
  const isIntersecting = !!entry?.isIntersecting;
  const router = useRouter();

  useEffect(() => {
    isLastItem && isIntersecting && fetchNext();
  }, [isLastItem, isIntersecting]);

  const onClickHandler = (event: React.MouseEvent, id: string) => {
    router.push(
      {
        pathname: `/post/${urlSlug}`,
        query: { id },
      },
      `/post/${urlSlug}`
    );
  };

  return (
    <CardBox
      className="CardHere"
      ref={ref}
      onClick={(event) => onClickHandler(event, id)}
    >
      {children}
    </CardBox>
  );
};

// loader를 사용해야만 console에 img 관련 warning이 출력되지 않음
const myLoader = ({ src }: any) => {
  return src;
};

Card.Thumbnail = ({ img, children }: Props) => {
  return (
    <div onClick={() => console.log("img div clicked!!!!@@@")}>
      <Image
        loader={myLoader}
        src={`/thumbnail/${img}`}
        alt="thumbnail"
        width={320}
        height={176}
        sizes="(max-width: 768px) 100vw,
          (max-width: 1200px) 50vw,
          33vw"
        unoptimized
      />
    </div>
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
      <TagList>
        {arr.map((child, idx) => (
          <TagChip variant="filter" color="background" key={idx}>
            {child}
          </TagChip>
        ))}
      </TagList>
    </TagWrapper>
  );
};

const CardBox = styled.div`
  width: 100%;
  flex-grow: 1;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.primary.primary};
  color: ${(props) => props.theme.colors.primary.onPrimary};
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
    max-height: 365px;
  }
  // 1464px 이상일 때
  ${(props) => props.theme.mq[2]} {
    width: 21%;
    max-width: calc(25% - 8px);
    max-height: 365px;
  }
  // 1920px 이상일 때
  ${(props) => props.theme.mq[3]} {
    width: 16%;
    max-width: calc(20% - 8px);
    max-height: 365px;
  }
`;

const StyledTextSection = styled.div`
  padding: 8px 16px;
  flex: 2 1 auto;
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
  color: ${(props) => props.theme.colors.tertiary.container};
  font-size: 12px;
  font-weight: 700;
`;

const StyledTagsSection = styled.div`
  min-height: 40px;
  padding: 8px 16px;
  background-color: ${(props) => props.theme.colors.neutral.surface};
  color: ${(props) => props.theme.colors.neutral.onSurface};
`;

const TagWrapper = styled.div`
  display: flex;
  overflow: hidden;
`;

const TagList = styled.ul`
  display: flex;
  gap: 8px;

  & li {
    height: 24px;
    font-size: 12px;
    font-weight: 700;
  }
`;

// const Tags = styled.span`
//   font-size: 12px;
//   font-weight: 700;
//   color: ${(props) => props.theme.colors.neutral.onSurface};
//   border: 1px solid;
//   border-color: ${(props) => props.theme.colors.neutralVariant.outline};
//   border-radius: 6px;
//   padding: 2px 4px;
// `;

export default Card;
