import React, { useEffect } from 'react';
import { connect } from 'dva';
import { STATE, COL_SIZE, KEY_CODE_DIRECTION, EVENT_KEY } from 'config/constant';
import { getShape, checkStop, getShapeSafeRange, resetAnimation, eliminate } from 'utils/shape';
import store from 'utils/store';
import { slice, boundaryFix, getShapeSize, getShapeHalfSize, isEmpty } from 'utils/utils';
import { bus } from 'utils/bus';
import disableZoom from 'utils/disable-zoom';
import GameArea from 'component/game-area';
import Control from 'component/control';
import './App.scss';

// keyup 监听器
let keyupListener;
// 是否已经开始
let isStart = false;
// 计时器
let timeY;
// 下落间隔实践
let TIME_DURATION = 500;

const App = (props) => {
  const { body, x, y, shape, nextShape } = props;

  const onKeyUp = (e) => {
    if (!isStart) return;

    const { keyCode } = e;

    if (!Object.values(KEY_CODE_DIRECTION).includes(keyCode)) return;

    bus.emit(keyCode, { keyCode });
  };

  const start = () => {
    if (!isStart) return;

    const currentShape = isEmpty(nextShape) ? getShape() : nextShape;

    const nextState = { 
      y: 0,
      shape: currentShape,
      nextShape: getShape(),
      x: Math.floor((COL_SIZE - 1) / 2) - getShapeHalfSize(currentShape),
    };

    store.updateState(nextState);
  };

  const beforeStart = () => {
    if (isStart) return;

    if (!keyupListener) {
      keyupListener = onKeyUp;
      document.addEventListener('keyup', onKeyUp);
    }

    isStart = true;

    start();
  };

  /**
   * 游戏结束
   */
  const handleEnd = () => {
    clearTimer();

    resetAnimation();

    isStart = false;
    console.log('游戏结束');
  };

  /**
   * 结算
   * @param {Boolean} isStop   是否停止
   */
  const handleCount = async (isStop) => {
    const { body } = store.state.home;
    const newMatrix = slice(body, COL_SIZE);

    // 到底停止
    if (isStop) clearTimer();

    // 检测是否执行消除
    const indexs = newMatrix.reduce((result, item, index) => {
      const isFull = item.every(e => e === STATE.COMPLETE);
      if (isFull) result.push(index);
      return result;
    }, []);

    // 是否需要清除
    const isEliminate = indexs.length > 0;

    // 清除逻辑
    if (isEliminate) {
      // 清除计时器
      clearTimer();

      console.log('正在执行消除, 下标集合: ', indexs);

      await eliminate(indexs);
      // 更新分数
      store.updateScore(indexs.length);
    }

    // 是否结束
    const isEnd = body.slice(0, 10).some(e => e === STATE.COMPLETE);

    if (isEnd) handleEnd();         // 游戏结束
    else if (isEliminate) start();  // 消除
    else if (isStop) start();       // 继续
  };

  /**
   * 更新位置
   */
  const updateShape = () => {
    const newBody = body.map(e => e ===  STATE.PROGRESS ? STATE.EMPTY : e);

    // 是否停止
    const isStop = checkStop(x, y);
    // 当前 y
    const ny = isStop ? y - 1 : y;

    shape.forEach((e, i) => {
      e.forEach((v, k) => {
        if (v === 1) {
          const yIndex = (ny - i) * COL_SIZE;
          newBody[yIndex + x + k] = isStop ? STATE.COMPLETE : STATE.PROGRESS;
        }
      })
    });

    store.updateState({ body: newBody });
    handleCount(isStop);
  };

  useEffect(() => {
    if (!isStart) return;

    clearTimer();

    timeY = setTimeout(() => {
      store.setY(y + 1);
    }, TIME_DURATION);
  }, [y]);

  useEffect(() => {
    if (!isStart) return;
    updateShape();
  }, [x, y, shape]);

  useEffect(() => {
    bus.on(EVENT_KEY.START_GAME, beforeStart);
    bus.on(EVENT_KEY.RESET_GAME, handleEnd);
    bus.on(EVENT_KEY.SHAPE_CHANGE, change);

    disableZoom();
  }, []);

  const change = () => {
    if (!isStart) return;

    const { x, y } = store?.state?.home || {};

    // 测试形状
    // const example = [
    //   [0, 1, 1],
    //   [1, 1, 1],
    // ];

    const { currentShape } = store;

    // 一维长度 = 变形后的 x 长度
    const changeSizeX = currentShape.length;
    // 二维长度 = 变形后的 y 长度
    const changeSizeY = currentShape[0].length - 1;

    // 安全位置
    const { x: safeRangeX, y: safeRangeY } = getShapeSafeRange();

    if (
      // x 超过安全位置
      (safeRangeX.max - safeRangeX.min < changeSizeX - 1) ||
      // y 超过安全位置
      (y >= changeSizeY && y - safeRangeY.min < changeSizeY)
    ) {
      return;
    }

    // 变形后形状
    const newShape = currentShape.reduce((result, item, i) => {
      item.forEach((v, k) => {
        if (!result[k]) result[k] = Array(currentShape.length);

        result[k][currentShape.length - 1 - i] = v;
      });

      return result;
    }, []);

    // 新形状长度
    const newShapeSize = getShapeSize(newShape);
    // 计算后的 x
    const computedX = x + getShapeHalfSize(currentShape) - Math.floor(newShapeSize / 2);

    const min = safeRangeX.min;
    const max = safeRangeX.max - newShapeSize + 1;

    // x 兼容边界溢出
    const newX = boundaryFix(computedX, min, max);

    store.updateState({
      shape: [...newShape].reverse(),
      x: newX,
    });
  };

  /**
   * 清除计时器
   */
  const clearTimer = () => {
    if (timeY) {
      clearTimeout(timeY);
      timeY = null;
    }
  };

  return (
    <div className="index">
      <div className="index__container">
        <GameArea />
        <Control />
      </div>
    </div>
  );
}

export default connect(({
  home,
}) => (home))(App);
