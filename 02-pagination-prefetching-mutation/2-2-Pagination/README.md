# 페이지네이션

```jsx
import { useState } from "react";
import { PostDetail } from "./PostDetail";
import { useQuery } from "react-query";

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

  const { data, isError, error, isLoading } = useQuery(
    ["posts", currentPage],
    () => fetchPosts(currentPage),
    {
      staleTime: 2000,
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
        </*button*>
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

- Previous page 버튼은 currentPage 값이 1보다 작아지면 비활성화 된다.
- Previous page 버튼 클릭 시, currentPage의 값에서 1을 뺀다.
- Next page 버튼은 currentPage 값이 maxPostPage일 경우 비활성화 된다.
- Next page 버튼 클릭 시, currentPage 값에 1을 더한다.

하지만 버튼을 누를 때 마다 로딩문구가 보인다.
<img width="326" alt="image" src="https://user-images.githubusercontent.com/102638663/210723344-254ae79f-7ed5-41fb-9fb4-f1ceb0dae6fb.png">
데이터 프리패칭 단원에서 이 문제를 해결해보자.
