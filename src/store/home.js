import { SCORE_SIZE } from 'config/constant';
import store from 'utils/store';

export default {
  namespace: 'home',
  state: {
    x: 0,
    y: -1,
    // 得分
    score: 0,
    // 当前形状
    shape: [],
    // 下一个形状
    nextShape: [],
    body: Array(150).fill('0'),
  },
  reducers: {
    updateState(state, { payload = {} }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    *setX({ payload: { x } }, { put }) {
      yield put({
        type: 'updateState',
        payload: { x },
      });
    },

    *setY({ payload: { y } }, { put }) {
      yield put({
        type: 'updateState',
        payload: { y },
      });
    },

    *updateScore({ payload: { size = 0 } }, { put }) {
      const score = store.state.home.score + size * SCORE_SIZE;

      yield put({
        type: 'updateState',
        payload: { score },
      });
    },
  },
}
