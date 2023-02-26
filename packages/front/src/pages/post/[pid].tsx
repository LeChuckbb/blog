import WithHeader from "../../layout/WithHeader";
import styled from "@emotion/styled";
import dynamic from "next/dynamic";
import { GetStaticProps, GetStaticPaths } from "next";
import { getPost, getPostBySlug } from "../../apis/postApi";
import PostHead from "../../components/posts/PostHead";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import PostTableOfContents from "../../components/posts/PostTableOfContents";

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

const PostDetail = ({ title, date, html, slug }: any) => {
  const tocArray = getHTMLTags(html);
  const [observerEntry, setObserverEntry] =
    useState<IntersectionObserverEntry>();
  const [anchorClickHandler, setAnchorClickHandler] = useState();

  return (
    <Container className="pidContainer">
      <PostTableOfContents
        tocArray={tocArray}
        anchorClickHandler={anchorClickHandler}
        observerEntry={observerEntry}
      />
      <PostHead slug={slug} date={date} title={title} />
      {html && (
        <NoSSRViewer
          content={html}
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
    props: { ...res.data.results, slug: params?.pid },
  };
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  background-color: ${(props) => props.theme.colors.neutral.background};
  color: ${(props) => props.theme.colors.neutral.onBackground};
  min-height: 100vh;
  width: 768px;
  padding: 32px 0px 72px;

  position: relative;
`;
