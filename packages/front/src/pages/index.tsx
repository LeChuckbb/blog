import Card from "../components/Card";
import styled from "@emotion/styled";
import { useQuery } from "react-query";
import { UseQueryResult } from "react-query/types/react/types";
import { getPost, getPostByPage } from "../apis/postApi";
import { AxiosResponse } from "axios";

const dateFormatter = (date: string): string => {
  const arr = date.split("-");
  return `${arr[0]}년 ${arr[1]}월 ${arr[2]}일`;
};

// const usePokemonQuery = <T>(id?: string): UseQueryResult<AxiosResponse<T>, Error> =>
//   useQuery(id ? ['pokemon', id] : 'pokemon', () => pokemonApi(id));

// const useEvolutionChainQuery = (
//   url?: string
// ): UseQueryResult<AxiosResponse<EvolutionChainResponse>, Error> =>
//   useQuery(["evolution", { url }], getPost());

export default function Home() {
  const { data } = useQuery(["getPosts"], getPost);

  console.log(data?.data?.results);

  return (
    <CardContainer>
      {data?.data?.results?.map((post: any) => {
        return (
          <Card key={post._id}>
            <Card.Thumbnail img={post.image} />
            <Card.SecondSection>
              <Card.TitleWrapper>
                <Card.Title>{post.title}</Card.Title>
                <Card.SubTitle>{post.subTitle}</Card.SubTitle>
              </Card.TitleWrapper>
              <Card.Date>{dateFormatter(post.date)}</Card.Date>
            </Card.SecondSection>
            <Card.ThirdSection>
              <Card.Tags>{post.tags}</Card.Tags>
            </Card.ThirdSection>
          </Card>
        );
      })}
    </CardContainer>
  );
}

const CardContainer = styled.div`
  /* width: min(900px, 100%); */
  width: 100%;
  background-color: yellow;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
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
