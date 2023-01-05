import { useState } from "react";
import { PostDetail } from "./PostDetail";
import { useQuery } from "react-query";

// const maxPostPage = 10;

async function fetchPosts() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=10&_page=0"
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  // 첫번째 파라미터에는 쿼리의 이름, 두번째는 비동기 함수를 입력해야한다.
  const { data, isError, error, isLoading } = useQuery("posts", fetchPosts, {
    staleTime: 2000,
  });
  // if (!data) return <div />;
  if (isLoading) return <h3>로딩중</h3>;
  if (isError) return <h3>에러</h3>;

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
        <button disabled onClick={() => {}}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button disabled onClick={() => {}}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
