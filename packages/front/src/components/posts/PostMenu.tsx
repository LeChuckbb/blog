import Modal from "../../common/Modal/Modal";
import { useRecoilState } from "recoil";
import { useQuery } from "react-query";
import { isAuthorized } from "../../apis/authApi";
import { useRouter } from "next/router";
import { modalState } from "../../common/Modal/ModalSetter";
import { useDeletePostMutation } from "../../hooks/query/useDeletePostMutation";

const DeleteModal = ({ confirmHandler }: any) => {
  return (
    <Modal>
      <Modal.Title>포스트 삭제</Modal.Title>
      <Modal.Content>정말로 삭제하시겠습니까?</Modal.Content>
      <Modal.Buttons confirmHandler={confirmHandler} />
    </Modal>
  );
};

const PostMenu = ({ title, content }: any) => {
  const router = useRouter();
  const [_, setModal] = useRecoilState(modalState);
  const { data } = useQuery(["isAuthNoSuspense"], () => isAuthorized(), {
    suspense: false,
  });
  const { mutate: deletePost } = useDeletePostMutation(content, setModal);
  const confirmHanlder = async () =>
    await deletePost(router.query.pid as string);

  const onClickDeleteHandler = async () => {
    setModal({
      isOpen: true,
      content: <DeleteModal confirmHandler={confirmHanlder} />,
    });
  };

  const onClickUpdateHandler = () => {
    // Editor 열기
    // post/write?slug=xxx
    router.push({ pathname: "/post/write", query: { slug: title } });
  };

  return (
    <div style={{ display: "flex", gap: "8px", color: "#808080" }}>
      {data?.status === 200 && (
        <>
          <span style={{ cursor: "pointer" }} onClick={onClickUpdateHandler}>
            수정
          </span>
          <span style={{ cursor: "pointer" }} onClick={onClickDeleteHandler}>
            삭제
          </span>
        </>
      )}
    </div>
  );
};

export default PostMenu;
