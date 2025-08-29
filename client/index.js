import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import history from './history';
import store from './store';
import App from './App';
// import 'bootstrap/dist/css/bootstrap.min.css';
import netlifyIdentity from 'netlify-identity-widget';

netlifyIdentity.init();

ReactDOM.render(
        <Provider store={store}>
                <Router history={history}>
			<App />
		</Router>
	</Provider>,
	document.getElementById('app')
);
