---
sidebar_position: 2
---

# Reusing requests

If you want to use the same request in multiple places in your app, you should include a unique `id` that will be used to **deduplicate** that specific request and share the output between components and hooks. The `id` can be anything that can be serialized as JSON.


```jsx
import { useFetcher } from 'http-react-fetcher'

// We create a custom hook that returns the info
function useUser(extraConfig){
  return useFetcher('/user-info', {
    id: 'user',
    ...extraConfig
  })
}

function User() {
  const { data, error, loading } = useUser()

  if (loading) return <p>Loading...</p>

  if (error) return <p>An error ocurred</p>

  return (
    <div>
      <p>Username: {data.name}</p>
    </div>
  )
}

function AccountBalance() {
  const { data, error, loading } = useUser()

  if (loading) return <p>Loading account balance...</p>

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
      <User />
      <AccountBalance />
    </div>
  )
}
```

You can also use the `useFetcherId` hook that returns everything from a request

```jsx
function AccountBalance() {
  const { data, error, loading } = useFetcherId('user')

  if (loading) return <p>Loading account balance...</p>

  if (error) return <p>Unable to get account balance</p>

  return (
    <div>
      <p>Balance: {data.balance}</p>
    </div>
  )
}
```
