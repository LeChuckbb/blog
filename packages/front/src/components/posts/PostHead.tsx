import Modal from "design/src/stories/Modal";
import styled from "@emotion/styled";
import { useRecoilState } from "recoil";
import { useQuery } from "react-query";
import { isAuthorized } from "../../apis/authApi";
import { useRouter } from "next/router";
import { modalState } from "../../recoil/atom";
import { useDeletePostMutation } from "../../hooks/query/useDeletePostMutation";
import { Button } from "design/src/stories/Button";

type Props = {
  date: any;
  title: any;
  slug: any;
};

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

const dateFormatter = (date: string) => {
  const dateObj = new Date(date);
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return formatter.format(dateObj);
};

const PostHead = ({ date, title, slug }: Props) => {
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

  const formattedDate = dateFormatter(date);

  return (
    <HeadWrapper className="headWrapper">
      <MyDate>{formattedDate}</MyDate>
      <Title>{title}</Title>
      <Menu>
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
      </Menu>
    </HeadWrapper>
  );
};

export default PostHead;

const HeadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: center;
`;

const MyDate = styled.p`
  color: ${(props) => props.theme.colors.neutralVariant.outline};
  font-size: ${(props) => props.theme.fonts.label.large.size};
  font-weight: ${(props) => props.theme.fonts.label.large.weight};
  line-height: ${(props) => props.theme.fonts.label.large.lineHeight};
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.fonts.headline.large.size};
  font-weight: ${(props) => props.theme.fonts.headline.large.weight};
  line-height: ${(props) => props.theme.fonts.headline.large.lineHeight};
`;

const Menu = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  justify-content: end;
`;
