# 프리페칭

페이지에 캐시가 없기 때문에 Next Page 버튼을 클릭할 때 마다 로딩을 기다려야 했다.

이런 안좋은 사용자 경험 문제를 해결해보자.

prefetching을 하기위해서는

react query에서 useQueryClient훅을 불러와 사용해야 한다.

```jsx
import { useQuery, useQueryClient } from "react-query";
```

useEffect를 사용해 currentPage가 업데이트 되면 다음 페이지의 데이터 값을 프리패칭하도록 한다.

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
      // 프리패칭
      queryClient.prefetchQuery(["posts", nextPage], () =>
        fetchPosts(nextPage)
      );
    }
  }, [currentPage, queryClient]);

  const { data, isError, error, isLoading } = useQuery(
    ["posts", currentPage],
    () => fetchPosts(currentPage),
    {
      staleTime: 2000,
      // true로 설정 시 쿼리키가 변경되어 새로운 데이터를 요청해도
      // 요청하는 동안 마지막 데이터 값을 유지해준다.
      keepPreviousData: true,
    }
  );
  // if (!data) return <div />;
  if (isLoading) return <h3>로딩중</h3>;
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

- keepPreviousData를 `true`로 설정하면 쿼리 키가 변경되어서 새로운 데이터를 요청하는 동안에도 마지막 data 값을 유지한다.
  <br />
 <img width="813" alt="image" src="https://user-images.githubusercontent.com/102638663/210734916-2b4f666f-a45b-478b-b44d-0f7308541a96.png">
  <br />
  2 페이지이지만 3페이지의 데이터를 미리 가져와 캐시에 추가되어있다.
