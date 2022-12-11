---
sidebar_position: 3
---
# Request config

You can configure how data is fetched and decide what to do when certain events happen.

### `url`

This is the most important part of the request, and you can use it in two ways:

```js
const { data } = useFetcher('/api')
```

Or

```js
const { data } = useFetcher({
  url: '/api'
})
```

### `id`

An optional unique id for requests. It can be anything that can be serialized as JSON.

```jsx
useFetcher('/api', {
  id: {
    api: 'api' // This key will be '{"api":"api"}'
  }
})
```

### `default`

The default value that will be returned while the request is completing.

```jsx
const { data } = useFetcher('/info', {
  default: {
    name: '',
    email: ''
  }
})

return <p>{data.name}</p>
```

### `config`
With the `config` object you can define how the request is made. It accepts seven properties:

#### `baseUrl`
  Override the `baseUrl` defined gloablly

#### `body`
  The request body (for requests that use POST, DELETE etc)

#### `formatBody`
  Configure how the request body is sent in the request

#### `headers`
  The request headers

#### `method`
  The request method

#### `params`
  URL params (like Express)

#### `query`
  The request query params

Example with every property:

```js
const { data } = useFetcher('/api/[resource]/:id', {
  config: {
    baseUrl: "https://my-site.com",
    method: "POST",
    params: {
      resource: 'todos',
      id: 1
    },
    query: {
      sort: "asc"
    },
    headers: {
      authorization: "etc"
    },
    formatBody(body){
      return JSON.stringify(body) // This is the default behaviour
    },
    body: {}
  }
})

// The final url will be 'https://my-site.com/api/todos/1?sort=asc'
```

### `cancelOnChange` and `onAbort`

Cancel the current request when props change. The `onAbort` function will run when the request is cancelled.

```jsx
const [page, setPage] = useState(1)

const { data } = useFetcher('/items', {
  id: 'items',
  cancelOnChange: true,
  onAbort(){
    console.log("The request was cancelled")
  },
  config: {
    query: {
      // every time page changes, the current request will be cancelled 
      page
    }
  }
})
```

### `onResolve`

The `onResolve` function will only run when the request completes succesfuly

```jsx
useFetcher('/api', {
  id: 'api',
  onResolve(data){
    console.log("Data loaded", data)
  }
})
```

### `onError`

The `onError` function will run when the request fails

```jsx
useFetcher('/api', {
  id: 'api',
  onError(error){
    console.log("An error ocurred", error)
  }
})
```

### `onOffline`

The `onOffline` function will run when internet conection is lost

```jsx
useFetcher('/api', {
  id: 'api',
  onOffline(){
    alert("You are offline")
  }
})
```

### `onOnline`

The `onOnline` function will run when internet conection is restored

```jsx
useFetcher('/api', {
  id: 'api',
  onOnline(){
    alert("Back online")
  }
})
```

### `retryOnReconnect`

If `true` (default), a new request will be sent when the conection is restored after a disconection

```jsx
useFetcher('/api', {
  id: 'api',
  retryOnReconnect: true
})
```

### `revalidateOnFocus`

If `true` (default is `false`), a new request will be sent when the tab is focused again. A new request won't be sent if there is already a request running to avoid stalled requests.

### `resolver`

The `resolver` function returns the value that will be assigned to `data`

```jsx
const { data } = useFetcher('/api/cat.jpg', {
  id: 'cat-fetch',
  async resolver(response){
    const blob = await response.blob() 
    return URL.createObjectURL(blob)
  }
})
```

### `auto`

If `auto` is set to false, requests will only be sent when calling the `reFetch` function returned from `useFetcher` or using the `revalidate` function from anywhere in your app

```jsx
const { data, reFetch } = useFetcher('/api', {
  id: 'api',
  default: {
    name: ''
  },
  auto: false
})

return (
  <div>
    <button onClick={reFetch}>Refresh data</button>
    <p>{data.name}</p>
  </div>
)
```

### `refresh`

This tells the fetcher how many seconds should pass after a request is completed to make a new request.
This doesn't mean that a request will be sent every `n` seconds, it means that a new request is sent `n` seconds after the current request is completed.

```jsx
const { data } = useFetcher('/api', {
  id: 'api',
  default: {
    name: ''
  },
  refresh: 5, // The ammount in seconds
})

return (
  <div>
    <h2>Refreshing every 5 seconds</h2>
    <p>{data.name}</p>
  </div>
)
```



### `attempts`

This is how many times a request should be sent again if the initial request fails. If all attempts fail, the `online` property returned from `useFetcher` will be `false`. This number is reset after a request completes succesfuly.

```jsx
const { data, reFetch, online } = useFetcher('/api', {
  id: 'api',
  default: {
    name: ''
  },
  attempts: 4
})

return (
  <div>
    <button onClick={Retry}>Refresh data</button>
    <p>{data.name}</p>
    {!online && <p>The server may be down</p>}
  </div>
)
```


### `attemptInterval`

This is the time interval (in seconds) between each attempt after a request fails. By default it's `1`

```jsx
const { data, reFetch, online } = useFetcher('/api', {
  id: 'api',
  default: {
    name: ''
  },
  attempts: 4,
  attemptInterval: 2
})
// If the request fails, retry 4 times with an interval of 2 seconds between each attempt


return (
  <div>
    <button onClick={Retry}>Refresh data</button>
    <p>{data.name}</p>
    {!online && <p>The server may be down</p>}
  </div>
)
```

### `memory`

If `false`, the default data will always be taken from the `default` property and not from cache or in-memory cache. By default it's `true`

```jsx
const { data, reFetch, online } = useFetcher('/api', {
  id: 'api',
  default: {
    name: ''
  },
  memory: false
})

return (
  <div>
    <button onClick={Retry}>Refresh data</button>
    <p>{data.name}</p>
    {!online && <p>The server may be down</p>}
  </div>
)
```
