import { createMemoryHistory, createBrowserHistory } from 'history'

// In a browser environment the global `process` object may be undefined.
// Use a `typeof` guard so referencing environment variables doesn't throw.
const env = typeof process !== 'undefined' ? process.env : {}

const history =
  env.NODE_ENV === 'test'
    ? createMemoryHistory()
    : createBrowserHistory()

export default history
