import WithHeader from "../../layout/WithHeader";
import styled from "@emotion/styled";
import { GetStaticProps, GetStaticPaths } from "next";
import PostHead from "../../components/posts/PostHead";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import PostTableOfContents from "../../components/posts/PostTableOfContents";
import mongo from "../../lib/mongo";
import LocalErrorBoundary from "../../hooks/\berror/LocalErrorBoundary";
import PostViewer from "../../components/posts/PostViewer";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

interface Props {
  title: string;
  subTitle: string;
  date: string;
  html: string;
  slug: string;
  markdown?: string;
  _id: string;
}

const getHTMLTags = (htmlString: string) => {
  // 긴 HTML 문자열에서 h1,h2,h3 태그만 추출하기
  const regex = /<(h[1-3]).*?>(.*?)<\/\1>/g;
  const headers = htmlString?.match(regex);

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

const PostDetail = ({ title, subTitle, date, html, slug, _id }: Props) => {
  const router = useRouter();
  const tocArray = getHTMLTags(html);
  const [observerEntry, setObserverEntry] = useState<string>();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="pidContainer">
      <NextSeo title={title} description={subTitle} />
      <PostTableOfContents tocArray={tocArray} observerEntry={observerEntry} />
      <LocalErrorBoundary>
        <PostHead
          slug={slug}
          date={date}
          title={title}
          id={_id?.replaceAll('"', "")}
        />
      </LocalErrorBoundary>
      <PostViewer html={html} setObserverEntry={setObserverEntry} />
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
  const { postsCollection } = await mongo();
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
    fallback: true,
    // fallback: false,
  };
};

// 빌드 시 데이터를 fetch하여 static 페이지를 생성
export const getStaticProps: GetStaticProps = async (context) => {
  const { postsCollection } = await mongo();
  const res = await postsCollection.findOne({
    urlSlug: context.params?.pid as string,
  });

  const results: Props = {
    title: res?.title ?? "",
    subTitle: res?.subTitle,
    date: res?.date ?? "",
    html: res?.html,
    slug: context.params?.pid as string,
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
      margin-left: 32px;
    }
    & .TocAnchor {
      max-width: 15vw;
    }
  }
  ${(props) => props.theme.mq[3]} {
    & .ToC {
      margin-left: 72px;
    }
  }
  ${(props) => props.theme.mq[4]} {
    & .TocAnchor {
      max-width: 20vw;
    }
  }
`;
