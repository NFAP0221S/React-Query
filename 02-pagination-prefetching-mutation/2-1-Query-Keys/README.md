posts.js

```jsx
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
			// PostDetail에 prop 전달
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
```

- useQuery로 data를 받아 map으로 데이터를 뿌려준다.
- 그리고 뿌려진 리스트 데이터 각각을 클릭해보면, 클릭한 데이터의 댓글을 볼 수 있는 코드이다.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b0232bcf-e0ef-4f48-a3ff-92859f507586/Untitled.png)

PostDetail.js

```jsx
import { useQuery } from "react-query";

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

export function PostDetail({ post }) {
  const { data, isLoading, isError, error } = useQuery(
    // 쿼리 키 다음 값에 의존성 추가
    "comments",
    () => fetchComments(post.id)
  );

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button>Delete</button> <button>Update title</button>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
```

- useQuery key를 "comments", 비동기 함수를 fetchComments(post.id) 로 설정해주었다.
- 다시 리스트 데이터 글을 클릭해서 받아온 데이터들을 확인해보자

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/34134de2-71e7-47e7-8f1a-a4a940bc0c3e/Untitled.png)

- 데이터는 받아오지만 모든 각각의 리스트들이 받아오는 값이 똑같다. (사진 생략)
- 이것은 각각의 쿼리(리스트 데이터)들이 같은 "comments"의 캐시 값을 공유해서 그렇다.
- 각 게시물에 대한 쿼리 라벨을 설정하면 이 문제를 해결할 수 있다.

```jsx
const { 
data, 
isLoading, 
isError, 
									// 쿼리 키를 쿼리에 대한 의존성 배열로 취급
error } = useQuery(["comments", post.id], () => fetchComments(post.id));
```

- 쿼리 키에 문자열 대신 배열로 설정하면 된다.
- 배열 첫번째 요소에 문자열, 두번째 요소에 각 게시물에 대해 라벨을 설정할 수 있는 값인 post.id 를 가지면 된다.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/aa3c8600-3583-4e7e-9994-90f46cada2e6/Untitled.png)

이제 다른 데이터 값을 클릭하면 클릭한 데이터에 해당하는 comments 데이터들을 받아온다.
