import React from 'react'
import {connect} from 'react-redux'
import {authenticate} from '../store'

/**
 * COMPONENT
 */
const AuthForm = props => {
  const {name, displayName, handleSubmit, error} = props

  return (
    <div>
      <form onSubmit={handleSubmit} name={name}>
        {name === 'signup' && (
          <div>
            <label htmlFor="fullName">
              <small>Name</small>
            </label>
            <input name="fullName" type="text" />
          </div>
        )}
        <div>
          <label htmlFor="email">
            <small>Email</small>
          </label>
          <input name="email" type="email" />
        </div>
        <div>
          <label htmlFor="password">
            <small>Password</small>
          </label>
          <input name="password" type="password" />
        </div>
        {name === 'signup' && (
          <div>
            <label htmlFor="phone">
              <small>Phone</small>
            </label>
            <input name="phone" type="text" />
          </div>
        )}
        <div>
          <button type="submit">{displayName}</button>
        </div>
        {error && error.response && <div> {error.response.data} </div>}
      </form>
    </div>
  )
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.auth.error
  }
}

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.auth.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const credentials = {
        email: evt.target.email.value,
        password: evt.target.password.value,
      }
      if (formName === 'signup') {
        credentials.name = evt.target.fullName.value
        if (evt.target.phone.value) credentials.phone = evt.target.phone.value
      }
      dispatch(authenticate(credentials, formName))
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)
