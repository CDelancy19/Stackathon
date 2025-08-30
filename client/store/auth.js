let StackClientApp
if (process.env.NODE_ENV === 'test') {
  StackClientApp = class {}
} else {
  ;({ StackClientApp } = require('@stackframe/js'))
}
const history = require('../history.js').default

let stack = new StackClientApp({
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
})

export const __setStackClient = client => {
  stack = client
}

/**
 * ACTION TYPES
 */
const SET_AUTH = 'SET_AUTH'

/**
 * ACTION CREATORS
 */
const setAuth = auth => ({ type: SET_AUTH, auth })

/**
 * THUNK CREATORS
 */
export const me = () => async dispatch => {
  try {
    const user = await stack.getUser()
    if (user) {
      dispatch(setAuth(user))
    }
  } catch (err) {
    // ignore retrieval errors
  }
}

export const authenticate = (credentials, method) => async dispatch => {
  try {
    if (method === 'signup') {
      await stack.signUpWithCredential({
        email: credentials.email,
        password: credentials.password,
        noRedirect: true
      })
      const user = await stack.getUser()
      if (user) {
        await user.update({
          displayName: credentials.name,
          clientMetadata: credentials.phone ? { phone: credentials.phone } : undefined
        })
      }
    } else {
      await stack.signInWithCredential({
        email: credentials.email,
        password: credentials.password,
        noRedirect: true
      })
    }
    const user = await stack.getUser()
    if (user) {
      dispatch(setAuth(user))
    }
    history.push('/')
  } catch (authError) {
    dispatch(setAuth({ error: authError }))
  }
}

export const logout = () => async dispatch => {
  try {
    await stack.signOut()
  } catch (err) {
    // ignore sign out errors
  }
  history.push('/login')
  dispatch(setAuth({}))
}

/**
 * REDUCER
 */
export default function(state = {}, action) {
  switch (action.type) {
    case SET_AUTH:
      return action.auth
    default:
      return state
  }
}
