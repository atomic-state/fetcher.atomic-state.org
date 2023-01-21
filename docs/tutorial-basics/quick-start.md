---
sidebar_position: 1
---

# Quick start


### Installation

```bash
npm install --save http-react
```

Or

```bash
yarn add http-react
```

## Basic example

This example shows how http-react can speed up your development by handling the state of a request:

```jsx
import useFetch from 'http-react'

export default function App() {
  const { data, loading, error, responseTime } = useFetch('/api/user-info', { refresh: 2 })

  if (loading) return <p>Loading</p>
  
  if (error) return <p>An error ocurred</p>

  return (
    <div>
      <h2>Welcome, {data.name}</h2>
      <small>Profile loaded in {responseTime} miliseconds</small>
    </div>
  )
}
```

The first argument passed to the `useFetch` function is the input of the request, this is usually a url. By default, this will be used along with the `method` to create an id to do things like deduplication and sync the state of a request between hook calls related to a request. (in this example, the id will be `GET /api/user-info`)
 
The second argument is the request configuration. This configuration accepts everything that a `fetch` call would accept and more. In this example, we are telling `useFetch` to run again 2 seconds after the initial and any subsequent request completes. This is not part of the native `fetch` configuration, and it's one of the many features provided by `http-react`.

`useFetch` returns a lot of useful information:

- `data`: The response data
- `config`: The configuration used to send the request
- `id`: The id of the request
- `loading`: The loading state of the request
- `reFetch`: A function to revalidate and send the request again
- `response`: The response object
- `responseTime`: The time it took to complete the request (in miliseconds)
- `online`: If a request fails after `n` attempts, this will be set to `false`
- `mutate`: A function (similar to a state setter) to mutate data localy (optimistic UI)
- `fetcher`: An object with diferent methods (`get`, `post`, `delete`, etc) that lets you fetch data imperatively using the configuration passed to `useFetch` (similar to `Axios`)
- `error`: The error state of the request
- `code`: The response status code
- `abort`: A function that lets you cancel the request if it hasn't completed yet


### Optional
Wrap your app with the `FetchConfig` component.

You can use it to set global configurations like cache, headers, default values for certain requests, configure which requests will run with [`Suspense`](https://beta.reactjs.org/reference/react/Suspense), etc.


```jsx
import { FetchConfig } from 'http-react'

export default function App() {
  return (
    <FetchConfig baseUrl='/api' refresh={30} headers={{ Authorization: 'Token' }}>
      <div>
        <h2>My app</h2>
      </div>
    </FetchConfig>
  )
}
```
