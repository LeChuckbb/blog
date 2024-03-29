import styled from "@emotion/styled";
import Image from "next/image";
import React, { useRef, useEffect } from "react";
import useMainPageIntersectionObserver from "../hooks/useMainPageIntersectionObserver";
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
  // const router = useRouter();

  useEffect(() => {
    if (isLastItem && isIntersecting) fetchNext();
  }, [isLastItem, isIntersecting, fetchNext]);

  // const onClickHandler = (event: React.MouseEvent, id: string) => {
  //   router.push(
  //     {
  //       pathname: `/post/${urlSlug}`,
  //       query: { id },
  //     },
  //     `/post/${urlSlug}`
  //   );
  // };

  return (
    <CardBox
      className="CardHere"
      ref={ref}
      // onClick={(event) => onClickHandler(event, id)}
    >
      <Layer variant="card" />
      {children}
    </CardBox>
  );
};

type ThumbnailProps = {
  ImageDefault: any;
  imageId: string;
};

Card.Thumbnail = ({ ImageDefault, imageId }: ThumbnailProps) => {
  return (
    <div className="imgDiv">
      {imageId ? (
        <Image
          src={`${process.env.NEXT_PUBLIC_CF_RECEIVE_URL}/${imageId}/thumbnail`}
          blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
          placeholder="blur"
          alt="thumbnail"
          style={{ borderRadius: "12px 12px 0px 0px", fill: "red" }}
          width={340}
          height={185}
          sizes="100vw"
          objectFit="cover"
          priority
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
  height: 100%;

  .imgDiv {
    fill: ${(props) => props.theme.colors.neutral.surface};
    min-height: 190px;
    height: 100%;
    svg {
      border-radius: 12px 12px 0px 0px;
    }
    & path:last-child {
      fill: ${(props) => props.theme.colors.primary.onContainer};
    }
  }

  &:hover {
    box-shadow: ${(props) => props.theme.shadow.elevation.level2};
    top: -4px;
  }
`;

const StyledTextSection = styled.div`
  padding: 8px 16px;
  flex: 2 1 auto;
  height: 140px;
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
  font-size: 15px;
  color: ${(props) => props.theme.colors.neutralVariant.surfaceVariant};
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
