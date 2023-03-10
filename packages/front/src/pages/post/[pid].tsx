import WithHeader from "../../layout/WithHeader";
import styled from "@emotion/styled";
import dynamic from "next/dynamic";
import { GetStaticProps, GetStaticPaths } from "next";
import PostHead from "../../components/posts/PostHead";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import PostTableOfContents from "../../components/posts/PostTableOfContents";
import useMongo from "../../lib/useMongo";
import LocalErrorBoundary from "../../hooks/\berror/LocalErrorBoundary";

const DynamicPostViewer = dynamic(
  () => import("../../components/posts/PostViewer"),
  {
    ssr: false,
  }
);

interface Props {
  title: string;
  date: string;
  html: string;
  slug: string;
  markdown?: string;
  _id: string;
}

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

const PostDetail = ({ title, date, html, slug, markdown, _id }: Props) => {
  const tocArray = getHTMLTags(html);
  const [observerEntry, setObserverEntry] = useState<string>();
  const [anchorClickHandler, setAnchorClickHandler] = useState();

  return (
    <Container className="pidContainer">
      <PostTableOfContents
        tocArray={tocArray}
        anchorClickHandler={anchorClickHandler}
        observerEntry={observerEntry}
      />
      <LocalErrorBoundary>
        <PostHead
          slug={slug}
          date={date}
          title={title}
          id={_id?.replaceAll('"', "")}
        />
      </LocalErrorBoundary>
      <DynamicPostViewer
        html={html}
        markdown={markdown}
        setObserverEntry={setObserverEntry}
      />
      <ToastContainer />
    </Container>
  );
};

PostDetail.getLayout = function getLayout(page: React.ReactElement) {
  return <WithHeader>{page}</WithHeader>;
};

export default PostDetail;

// 빌드 시 생성할 dynamic routing 페이지의 경로를 지정
export const getStaticPaths: GetStaticPaths = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { postsCollection } = await useMongo();
  const posts = await postsCollection
    .find({}, { projection: { html: 0, markdown: 0 } })
    .toArray();

  const paths = posts.map((post) => ({
    params: {
      pid: post.urlSlug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

// 빌드 시 데이터를 fetch하여 static 페이지를 생성
export const getStaticProps: GetStaticProps = async (context) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { postsCollection } = await useMongo();
  const res = await postsCollection.findOne({
    urlSlug: context.params?.pid as string,
  });

  const results: Props = {
    title: res?.title ?? "",
    date: res?.date ?? "",
    html: res?.html,
    slug: context.params?.pid as string,
    markdown: res?.markdown,
    _id: JSON.stringify(res?._id),
  };

  return {
    props: results,
  };
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  background-color: ${(props) => props.theme.colors.neutral.background};
  color: ${(props) => props.theme.colors.neutral.onBackground};
  min-height: 100vh;
  padding: 32px 0px 72px;
  position: relative;
  width: 90%;
  margin: 0 auto 16px;

  & .ToC {
    display: none;
  }

  ${(props) => props.theme.mq[0]} {
    width: 768px;
  }
  // 1240px 이상일 때
  ${(props) => props.theme.mq[2]} {
    & .ToC {
      display: block;
    }
  }
`;
