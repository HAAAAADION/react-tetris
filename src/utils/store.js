const dispatch = (payload) => {
  window._dva._store.dispatch(payload);
};

const updateState = (payload) => {
  dispatch({
    type: 'home/updateState',
    payload,
  });
};

const setX = (x) => {
  dispatch({
    type: 'home/setX',
    payload: { x },
  });
};

const setY = (y) => {
  dispatch({
    type: 'home/setY',
    payload: { y },
  });
};

const updateScore = (size = 0) => {
  dispatch({
    type: 'home/updateScore',
    payload: { size },
  });
};

export default {
  updateState,
  setX,
  setY,
  updateScore,
  get state () { 
    return window?._dva?._store?.getState();
   },

   get currentShape () {
     return [...this.state.home.shape].reverse();
   },

   get nextShape () {
    return [...this.state.home.nextShape].reverse();
  },
};