---
sidebar_position: 1
title: Getting started
---

`http-react` is a library for declarative data fetching in React.


### Overview

With one hook call, you get all the information about a request, and you can start making UIs that are more consistent and performant:

```jsx
import useFetch from 'http-react'

export default function App() {
  const { data, loading, error } = useFetch('/api/user-info')

  if (loading) return <p>Loading</p>
  
  if (error) return <p>An error ocurred</p>

  return <h2>Welcome, {data.name}</h2>
}
```

### Installation

```bash
yarn add http-react
```

### Optional
Wrap your app with the `FetcherConfig` component (you don't need it if the base url is the same domain).

You you can use it to set global configurations like cache, headers, defaults, configure suspense for certain requests, etc.


```jsx
import { FetcherConfig } from 'http-react'

export default function App(){
  return (
    <FetcherConfig>
      <div>
        <h2>My app</h2>
      </div>
    </FetcherConfig>
  )
}
```
