### React에 React-Query 셋업

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
  const { data, isError, error, isLoading } = useQuery("posts", fetchPosts, {
    staleTime: 2000,
  });
```

- Provider를 제공후 컴포넌트에서 useQuery를 불러와 사용하면 된다.
