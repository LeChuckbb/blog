import WithHeader from "../../layout/WithHeader";
import styled from "@emotion/styled";
import dynamic from "next/dynamic";
import { GetStaticProps, GetStaticPaths } from "next";
import { getPostBySlug, getPost } from "../../apis/postApi";
import PostMenu from "../../components/posts/PostMenu";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

const NoSSRViewer = dynamic(
  () => import("../../components/posts/WriteViewer"),
  {
    ssr: false,
  }
);

const getHTMLTags = (htmlString: string) => {
  // 긴 HTML 문자열에서 h1,h2,h3 태그만 추출하기
  const regex = /<(h[1-3]).*?>(.*?)<\/\1>/g;
  const headers = htmlString.match(regex);

  return headers != null
    ? headers.map((str) => {
        // (\w+) : captures its tag name. any word character +(반복)
        // [^<]* :  ignores any attributes within the opening tag
        // (.*) : captures the content
        // <\/\1> : 오프닝 태그(group 1)와 똑같은 이름의 클로징 태그
        const match = str.match(/<(\w+)[^<]*>(.*)<\/\1>/);
        if (match) {
          let tagName = match[1];
          // content 내부의 모든 html tag를 제거한다
          let content = match[2].replace(/<[^>]+>/g, "");
          return { tag: tagName, content };
        }
      })
    : null;
};

const getLeftMarginByTagName = (tagName: string | undefined) => {
  if (tagName === "h2") {
    return "12px";
  } else if (tagName === "h3") {
    return "24px";
  } else {
    // h1
    return "0px";
  }
};

const PostDetail = ({ title, date, content, slug }: any) => {
  const tocArray = getHTMLTags(content.html);
  const [observerEntry, setObserverEntry] =
    useState<IntersectionObserverEntry>();
  const [anchorClickHandler, setAnchorClickHandler] = useState();

  return (
    <Container className="pidContainer">
      {tocArray && (
        <TocAbsoluteWrapper>
          <TocStickyWrapper>
            {tocArray.map((str, idx) => {
              return (
                <TocLineDiv
                  key={idx}
                  css={(theme) => ({
                    marginLeft: getLeftMarginByTagName(str?.tag),
                    color:
                      observerEntry?.target.textContent === str?.content
                        ? theme.colors.primary.primary
                        : "",
                    transform:
                      observerEntry?.target.textContent === str?.content
                        ? "scale(1.05)"
                        : "",
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
      <HeadWrapper className="headWrapper">
        <h1 style={{ fontSize: "48px", fontWeight: 700 }}>{title}</h1>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{date}</span>
          <PostMenu slug={slug} />
        </div>
      </HeadWrapper>
      {content && (
        <NoSSRViewer
          content={content}
          setObserverEntries={setObserverEntry}
          setAnchorClickHandler={setAnchorClickHandler}
        />
      )}
      <ToastContainer />
    </Container>
  );
};

PostDetail.getLayout = function getLayout(page: React.ReactElement) {
  return <WithHeader>{page}</WithHeader>;
};

export default PostDetail;

// 빌드 시 생성할 dynamic routing 페이지의 경로를 지정
export const getStaticPaths: GetStaticPaths = async ({}) => {
  const res = await getPost();
  const paths = res.data.results.map((el: any) => ({
    params: { pid: el.urlSlug },
  }));

  return {
    paths,
    fallback: false,
  };
};

// 빌드 시 데이터를 fetch하여 static 페이지를 생성
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await getPostBySlug(params?.pid as string);

  return {
    props: { ...res.data, slug: params?.pid },
  };
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  background-color: ${(props) => props.theme.colors.neutral.background};
  color: ${(props) => props.theme.colors.neutral.onBackground};
  min-height: 100vh;
  width: 100%;
  max-width: 768px;
  padding: 32px 0px 72px;
  position: relative;
`;

const HeadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

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
