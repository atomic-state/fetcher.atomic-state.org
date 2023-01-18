---
sidebar_position: 2
---

# Reusing requests

If you want to use the same request in multiple places in your app, you can do so.


```jsx
import useFetch from 'http-react'

// First, we create a custom hook that returns the user info
function useUser() {
  return useFetch('/api/user-info', {
    headers: {
      Authorization: "Token my-token"
    }
  })
}


// And we can use that in any component or hook.

function UserInfo() {
  const { data, loading, error } = useUser()

  if (loading) return <p>Loading</p>

  if (error) return <p>An error ocurred</p>

  return (
    <div>
      <p>Username: {data.name}</p>
    </div>
  )
}

function AccountBalance() {
  const { data, loading, error } = useUser()

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
> For this, you would need to pass `'User'` as the request `id` and call the `useUser` hook somewhere in the application (because when you are calling `useFetcherId('User')` you are not passing a url, so no request will be sent!)

```jsx
import useFetch, { useFetchId } from 'http-react'
// First, we create a custom hook that returns the user info

function useUser() {
  return useFetch('/api/user-info', {
    id: 'User',
    headers: {
      Authorization: "Token my-token"
    }
  })
}

function AccountBalance() {
  const { data, loading, error } = useFetchId('User')

  if (loading) return <p>Loading account balance...</p>

  if (error) return <p>Unable to get account balance</p>

  return (
    <div>
      <p>Balance: {data.balance}</p>
    </div>
  )
}

// This will initialize the request invalidation process, which will be
// propagated to all of its subscribers (above and below the react tree)

function InitializeUserRequest() {
  useUser()
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

That example can even be reduced if the `useUser` hook would be used only in those components, so we can safely remove it:

```jsx
import useFetch, { useFetchId } from 'http-react'

function AccountBalance() {
  const { data, loading, error } = useFetchId('User')

  if (loading) return <p>Loading account balance...</p>

  if (error) return <p>Unable to get account balance</p>

  return (
    <div>
      <p>Balance: {data.balance}</p>
    </div>
  )
}


// This will initialize the request invalidation process, which will be
// propagated to all of its subscribers (above and below the react tree)

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