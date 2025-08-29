import axios from 'axios'

const SET_MATCHES = 'SET_MATCHES'

const setMatches = matches => ({
  type: SET_MATCHES,
  matches,
})

export const fetchMatches = () => async dispatch => {
  const { data } = await axios.get('/api/matches')
  dispatch(setMatches(data))
}

export default function(state = [], action) {
  switch (action.type) {
    case SET_MATCHES:
      return action.matches
    default:
      return state
  }
}
