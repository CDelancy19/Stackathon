import React, { Component } from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { me } from './store';
import Calendar from './components/Calendar';
import Home from './components/Home';
import Next from './components/Next';
import { Login, Signup } from './components/AuthForm';

/**
 * COMPONENT
 */
class Routes extends Component {
        componentDidMount() {
                this.props.loadInitialData();
        }

        render() {
                const { isLoggedIn } = this.props;

                return (
                        <div>
                                <Switch>
                                        <Route exact path="/" component={Home} />
                                        <Route
                                                path="/login"
                                                render={() =>
                                                        isLoggedIn ? (
                                                                <Redirect to="/" />
                                                        ) : (
                                                                <Login />
                                                        )
                                                }
                                        />
                                        <Route
                                                path="/signup"
                                                render={() =>
                                                        isLoggedIn ? (
                                                                <Redirect to="/" />
                                                        ) : (
                                                                <Signup />
                                                        )
                                                }
                                        />
                                        <Route
                                                path="/calendar"
                                                render={() =>
                                                        isLoggedIn ? (
                                                                <Calendar />
                                                        ) : (
                                                                <Redirect to="/login" />
                                                        )
                                                }
                                        />
                                        <Route
                                                path="/next"
                                                render={() =>
                                                        isLoggedIn ? (
                                                                <Next />
                                                        ) : (
                                                                <Redirect to="/login" />
                                                        )
                                                }
                                        />
                                </Switch>
                        </div>
                );
        }
}

const mapState = (state) => {
        return {
                isLoggedIn: !!state.auth.id,
        };
};

const mapDispatch = (dispatch) => {
        return {
                loadInitialData() {
                        dispatch(me());
                },
        };
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes));
