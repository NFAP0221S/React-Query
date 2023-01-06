## useMutation의 사용법

```jsx
import { useQuery, useMutation } from "react-query";

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

...생략

  const deleteMutation = useMutation((postId) => deletePost(postId));

  if (isLoading) {
    return <h3>Loading!</h3>;
  }

  if (isError) {
    return (
      <>
        <h3>Error</h3>
        <p>{error.toString()}</p>
      </>
    );
  }

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
      {deleteMutation.isError && (
        <p style={{ color: "red" }}>Error deleting the post</p>
      )}
      {deleteMutation.isLoading && (
        <p style={{ color: "purple" }}>Deleting the post</p>
      )}
      {deleteMutation.isSuccess && (
        <p style={{ color: "green" }}>Post has (not) been deleted</p>
      )}
      <button>Update title</button>
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

먼저 react-query에서 useMutation을 불러온다.

```jsx
import { useQuery, useMutation } from "react-query";
```

그리고 useMutation의 사용 방법을 확인해보자.

```jsx
// 1
const introUseMutation = useMutation(mutationFn);

// 2
const introUseMutation = useMutation({ mutationFn: mutationFn });
```

- mutationFn 위치에 비동기 함수를 넣어주면 된다.

위의 방법을 참고하여 아래와 코드를 작성하였다.

```jsx
const deleteMutation = useMutation((postId) => deletePost(postId));
```

- 컴포넌트 외부에 작성된 비동기 함수인 deletePost가 입력되었다.
- 위의 useMutation은 인수로 postId를 받아 deletePost에 postId를 넘겨주고 있다.
- useMutation이 받는 인수는 아래의 코드에서 확인하자.

컴포넌트가 리턴하는 jsx 구문이다.

이 코드는 버튼을 클릭하면 deleteMutation.mutate가 파라미터로 post.id 를 넘겨주고 있다.

즉, post.id 를 useMutation이 postId라는 인수로 받아 비동기 함수에 넘겨주는 것 이다.

```jsx
return (
  <>
    <h3 style={{ color: "blue" }}>{post.title}</h3>
    <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
    {deleteMutation.isError && (
      <p style={{ color: "red" }}>Error deleting the post</p>
    )}
    {deleteMutation.isLoading && (
      <p style={{ color: "purple" }}>Deleting the post</p>
    )}
    {deleteMutation.isSuccess && (
      <p style={{ color: "green" }}>Post has (not) been deleted</p>
    )}
    <button>Update title</button>
    <p>{post.body}</p>
    <h4>Comments</h4>
    {data.map((comment) => (
      <li key={comment.id}>
        {comment.email}: {comment.body}
      </li>
    ))}
  </>
);
```

deleteMutation의 상태에 따라 구문이 생성될 것이다.

참고로 useMutation도 구조분해할당으로 리턴 값을 가질 수 있다.

<aside>
📌 지금 코드에서는 useQuery가 data, isLoading을 사용중이기 때문에
useMutation은 위의 리턴 값들을 구조분해로 값을 리턴할 필요가 없다.

</aside>
