---
sidebar_position: 1
---

# Quick start

With one hook call, you get all the information about a request:

```jsx
import useFetch from 'http-react'

export default function App() {
  const { data, loading, error } = useFetch('/api/user-info')

  if (loading) return <p>Loading</p>
  
  if (error) return <p>An error ocurred</p>

  return <h2>Welcome, {data.name}</h2>
}
```