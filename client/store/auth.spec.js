/* global describe beforeEach afterEach it */

const {expect} = require('chai')
process.env.NEXT_PUBLIC_STACK_PROJECT_ID = 'test'
process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY = 'test'
const {me, logout, __setStackClient} = require('./auth.js')
const configureMockStore = require('redux-mock-store').default
const thunkMiddleware = require('redux-thunk').default.default || require('redux-thunk').default
const history = require('../history.js').default

const middlewares = [thunkMiddleware]
const mockStore = configureMockStore(middlewares)

describe('thunk creators', () => {
  let store

  const initialState = {user: {}}

  beforeEach(() => {
    store = mockStore(initialState)
  })

  afterEach(() => {
    store.clearActions()
  })

  describe('me', () => {
    it('eventually dispatches the SET_AUTH action when a user exists', async () => {
      const fakeUser = {email: 'cody@example.com'}
      __setStackClient({ getUser: async () => fakeUser })
      await store.dispatch(me())
      const actions = store.getActions()
      expect(actions[0].type).to.be.equal('SET_AUTH')
      expect(actions[0].auth).to.be.deep.equal(fakeUser)
    })
    it('does not dispatch when no user is returned', async () => {
      __setStackClient({ getUser: async () => null })
      await store.dispatch(me())
      const actions = store.getActions()
      expect(actions.length).to.equal(0)
    })
  })

  describe('logout', () => {
    it('dispatches the SET_AUTH action with an empty object and redirects', async () => {
      __setStackClient({ signOut: async () => {} })
      await store.dispatch(logout())
      const actions = store.getActions()
      expect(actions[0].type).to.be.equal('SET_AUTH')
      expect(history.location.pathname).to.be.equal('/login')
    })
  })
})
