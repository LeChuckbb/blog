import WithHeader from "../../layout/WithHeader";
import styled from "@emotion/styled";
import dynamic from "next/dynamic";
import { GetStaticProps, GetStaticPaths } from "next";
import { getPostBySlug, getPost, deletePost } from "../../apis/postApi";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { modalState } from "../../common/Modal/ModalSetter";
import Modal from "../../common/Modal/Modal";

const NoSSRViewer = dynamic(
  () => import("../../components/posts/WriteViewer"),
  {
    ssr: false,
  }
);

const DeleteModal = ({ confirmHandler }: any) => {
  return (
    <Modal>
      <Modal.Title>포스트 삭제</Modal.Title>
      <Modal.Content>정말로 삭제하시겠습니까?</Modal.Content>
      <Modal.Buttons confirmHandler={confirmHandler} />
    </Modal>
  );
};

const PostDetail = ({ title, date, content }: any) => {
  const router = useRouter();
  const [_, setModal] = useRecoilState(modalState);

  const confirmHandler = async () => {
    // 삭제 에러처리 요망
    const res = await deletePost(router.query.pid as string);
    router.push("/");
    setModal({ isOpen: false, content });
  };

  const onClickDeleteHandler = async () => {
    setModal({
      isOpen: true,
      content: <DeleteModal confirmHandler={confirmHandler} />,
    });
  };

  const onClickUpdateHandler = () => {
    // Editor 열기
    // post/write?slug=xxx
    console.log(title);
    router.push({ pathname: "/post/write", query: { slug: title } });
  };

  return (
    <Container className="afjhkjafhs">
      <HeadWrapper>
        <h1 style={{ fontSize: "48px", fontWeight: 700 }}>{title}</h1>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{date}</span>
          <div style={{ display: "flex", gap: "8px", color: "#808080" }}>
            <span style={{ cursor: "pointer" }} onClick={onClickUpdateHandler}>
              수정
            </span>
            <span style={{ cursor: "pointer" }} onClick={onClickDeleteHandler}>
              삭제
            </span>
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
  console.log("hasfdasdf");
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
  console.log("asdffdsa");
  console.log(params);
  console.log(params?.pid);
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
