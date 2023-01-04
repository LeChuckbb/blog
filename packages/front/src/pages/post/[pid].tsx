import WithHeader from "../../layout/WithHeader";
import styled from "@emotion/styled";
import dynamic from "next/dynamic";
import { GetStaticProps, GetStaticPaths } from "next";
import { getPostBySlug, getPost } from "../../apis/postApi";

const NoSSRViewer = dynamic(
  () => import("../../components/posts/WriteViewer"),
  {
    ssr: false,
  }
);

const PostDetail = ({ title, date, content }: any) => {
  console.log(content);

  return (
    <Container>
      <HeadWrapper>
        <h1 style={{ fontSize: "32px" }}>{title}</h1>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{date}</span>
          <div style={{ display: "flex", gap: "8px", color: "#808080" }}>
            <span style={{ cursor: "pointer" }}>수정</span>
            <span style={{ cursor: "pointer" }}>삭제</span>
          </div>
        </div>
      </HeadWrapper>
      {content && <NoSSRViewer content={content} />}
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
  console.log(params);
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
