---
sidebar_position: 1
title: Getting started
---

`http-react-fetcher` is a library for data fetching in React applications.


To install it:

```bash
yarn add http-react-fetcher
```

Remember to wrap your app with the `FetcherConfig` component (this is optional, and you don't need it if the API's base url is the same as your website), which you can use to set global configurations like headers, defaults, refresh rate, etc.


```jsx
import { FetcherConfig } from 'http-react-fetcher'

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
