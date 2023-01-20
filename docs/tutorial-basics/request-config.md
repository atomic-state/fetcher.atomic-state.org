---
sidebar_position: 3
---
# Request config

You can configure how data is fetched and decide what to do when certain events happen.

### `url`

This is the most important part of the request, and you can use it in two ways:

```js
const { data } = useFetch('/api')
```

Or

```js
const { data } = useFetch({ url: '/api' })
```

### `id`

An optional unique id for requests. It can be anything that can be serialized. If `id` is not provided, an id will be created internally using the request `method` and the `url`. For example:

```jsx
useFetch('/api', { id: 'API' })
```
> The default id of this request, if not provided, will be `GET /api`

### `default`

The default value that will be returned while the request is completing. If a cache in the `cacheProvider` exists for that particular request, that will be returned instead.

```jsx
const { data } = useFetch('/info', {
  default: {
    name: '',
    email: ''
  }
})

return <p>{data.name}</p>
```
> In this case, the TypeScript type of `data` will be inferred from `default`

### `baseUrl`
Override the `baseUrl` defined gloablly (we'll see that later)

```jsx
const { data } = useFetch('/info', { baseUrl: '/api' })  
// The final url will be '/api/info'
```

### `body`
The request body (for requests that use POST, DELETE etc)

```jsx
const { data } = useFetch('/save-work', {
  method: 'POST',
  body: {
    title: 'My title',
    content: 'My content'
  }
})
```
> By default, it's serialized as JSON, but you can also change that globally or per-request (setting the `Content-Type` header and the `formatBody` function)

### `formatBody`
Configure how the request body is sent in the request. In this example, we want to send the title in uppercase

```jsx
const { data } = useFetch('/save-work', {
  method: 'PATCH',
  body: {
    title: 'My title',
    content: 'My content'
  },
  formatBody(body){
    return JSON.stringify({
      ...body,
      title: body.title.toUpperCase()
    })
  }
})
```

### `params`
URL params (like Express)

```jsx
const { data } = useFetch('/todos/[id]', {
  params: {
    id: 3
  }
})
```
> The url will be `/todos/3`, but the `id` will be `GET /todos/[id]`

You can also use `:`
```jsx
const { data } = useFetch('/todos/:id', {
  params: {
    id: 3
  }
})
```
Or both
```jsx
const { data } = useFetch('/[resource]/:id', {
  params: {
    resource: 'todos',
    id: 3
  }
})
```
If a param does not exists, you will get a warning in the console, and it will not be parsed. For example:

```jsx
const { data } = useFetch('/[resource]/:id', {
  methos: 'POST',
  params: {
    id: 3
  }
})
```
That will show you a warning in the console that will say `Param 'resource' does not exist in request configuration for '/[resource]/:id'`

> The url will be `resource/3`, and the `id` will be `POST /[resource]:id`



### `query`
The request search params

```jsx
const { data } = useFetch('/search', {
  query: {
    start_date: '2023-01-02',
    end_date: '2023-01-03'
  }
})

// The url will be '/search?start_date=2023-01-02&end_date=2023-01-03'
```

### `cancelOnChange` and `onAbort` (unstable)

Cancel the current request when props change. The `onAbort` function will run when the request gets cancelled. This is a pagination example

```jsx
const [page, setPage] = useState(1)

const { data } = useFetch('/items', {
  cancelOnChange: true,
  onAbort(){
    console.log('The request was cancelled')
  },
  config: {
    query: {
      // every time page changes, the current request will be cancelled 
      page
    }
  }
})
```

### `debounce`
This should be used instead of `cancelOnChange`. With debounce, a request will be debounced by `n` miliseconds after props passed to `useFetch` change.

```jsx
import useFetch from 'http-react'

export default function ExpensiveSearch() {
  const { data } = useFetch('/search', {
    default: [],
    query: {
      q: ''
    },
    debounce: 1000 // Wait for 1 second after props change
  })

  if (!data.length) return <p>No results were found</p>

  return (
    <div>
      <p>Total items found: {data.length}</p>
    </div>
  )
}

```

### `onResolve`

The `onResolve` function will only run when the request completes succesfuly

```jsx
useFetch('/api', {
  onResolve(data) {
    console.log('Data loaded', data)
  }
})
```
You can also use the `useResolve` function to subscribe to requests and do something when they complete susccesfuly (like a useEffect). For this, pass the request id to `onResolve`:

```jsx
// somewhere in a component
useFetch('/api', { method: 'POST' })


// Somewhere else in another component
useResolve('POST /api', data => {
  console.log('Data was fetched from another component', data)
})
```



### `onError`

The `onError` function will run when the request fails

```jsx
useFetch('/api', {
  onError(error) {
    console.log('An error ocurred', error)
  }
})
```

Same as `onResolve`, you can subscribe to the `error` state somewhere else in your app:

```jsx
// somewhere in our app
useFetch('/api', { method: 'POST' })


// Somewhere else in our app
const error = useError('POST /api', () => {
  console.log('An error ocurred in this request')
})

if (error) return <p>Error</p>

return null
```


### `onOffline`

The `onOffline` function will run when internet conection is lost

```jsx
useFetch('/api', {
  onOffline() {
    alert('You are offline')
  }
})
```

### `onOnline`

The `onOnline` function will run when internet conection is restored

```jsx
useFetch('/api', {
  onOnline() {
    alert('Back online')
  }
})
```

### `retryOnReconnect`

If `true` (default), a new request will be sent when the conection is restored after a disconection

```jsx
useFetch('/api', { retryOnReconnect: true })
```

### `revalidateOnFocus`

If `true` (default is `false`), a new request will be sent when the tab is focused again. A new request won't be sent if there is already a request running to avoid stalled requests.

```jsx
useFetch('/api', { revalidateOnFocus: true })
```

### `resolver`

The `resolver` function returns the value that will be returned as `data`. By default, it tries to parse the response body as JSON.

```jsx
const { data } = useFetch('/api/cat.jpg', {
  async resolver(response) {
    const blob = await response.blob() 
    return URL.createObjectURL(blob)
  }
})

return <img src={data} />
```

The example above can be replaced with the `useBlob` hook, which is exactly the same, but converts the request into a blob:

```jsx
const { data } = useBlob('/api/cat.jpg', { objectURL: true })

return <img src={data} />
```
> We passed `objectURL` because we want an object URL of the image. If we don't pass it, `data` will be a `Blob`

### `auto`

If `auto` is set to false, requests will only be sent when calling the `reFetch` function returned from `useFetch` or using the `revalidate` function from anywhere in your app

```jsx
const { data, reFetch } = useFetch('/api', { auto: false, default: {} })

return (
  <div>
    <button onClick={reFetch}>Get data</button>
    <p>{data.name}</p>
  </div>
)
```

### `refresh`

This tells `useFetch` how many seconds should pass after a request is completed to make a new request.
This doesn't mean that a request will be sent every `n` seconds, it means that a new request will be sent `n` seconds after the current request is completed.

```jsx

// This will revalidate 5 seconds after the last request completes
const { data } = useFetch('/api', { refresh: 5, default: {} })

return (
  <div>
    <h2>Refreshing every 5 seconds</h2>
    <p>{data.name}</p>
  </div>
)
```



### `attempts`

This tells `useFetch` how many times a request should be sent again if the initial request fails. If all attempts fail, the `online` property returned from `useFetch` will be set to `false`. This number is reset after a request completes succesfuly so it can be reused in subsequent requests.

```jsx
const myResponse = useFetch('/api', { attempts: 4, default: {} })

const { data, reFetch, online } = myResponse

return (
  <div>
    <button onClick={reFetch}>Refresh data</button>
    <p>{data.name}</p>
    {online ? <p>Server is up</p> : <p>The server may be down</p>}
  </div>
)
```


### `attemptInterval`

This is the time interval (in seconds) between each attempt after a request fails. By default it's `2`

```jsx
const { data, reFetch, online } = useFetch('/api', {
  attempts: 4,
  attemptInterval: 2,
  default: {}
})
// If the request fails, retry 4 times with an interval of 2 seconds

return (
  <div>
    <button onClick={reFetch}>Refresh data</button>
    <p>{data.name}</p>
    {online ? <p>Server is up</p> : <p>The server may be down</p>}
  </div>
)
```

### `memory`

If `false`, the default data will always be taken from the `default` property and not from cache or in-memory cache. By default it's `true`. Setting `memory` to `false` is not recommended because it can lead to layout shifts (which can end up in a bad UX!)

```jsx
const myResponse = useFetch('/api', { memory: false, default: {} })

const { data, reFetch, online } = myResponse

return (
  <div>
    <button onClick={reFetch}>Refresh data</button>
    <p>{data.name}</p>
  </div>
)
```

### `revalidateOnMount`
This tells `useFetch` whether or not a request should be revalidated when the component initializing it is re-mounted but the props used in that request haven't changed.

This is very useful in certain scenarios. Some examples include:

- A request should be made only once during the application lifetime. 
- A request should not be made when going back or forward in the navigation (as long as previous props passed to `useFetch` are presereved in some way, or you are using [Next.js's layouts](https://nextjs.org/docs/basic-features/layouts))
- A request should be made **only** when props change, even when navigating between components or pages (in Web, as long as navigating between pages doesn't trigger a full page reload)


```jsx
const { data, reFetch } = useFetch('/some-expensive-resource', {
  revalidateOnMount: false,
  default: {
    name: ''
  }
})

return (
  <div>
    <button onClick={reFetch}>Request expensive data again</button>
    <p>{data.name}</p>
  </div>
)
```
When is this **not** helpful?

- Props passed to a `useFetch` call depend on component-level state that is reset between renders
- Props passed to `useFetch` change between renders (e.g. they receive `Math.random()` or `crypto.randomUUID()` as `id`)


```jsx
import useFetch from 'http-react'

function WillAlwaysRevalidateOnMount() {
  const [page, setPage] = useState(1)

  const { data, reFetch } = useFetch('/some-expensive-resource', {
    revalidateOnMount: false,
    default: {
      name: ''
    },
    id: Math.random(),
    query: {
      page
    }
  })
  
  return (
    <div>
      <button onClick={reFetch}>Request expensive data again</button>
      <p>{data.name}</p>
    </div>
  )
}
```
To prevent this, you can use a state management library (or Context) that preserves that state. For example, you can use [atomic-state](https://atomic-state.netlify.app) to rewrite that component:

```jsx
import useFetch from 'http-react'

import { atom, useAtom } from 'atomic-state'

const pageState = atom({
  name: 'page',
  default: 1
})

function WillNotNecesarilyRevalidateOnMount() {
  const [page, setPage] = useAtom(pageState)

  const { data, reFetch } = useFetch('/some-expensive-resource', {
    revalidateOnMount: false,
    default: {
      name: ''
    },
    query: {
      page
    }
  })
  
  return (
    <div>
      <button onClick={reFetch}>Request expensive data again</button>
      <p>{data.name}</p>
    </div>
  )
}
```


### `onPropsChange`

This will run when the props passed to a `useFetch` call change

```jsx
function App() {
  const [page, setPage] = useState(1)

  const { data, reFetch } = useFetch('/items', {
    onPropsChange({ previousProps, props,  }) {
      console.log('Props changed from', previousProps, 'to', props)
    },
    query: {
      page
    },
    default: [],
    debounce: 1000
  })

  return (
    <div>
      <button
        onClick={() => {
          setPage((previousPage) => previousPage + 1)
        }}
      >
        Next page
      </button>
      <p>Total items: {data.length}</p>
    </div>
  )
}

```

### `suspense`

`Suspense` is used when you want to pause the rendering of the UI and resume it after the data needed for rendering it is ready. This is very useful if, for example, you want to wait until all requests are completed to render the UI to the user, or to leverage the loading state of the UI to `<React.Suspense>`. If you want to use Suspense, pass `suspense` to the `useFetch` config:

```jsx
import { Suspense } from 'react'
import useFetch from 'http-react'


function Profile() {
  const { data } = useFetch('/api/v2/profile', {
    headers: {
      Authorization: 'Token my-token'
    },
    suspense: true
  })
  
  return (
    <div>
      <p>Your name: {data.name}</p>
      <p>Your email: {data.email}</p>
    </div>
  )
}

export default function App() {
  return (
    <div>
      <h2>My profile</h2>
      <Suspense fallback={<p>Loading profile</p>}>
        <Profile />
      </Suspense>
    </div>
  )
}

```

**Suspense with SSR**

If you are using SSR, it's recommended that you use `SSRSuspense`. It's a wrapper component around `React.Suspense` and it can help prevent server/hydration errors while still showing `fallback` in the SSR page:


```jsx
import useFetch, { SSRSuspense } from 'http-react'


function Profile() {
  const { data } = useFetch('/api/v2/profile', {
    headers: {
      Authorization: 'Token my-token'
    },
    suspense: true
  })
  
  return (
    <div>
      <p>Your name: {data.name}</p>
      <p>Your email: {data.email}</p>
    </div>
  )
}

export default function App() {
  return (
    <div>
      <h2>My profile</h2>
      <SSRSuspense fallback={<p>Loading profile</p>}>
        <Profile />
      </SSRSuspense>
    </div>
  )
}
```
