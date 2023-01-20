---
sidebar_position: 1
---

# Quick start

With one hook call, you get all the information about a request:

```jsx
import useFetch from 'http-react'

export default function App() {
  const { data, loading, error } = useFetch('/api/user-info', { refresh: 2 })

  if (loading) return <p>Loading</p>
  
  if (error) return <p>An error ocurred</p>

  return <h2>Welcome, {data.name}</h2>
}
```

The first argument passed to the `useFetch` function is the input of the request, this is usually a url. By default, this will be used along with the `method` to create an id to do things like deduplication and sync the state of a request between hook calls related to a request. (in this example, the id will be `GET /api/user-info`)
 
The second argument is the request configuration. This configuration accepts everything that a normal `fetch` call would accept and more. In this example, we are telling `useFetch` to run again 2 seconds after the initial and any subsequent request completes. This is not part of the native `fetch` configuration, and it's one of the many features provided by `http-react`.


### Installation

```bash
yarn add http-react
```

### Optional
Wrap your app with the `FetchConfig` component.

You can use it to set global configurations like cache, headers, default values for certain requests, configure which requests will run with [`Suspense`](https://beta.reactjs.org/reference/react/Suspense), etc.


```jsx
import { FetchConfig } from 'http-react'

export default function App(){
  return (
    <FetchConfig>
      <div>
        <h2>My app</h2>
      </div>
    </FetchConfig>
  )
}
```
