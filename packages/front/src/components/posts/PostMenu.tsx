// import Modal from "../../common/Modal/Modal";
import Modal from "design/src/stories/Modal";
import { useRecoilState } from "recoil";
import { useQuery } from "react-query";
import { isAuthorized } from "../../apis/authApi";
import { useRouter } from "next/router";
import { modalState } from "../../common/Modal/ModalSetter";
import { useDeletePostMutation } from "../../hooks/query/useDeletePostMutation";
import { Button } from "design/src/stories/Button";

const DeleteModal = ({ confirmHandler }: any) => {
  const [{ content }, setModal] = useRecoilState(modalState);
  return (
    <Modal>
      <Modal.Title>포스트 삭제</Modal.Title>
      <Modal.Content>정말로 삭제하시겠습니까?</Modal.Content>
      <Modal.Buttons
        confirmHandler={confirmHandler}
        content={content}
        setModal={setModal}
      />
    </Modal>
  );
};

const PostMenu = ({ slug }: any) => {
  const router = useRouter();
  const [_, setModal] = useRecoilState(modalState);
  const { data } = useQuery(["isAuthNoSuspense"], () => isAuthorized(), {
    suspense: false,
  });
  const { mutate: deletePost } = useDeletePostMutation(<></>, setModal);
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
    router.push({
      pathname: "/post/write",
      query: { slug },
    });
  };

  return (
    <div style={{ display: "flex", gap: "8px", color: "#808080" }}>
      {data?.status === 200 && (
        <>
          <Button variant="text" onClick={onClickUpdateHandler}>
            수정
          </Button>
          <Button variant="text" onClick={onClickDeleteHandler}>
            삭제
          </Button>
        </>
      )}
    </div>
  );
};

export default PostMenu;
