import WithHeader from "../../layout/WithHeader";
import styled from "@emotion/styled";
import dynamic from "next/dynamic";
import { GetStaticProps, GetStaticPaths } from "next";
import { getPostBySlug, getPost } from "../../apis/postApi";
import PostMenu from "../../components/posts/PostMenu";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NoSSRViewer = dynamic(
  () => import("../../components/posts/WriteViewer"),
  {
    ssr: false,
  }
);

const PostDetail = ({ title, date, content }: any) => {
  return (
    <Container>
      <HeadWrapper>
        <h1 style={{ fontSize: "48px", fontWeight: 700 }}>{title}</h1>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{date}</span>
          <PostMenu title={title} content={content} />
        </div>
      </HeadWrapper>
      {content && <NoSSRViewer content={content} />}
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
    props: res.data,
  };
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  width: 100%;
  background-color: white;
  padding: 16px;
  min-height: 100vh;
  ${(props) => props.theme.mq[1]} {
    width: 1024px;
  }
  ${(props) => props.theme.mq[2]} {
    width: 1376px;
  }
  ${(props) => props.theme.mq[3]} {
    width: 1728px;
  }
`;

const HeadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const ContentWrapper = styled.div`
  min-height: 900px;
`;
