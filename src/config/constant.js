// 状态
export const STATE = {
  EMPTY: '0',
  PROGRESS: '1',
  COMPLETE: '2',
};

// 列数
export const COL_SIZE = 10;

// 每次消除分数
export const SCORE_SIZE = 10;

// 键盘方向
export const KEY_CODE_DIRECTION = {
  SPACE: 32,
  LEFT: 37,
  RIGHT: 39,
  DOWN: 40,
};

// 方向种子数
export const KEY_CODE_DIRECTION_SEED = {
  [KEY_CODE_DIRECTION.LEFT]: -1,
  [KEY_CODE_DIRECTION.RIGHT]: 1
}

// 全局广播 key
export const EVENT_KEY = {
  START_GAME: 'START_GAME',
  RESET_GAME: 'RESET_GAME',
  SHAPE_CHANGE: 'SHAPE_CHANGE',
  SHAPE_LEFT: 'SHAPE_LEFT',
  SHAPE_RIGHT: 'SHAPE_RIGHT',
  SHAPE_DOWN: 'SHAPE_DOWN',
};