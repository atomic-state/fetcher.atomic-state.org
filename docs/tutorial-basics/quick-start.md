---
sidebar_position: 1
---

# Quick start

With one hook call, you have access to everything related to a specific request:

```jsx
import { useFetcher } from 'http-react-fetcher'

const resolver = (response) => response.json()

export default function Page() {
  const { data, error, loading, reFetch, mutate, abort, config } = useFetcher("/user-info", {
    // You don't need to pass a resolver if the endpoint returns data as JSON
    resolver,
  })

  if (loading) return <p>Loading...</p>

  if (error) return <p>An error ocurred</p>

  return (
    <div>
      <button onClick={reFetch}>Refresh info</button>
      <p>Username: {data.name}</p>
      <button onClick={()=> {
        // Optimistic UI
        mutate({
          name: 'Another name'
        })
      }}>
        Mutate local
      </button>
      {loading && <button onClick={abort}>Cancel</button>}
    </div>
  )
}
```

> Note that `reFetch` won't make another request if `loading` is `true` to avoid stalled requests.