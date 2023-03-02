import styled from "@emotion/styled";
import Image from "next/image";
import React, { useRef, useEffect, ReactComponentElement } from "react";
import useMainPageIntersectionObserver from "../hooks/useMainPageIntersectionObserver";
import { useRouter } from "next/router";
import { Chip as TagChip } from "design/src/stories/Chip";
import Layer from "design/src/stories/Layer";

type Props = {
  children?: React.ReactNode;
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
  const entry = useMainPageIntersectionObserver(ref, {});
  const isIntersecting = !!entry?.isIntersecting;
  const router = useRouter();

  useEffect(() => {
    isLastItem && isIntersecting && fetchNext();
  }, [isLastItem, isIntersecting, fetchNext]);

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
      <Layer variant="card" />
      {children}
    </CardBox>
  );
};

// loader를 사용해야만 console에 img 관련 warning이 출력되지 않음
const myLoader = ({ src }: any) => {
  return src;
};

type ThumbnailProps = {
  imageId: string;
  ImageDefault: any;
};

Card.Thumbnail = ({ imageId, ImageDefault }: ThumbnailProps) => {
  return (
    <div
      className="imgDiv"
      onClick={() => console.log("img div clicked!!!!@@@")}
    >
      {imageId ? (
        <Image
          loader={myLoader}
          src={`${process.env.NEXT_PUBLIC_CF_RECEIVE_URL}/${imageId}/thumbnail`}
          alt="thumbnail"
          style={{ borderRadius: "12px 12px 0px 0px", fill: "red" }}
          width={320}
          height={176}
          sizes="(max-width: 768px) 100vw,
          (max-width: 1200px) 50vw,
          33vw"
          objectFit="cover"
        />
      ) : (
        <ImageDefault />
      )}
    </div>
  );
};

Card.SecondSection = ({ children }: Props) => {
  return <StyledTextSection>{children}</StyledTextSection>;
};

Card.TitleWrapper = ({ children }: Props) => {
  return <StyledTitleWrapper>{children}</StyledTitleWrapper>;
};

Card.Title = ({ children }: Props) => {
  return <StyledTitle>{children}</StyledTitle>;
};

Card.SubTitle = ({ children }: Props) => {
  return <StyledSubTitle>{children}</StyledSubTitle>;
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
  box-shadow: ${(props) => props.theme.shadow.elevation.level1};
  position: relative;
  border-radius: 12px;
  height: 100%;
  transition: all 0.3s;
  top: 0px;

  .imgDiv {
    fill: ${(props) => props.theme.colors.neutral.surface};
    svg {
      border-radius: 12px 12px 0px 0px;
    }
    & path:last-child {
      fill: ${(props) => props.theme.colors.primary.onContainer};
    }
  }

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
  ${(props) => props.theme.mq[3]} {
    width: 21%;
    max-width: calc(25% - 8px);
    max-height: 365px;
  }
  // 1920px 이상일 때
  ${(props) => props.theme.mq[4]} {
    width: 16%;
    max-width: calc(20% - 8px);
    max-height: 365px;
  }

  &:hover {
    box-shadow: ${(props) => props.theme.shadow.elevation.level2};
    top: -4px;
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

const StyledTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StyledTitle = styled.h2`
  font-size: 24px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledSubTitle = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 2; /* The number of lines to show before truncating */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
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
  border-radius: 0px 0px 12px 12px;
  /* border-radius: 12px; */
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

export default Card;
