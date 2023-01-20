---
sidebar_position: 2
---

# Reusing requests

If you want to use the same request in multiple places in your app, you can do so. Internally, `http-react` knows the current state of a request, whether they are loading, they completed succesfuly or if the failed, while preventing duplicated requests. This information is shared between any subscribers that use `useFetch` or any of its forms (`useData`, `useLoading`, etc).


```jsx
import useFetch from 'http-react'

// First, we create a custom hook that returns the user info.
// We can pass any other configuration we want to send in
// the request (like 'keepalive')

function useUserInfo() {
  return useFetch('/api/user-info', {
    headers: {
      Authorization: 'Token my-token'
    },
    cache: 'only-if-cached'
  })
}


// And we can use that in any component or hook.

function UserInfo() {
  const { data, loading, error } = useUserInfo()

  if (loading) return <p>Loading</p>

  if (error) return <p>An error ocurred</p>

  return (
    <div>
      <p>Username: {data.name}</p>
    </div>
  )
}

function AccountBalance() {
  const { data, loading, error } = useUserInfo()

  if (loading) return <p>Loading account balance</p>

  if (error) return <p>Unable to get account balance</p>

  return (
    <div>
      <p>Balance: {data.balance}</p>
    </div>
  )
}

export default function Page() {
  return (
    <div>
      <UserInfo />
      <AccountBalance />
    </div>
  )
}

```

That request will be *deduplicated* (See [Data deduplication](https://en.wikipedia.org/wiki/Data_deduplication)). This means that even though we are calling the `useUser` hook multiple times, only one request will be made, and every subscriber using that hook will be notified when the state of the request changes.

You can also use the `useFetchId` hook that returns everything from a request using its id.

```jsx
import useFetch, { useFetchId } from 'http-react'

// First, we create a custom hook that returns the user info.

function useUserInfo() {
  return useFetch('/api/user-info', {
    headers: {
      Authorization: 'Token my-token'
    },
    cache: 'only-if-cached'
  })
}

function AccountBalance() {
  const { data, loading, error } = useFetchId('GET /api/user-info')

  if (loading) return <p>Loading account balance...</p>

  if (error) return <p>Unable to get account balance</p>

  return (
    <div>
      <p>Balance: {data.balance}</p>
    </div>
  )
}

// This will initialize the request revalidation process, which will be
// propagated to all of its subscribers (above and below the react tree).
// (See be below)

function InitializeUserRequest() {
  useUserInfo()
  return null
}

export default function App() {
  return (
    <div>
      <InitializeUserRequest />
      <AccountBalance />
    </div>
  )
}
```

That example can even be reduced if the `useUserInfo` hook would be used only in those components, so we can safely remove it:

```jsx
import useFetch, { useFetchId } from 'http-react'

function AccountBalance() {
  const { data, loading, error } = useFetchId('GET /api/user-info')

  if (loading) return <p>Loading account balance...</p>

  if (error) return <p>Unable to get account balance</p>

  return (
    <div>
      <p>Balance: {data.balance}</p>
    </div>
  )
}


// This will initialize the request revalidation process, which will be
// propagated to all of its subscribers (above and below the react tree)
// (See be below)

function InitializeUserRequest() {
  useFetch('/api/user-info', {
    id: 'User',
    headers: {
      Authorization: "Token my-token"
    }
  })

  return null
}

export default function App() {
  return (
    <div>
      <InitializeUserRequest />
      <AccountBalance />
    </div>
  )
}
```