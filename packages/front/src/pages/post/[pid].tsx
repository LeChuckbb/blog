import { useRouter } from "next/router";
import WithHeader from "../../layout/WithHeader";
import { useGetPostByIdQuery } from "../../hooks/query/useGetPostByIdQuery";
import styled from "@emotion/styled";
import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import "prismjs/themes/prism.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import Prism from "prismjs";

const PostDetail = () => {
  const router = useRouter();
  const { data } = useGetPostByIdQuery(router.query.id as string);

  return (
    <Container>
      <HeadWrapper>
        <h1 style={{ fontSize: "32px" }}>{data?.data.title}</h1>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{data?.data?.date}</span>
          <div style={{ display: "flex", gap: "8px" }}>
            <span>수정</span>
            <span>삭제</span>
          </div>
        </div>
      </HeadWrapper>
      {data?.data.content && (
        <Viewer
          initialValue={data?.data?.content || ""}
          plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}
        />
      )}
      {/* dangerouslySetInnerHTML={{ __html: data?.data.content }} */}
    </Container>
  );
};

PostDetail.getLayout = function getLayout(page: React.ReactElement) {
  return <WithHeader>{page}</WithHeader>;
};

export default PostDetail;

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
