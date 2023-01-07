

# React-Query

## **React-Query란 ?**

React에서 비동기에서의 상태 관리 작업을 쉽고 효과적으로 할 수 있게 해준다.

즉 서버의 상태 관리를 할 수 있는 서버상태 관리 도구이다.

## **React-Query의 기능**

- **캐싱**
    - 리액트 쿼리는 클라이언트에서 서버 데이터 캐시를 관리한다.
    - 서버 데이터가 필요할 때, 백엔드로 비동기 요청을 하지 않고 쿼리에 캐시를 요청하여 빠르게 데이터 값을 가져올 수 있다. (Pagination 이나 Infinite scrolling 등 지연 로딩이 걸리는 부분에서 빠른 렌더링 가능)
- **프리패칭 (Prefetching)**
    - `Pagination` 이나 `Infinite scrolling` 등 지연 로딩이 걸리는 기능에서 필요한 데이터를 미리 가져와 빠른 렌더를 할 수 있다.
- **동일한 데이터를 요청하는 경우 한번만 요청한다.**
    - 로드된 페이지의 여러 구성요소가 동일한 데이터를 요청하는 경우 리액트 쿼리가 중복 요청을 제거하여 한번만 요청한다.
- **오래된 데이터 파악 및 업데이트**
    - `staleTime` 을 설정하여 오래된 데이터는 리액트 쿼리가 새로운 데이터로 업데이트 해준다.
- **요청의 성공과 오류를 구별하여 콜백을 전달할 수 있다.**
    - `onSuccess` , `onError` 등을 사용하여 상황에 맞게 콜백 전달 가능

## useQuery **자주 사용하는 리턴 값**

```jsx
const { 
status, 
data, isLoading, 
isFetching, 
error, 
isError } = useQuery(queryKey , queryFn)
```

- status :**String
    
    status는 4가지 값이 존재한다.
    
    - loading: 쿼리가 데이터를 받아오는 중 `isFetching === true`
    - success: 쿼리가 오류 없이 응답을 받고 데이터를 표시할 준비가 된 경우
    - error: 쿼리 시도로 인해 오류가 발생한 경우
    - idle: 쿼리의 데이터가 비어있을 때, 옵션에서 `{ enabled: false }`일 때 발생
- data :Tdata
    - 기본 값은 `undefined`
    - 요청에 성공하여 받아온 데이터
- isLoading :boolean
    - `status.loading` 과 같은 역할
    - 처음 실행된 쿼리라면 `true`, 캐싱된 데이터가 있다면 `false`를 반환
- isFetching :boolean
    - 캐싱된 데이터가 있어도 `isLoading === true` 일 때 발생
- isError :boolean
    - `status.error`과 같은 역할
    - 에러 발생 시 `true`
- error :null | TError
    - 기본값은`null`
    - 오류가 발생한 경우 쿼리에 대한 오류 객체이다.

더 많은 리턴 값이 있으며, 필요할 때 공식문서를 보고 찾아 사용하자

- [React-Query v3 공식문서: useQuery 리턴 값](https://react-query-v3.tanstack.com/reference/useQuery)
- [React-Query v4 공식문서: useQuery 리턴 값](https://tanstack.com/query/v4/docs/react/reference/useQuery?from=reactQueryV3&original=https%3A%2F%2Freact-query-v3.tanstack.com%2Freference%2FuseQuery)

## useQuery 자주 사용하는 옵션

```jsx
const { data } = useQuery(
queryKey, 
queryFn,
// 옵션
{
staleTime,
cacheTime,
onSuccess,
onError,
onSettled,
...
});
```

- **onSuccess** :(data: TData) => void
    - 이 함수는 쿼리가 새 데이터를 성공적으로 가져오거나 `setQueryData`를 통해 캐시가 업데이트될 때마다 실행된다.
- **onError** :(error: TError) => void
    - 쿼리에 오류가 발생하면 이 함수가 실행되고 오류가 전달된다.
- **onSettled** :(data?: TData, error?: TError) => void
    - 이 함수는 쿼리가 성공적으로 가져오거나 오류가 발생하고 데이터 또는 오류가 전달될 때마다 실행된다.
    

<aside>
📌 `staleTime`은 refetching할때의 고려사항이고 `cacheTime`은 다시 사용할 수도 있는 데이터 용입니다.

</aside>

- 추가 설명
    
    특정 쿼리에 대한 활성 useQuery가 없는 경우, 해당 데이터는 콜드 스토리지로 이동합니다.
    
    설정한 cacheTime이 지나면 캐시의 데이터가 만료됩니다. cacheTime의 기본값은 5분입니다.
    
    cacheTime은 특정 useQuery가 활성화된 시점 부터 관찰합니다.
    
    따라서 관찰한 시간은, 컴포넌트가 특정 쿼리에 대해 useQuery를 사용한 시간이 됩니다.
    
    캐시가 만료되면 가비지 컬렉션이 실행되고, 클라이언트는 데이터를 사용할 수 없으며
    
    데이터가 캐시에 있는 동안 fetching할 때 데이터를 사용할 수 있습니다.
    
    하지만 이러한 옵션들을 잘못 사용하면 계속해서 데이터가 페이지에 보이지 않는 현상이 일어날 수도 있습니다.
    
    즉 빈 페이지만 보게되는데, 이 점을 고려한다면, 약간 오래된 데이터(이미 받아온 데이터..?)를 조금이나마 화면에 표시하는 것이
    
    빈 페이지만을 보이는 것보다 낫습니다.
    
    만약 만료된 데이터가 위험할 수 있는 애플리케이션의 경우 cacheTime을 0으로 설정하면 됩니다.
    
    cacheTime을 0으로 설정하면 항상 최신의 데이터만을 가져오게 됩니다.
    
- **staleTime** :number | Infinity
    - 기본값은`0`
    - data가 `fresh`에서 `stale`로 변경되는데 걸리는 시간
    - staleTime을 2000으로 설정하면 `fresh` data가 2초 뒤 `stale` data로 변경된다.
    - `fresh` 일 때 쿼리 인스턴스가 새롭게 마운트 되어도 네트워크 요청(fetch)이 일어나지 않는다.
    - 데이터가 한번 fetch 되고 나서 `staleTime`이 지나지 않았다면 unmount 후 mount 되어도 fetch가 일어나지 않는다.
    - `Infinity`로 설정하면 쿼리 데이터는 직접 캐시를 무효화할 때까지 `fresh` 상태로 유지된다.
- **cacheTime** :number | Infinity
    - 기본값은 5분
    - 데이터가 `inactive` 상태일 때 캐싱 된 상태로 남아있는 시간
    - 미사용/비활성 캐시 데이터가 메모리에 남아 있는 시간
    - • cacheTime이 지나면 `가비지 콜렉터`로 수집된다.
    - cacheTime이 지나기 전에 쿼리 인스턴스가 다시 mount 되면, 데이터를 fetch하는 동안 캐시 데이터를 보여준다.
    - cacheTime은 staleTime과 관계없이, 무조건 `inactive` 된 시점을 기준으로 캐시 데이터 삭제를 결정한다.
        
        

Polling (폴링)

- Polling(폴링)이란?
    - 리얼타임 웹을 위한 기법으로 `일정한 주기(특정한 시간)`를 가지고 서버와 응답을 주고받는 방식이 폴링 방식이다.
    - react-query에서는 `refetchInterval`, `refetchIntervalInBackground`을 이용해서 구현할 수 있다.
- **refetchInterval** :number | false | ((data: TData | undefined, query: Query) => number | false)
    - 시간(ms)를 값으로 넣어주면 일정 시간마다 자동으로 `refetch`를 시켜준다.
    - 함수로 설정하면 최신 데이터와 쿼리로 함수를 실행하여 빈도를 계산합니다.
- **refetchIntervalInBackground** :boolean
    - `refetchInterval`과 함께 사용하는 옵션이다.
    - 탭/창이 백그라운드에 있는 동안 `refetch` 시켜준다. 즉, 브라우저에 `focus`되어 있지 않아도 `refetch`를 시켜주는 것을 의미한다.
    
- **refetchOnMount** :boolean | "always" | ((query: Query) => boolean | "always")
    - refetchOnMount는 데이터가 `stale` 상태일 경우, mount마다 `refetch`를 실행하는 옵션이다. 기본값은 `true`이다.
    - `always` 로 설정하면 마운트 시마다 매번 refetch를 실행한다.
    - `false`로 설정하면 최초 fetch 이후에는 refetch하지 않는다.
- **refetchOnWindowFocus** :boolean | "always" | ((query: Query) => boolean | "always")
    - refetchOnWindowFocus는 데이터가 `stale` 상태일 경우 `윈도우 포커싱` 될 때마다 refetch를 실행하는 옵션이다. 기본값은 `true`이다.
    - 예를 들어, 크롬에서 다른 탭을 눌렀다가 다시 원래 보던 중인 탭을 눌렀을 때도 이 경우에 해당한다. 심지어 F12로 개발자 도구 창을 켜서 네트워크 탭이든, 콘솔 탭이든 개발자 도구 창에서 놀다가 페이지 내부를 다시 클릭했을 때도 이 경우에 해당한다.
    - `always` 로 설정하면 항상 윈도우 포커싱 될 때마다 refetch를 실행한다는 의미이다.

- **enabled** :boolean
    - 이 쿼리가 자동으로 실행되지 않도록 하려면 `false` 로 설정
    - status가 idle 상태로 시작한다.
- **retry** :boolean | number | (failureCount: number, error: TError) => boolean
    - `false` 이면 실패한 쿼리는 기본적으로 재시도하지 않는다.
    - `true` 이면 실패한 쿼리는 무한으로 재시도한다.
    - 값을 3으로 설정하면, 실패한 쿼리가 해당 숫자를 충족할 때까지 재시도한다.
- **select** :(data: TData) => unknown
    
    - 이 옵션은 쿼리 함수에서 반환된 데이터의 일부를 변환하거나 선택하는 데 사용할 수 있습니다.
    

- keepPreviousData
    - true로 설정 시 쿼리키가 변경되어 새로운 데이터를 요청해도, 요청하는 동안 마지막 데이터 값을 유지해준다.
