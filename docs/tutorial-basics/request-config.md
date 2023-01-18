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
const { data } = useFetch({
  url: '/api'
})
```

### `id`

An optional unique id for requests. It can be anything that can be serialized.

```jsx
useFetch('/api', {
  id: 'API'
})
```

### `default`

The default value that will be returned while the request is completing. If a cache for that particular request exists, that will be returned instead.

```jsx
const { data } = useFetch('/info', {
  default: {
    name: '',
    email: ''
  }
})

return <p>{data.name}</p>
```

### `baseUrl`
Override the `baseUrl` defined gloablly (we'll see that later)

```jsx
const { data } = useFetch('/info', {
  baseUrl: '/api'
})  
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

### `headers`
The request headers

```jsx
const { data } = useFetch('/authenticate', {
  method: 'GET',
  headers: {
    Authorization: 'Token my-token'
  }
})
```

### `method`
The request method

```jsx
const { data } = useFetch('/remove-item', {
  method: 'DELETE',
  body: {
    id: 10
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
// The url will be '/todos/3'
```
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
  params: {
    id: 3
  }
})

// The url will be '/resource/3'
```



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

### `cancelOnChange` and `onAbort`

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

### `onResolve`

The `onResolve` function will only run when the request completes succesfuly

```jsx
useFetch('/api', {
  onResolve(data) {
    console.log('Data loaded', data)
  }
})
```
You can also use the `useResolve` function to subscribe to requests and do something when they complete susccesfuly. For this, you will need to pass an `id` to your `useFetch` call:

```jsx
// somewhere in our app
useFetch('/api', {
  id: 'my-api',
})


// Somewhere else in our app
useResolve('my-api', data => {
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
useFetch('/api', {
  id: 'my-api',
})


// Somewhere else in our app
const error = useError('my-api', () => {
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
useFetch('/api', {
  retryOnReconnect: true
})
```

### `revalidateOnFocus`

If `true` (default is `false`), a new request will be sent when the tab is focused again. A new request won't be sent if there is already a request running to avoid stalled requests.

```jsx
useFetch('/api', {
  revalidateOnFocus: true
})
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
const { data } = useBlob('/api/cat.jpg', {
  // This is just because we want a blob URL of the image
  // If we don't pass this, 'data' will be a blob
  objectURL: true
})

return <img src={data} />
```

### `auto`

If `auto` is set to false, requests will only be sent when calling the `reFetch` function returned from `useFetch` or using the `revalidate` function from anywhere in your app

```jsx
const { data, reFetch } = useFetch('/api', {
  default: {
    name: ''
  },
  auto: false
})

return (
  <div>
    <button onClick={reFetch}>Get data</button>
    <p>{data.name}</p>
  </div>
)
```

### `refresh`

This tells the fetcher how many seconds should pass after a request is completed to make a new request.
This doesn't mean that a request will be sent every `n` seconds, it means that a new request will be sent `n` seconds after the current request is completed.

```jsx
const { data } = useFetch('/api', {
  default: {
    name: ''
  },
  refresh: 5, // Revalidate 5 seconds after the last request completes
})

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
const { data, reFetch, online } = useFetch('/api', {
  default: {
    name: ''
  },
  attempts: 4
})

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
  default: {
    name: ''
  },
  attempts: 4,
  attemptInterval: 2
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
const { data, reFetch, online } = useFetch('/api', {
  default: {
    name: ''
  },
  memory: false
})

return (
  <div>
    <button onClick={reFetch}>Refresh data</button>
    <p>{data.name}</p>
  </div>
)
```

### `revalidateOnMount`
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

- Props passed to a `useFetch` call depends on component-level state that is reset between renders
- Props passed to `useFetch` change between renders (e.g. they receive `Math.random()` or `crypto.randomUUID()` as `id`)


```jsx

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

### `onPropsChange`

This will run when the props passed to a `useFetch` call change

```jsx
function App() {
  const [page, setPage] = useState(1)

  const { data, reFetch } = useFetch('/items', {
    cancelOnChange: true,
    onPropsChange({ previousProps, props,  }) {
      console.log('Props changed from', previousProps, 'to', props)
    },
    query: {
      page
    },
    default: []
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

`Suspense` is used when you want to pause the rendering of the UI and resume it after a component has finished some asynchronus operation(s). This is very useful if, for example, you want to wait until all requests are completed to render the UI to the user, or to leverage the loading state of the UI to `<React.Suspense>`. If you want to use Suspense, pass `suspense` to the `useFetch` config:

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
