import home from './home';

const stores = {
  home,
};

const createStore  = (app) => {
  Object.keys(stores).forEach(e => {
    app.model(stores[e]);
  });
};

export default createStore;