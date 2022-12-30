import { useRouter } from "next/router";

const PostDetail = () => {
  const router = useRouter();
  const { pid } = router.query;

  console.log(router);
  console.log(router.query);
};

export default PostDetail;
