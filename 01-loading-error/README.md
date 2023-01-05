# React에 React-Query 셋업

index.js

```jsx
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
```

1. 최상위 컴포넌트에 QueryClientProvider를 제공
2. QueryClient 를 상수 queryClient에 할당
3. QueryClientProvider 속성인 client에 queryClient 할당

Posts.jsx

```jsx
import { useQuery } from "react-query";

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  // 첫번째 파라미터에는 쿼리의 이름, 두번째는 비동기 함수를 입력해야한다.
  const { data } = useQuery("posts", fetchPosts);
```

- Provider를 제공후 컴포넌트에서 useQuery를 불러와 사용하면 된다.

---

# Loading 과 Error 상태 다루기

Posts.jsx

```jsx
// fetch
async function fetchPosts() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=10&_page=0"
  );
  return response.json();
}

// 컴포넌트
export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  // 첫번째 파라미터에는 쿼리의 이름, 두번째는 비동기 함수를 입력해야한다.
  const { data, isError, error, isLoading } = useQuery("posts", fetchPosts);
  // if (!data) return <div />;
  if (isLoading) return <h3>로딩중</h3>;
  if (isError) return <h3>에러입니다.</h3>;

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
```

- isLoading 인 상태를 확인하려면, 네트워크 속도를 낮춰 확인할 수 있다.
- 에러를 일으키면 isError이 true가 되어 ‘에러입니다.’를 화면에 리턴한다.
