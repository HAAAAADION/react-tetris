import React from 'react';
import dva from 'dva';
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './store';
import './index.css';

const app = dva();

window._dva = app;

store(app);

app.router(() => <App />);
app.start('#root');

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
