# isLoading vs isFetching

isLoading을 사용했을 때, 로딩이 걸리지 않고 페칭된 데이터를 화면에 잘 노출하였다.

IsLoading은 isFetching이 true이고, 쿼리에 대해 캐시된 데이터가 없는 상태

isFetching은 비동기 쿼리 함수가 아직 요청중일 때 true

아래의 실습 코드를 보며 둘의 차이를 이해해 보자.

```jsx
import { useEffect, useState } from "react";
import { PostDetail } from "./PostDetail";
import { useQuery, useQueryClient } from "react-query";

const maxPostPage = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery(["posts", nextPage], () =>
        fetchPosts(nextPage)
      );
    }
  }, [currentPage, queryClient]);

  const { data, isError, error, isLoading, isFetching } = useQuery(
    ["posts", currentPage],
    () => fetchPosts(currentPage),
    {
      staleTime: 2000,
      keepPreviousData: true,
    }
  );
  // if (!data) return <div />;
  // if (isLoading) return <h3>로딩중</h3>;
  if (isFetching) return <h3>페칭...</h3>;
  if (isError) {
    return (
      <>
        <h3>에러</h3>
        <p>{error.toString()}</p>
      </>
    );
  }

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
```

- 기존의 isLoading 일 경우에 리턴하는 구문을 isFetching으로 바꾸었다.

## Pre-fetch 의 목적

- 프리페치의 목적은 캐시된 데이터를 표시하면서, 화면의 데이터의 업데이트를 서버에서 확인하기 위함이다.
- 그리고 데이터가 업데이트 되었으면, 해당 데이트를 화면에 보여주는 것이다.

## Pre-fetch 의 작동 방식

3페이지에서 4페이지로 이동했을 때, 캐시에 4페이지의 데이터가 존재하는지 확인한다.

4페이지의 데이터를 프리페치 했기 때문에 데이터는 존재 하지만, staleTime이 0이라면 자동으로 stale상태가 되고 비동기 쿼리 함수를 실행시킨다.

그리고 만약 기존과 다른 데이터를 반환한다면, 데이터가 업데이트 될 것 입니다.

따라서 페이지에 새로운 데이터가 화면에 보여지게 됩니다.

하지만, 새로운 데이터가 화면에 보이기 전에, 먼저 캐시된 데이터가 화면에 보입니다.
