import styled from "@emotion/styled";

const getLeftMarginByTagName = (tagName: string | undefined) => {
  if (tagName === "h2") {
    return "12px";
  } else if (tagName === "h3") {
    return "24px";
  } else {
    return "0px";
  }
};

const PostTableOfContents = ({
  tocArray,
  anchorClickHandler,
  observerEntry,
}: any) => {
  return (
    <>
      {tocArray && (
        <TocAbsoluteWrapper className="ToC">
          <TocStickyWrapper>
            {tocArray.map((str: any, idx: any) => {
              return (
                <TocLineDiv
                  key={idx}
                  css={(theme) => ({
                    marginLeft: getLeftMarginByTagName(str?.tag),
                    color:
                      observerEntry === str?.content
                        ? theme.colors.primary.primary
                        : "",
                    transform:
                      observerEntry === str?.content ? "scale(1.05)" : "",
                  })}
                >
                  <TocAnchor
                    href={`#${str?.content}`}
                    onClick={anchorClickHandler}
                  >
                    {str?.content}
                  </TocAnchor>
                </TocLineDiv>
              );
            })}
          </TocStickyWrapper>
        </TocAbsoluteWrapper>
      )}
    </>
  );
};

const TocAbsoluteWrapper = styled.div`
  position: absolute;
  height: 100%;
  left: 100%;
  margin-left: 36px;
  font-size: ${(props) => props.theme.fonts.label.large.size};
  line-height: ${(props) => props.theme.fonts.label.large.lineHeight};
  color: ${(props) => props.theme.colors.neutralVariant.outline};
  display: flex;
  width: max-content;
`;

const TocStickyWrapper = styled.div`
  border-left: 2px solid;
  border-left-color: ${(props) =>
    props.theme.colors.neutralVariant.outlineVariant};
  padding-left: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: sticky;
  top: 300px;
  left: 0;
  align-self: flex-start;
`;

const TocLineDiv = styled.div`
  display: flex;
  transition: all 0.125s ease-in 0s;
`;

const TocAnchor = styled.a`
  max-width: 240px;
  :hover {
    color: ${(props) => props.theme.colors.primary.primary};
  }
`;

export default PostTableOfContents;
