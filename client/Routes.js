import React, { Component, Fragment } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import Calendar from './components/Calendar';
import Home from './components/Home';
import Next from './components/Next';

/**
 * COMPONENT
 */
class Routes extends Component {
	render() {
		return (
			<div>
				<Switch>
					<Route path="/home" component={Home} />
					<Route path="/calendar" component={Calendar} />
					<Route path="/next" component={Next} />
				</Switch>
			</div>
		);
	}
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(Routes);
