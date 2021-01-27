import React, { useEffect } from 'react';
import cx from 'classname';
import { COL_SIZE, EVENT_KEY, KEY_CODE_DIRECTION, KEY_CODE_DIRECTION_SEED } from 'config/constant';
import { bus } from 'utils/bus';
import store from 'utils/store';
import { getYStop, checkCollision } from 'utils/shape';
import { getShapeLongestRowSide, isEmpty, isMobile } from 'utils/utils';
import './index.scss';

const Btn = (props = {}) => {
  const { 
    className,
    text,
    onTouchStart = () => {},
  } = props;

  const pushProps = {
    className: cx('c-btn', className),
  };

  if (isMobile()) {
    pushProps.onTouchStart = onTouchStart;
  } else {
    pushProps.onMouseDown = onTouchStart;
  }

  return (
    <div {...pushProps}>
      <i className="c-btn__icon" />
      {text && <p>{text}</p>}
    </div>
  );
};

export default (props) => {
  const change = () => {
    bus.emit(EVENT_KEY.SHAPE_CHANGE);
  };

  const down = () => {
    const { shape } = store?.state?.home;

    if (isEmpty(shape)) return;

    store.setY(getYStop() + 1);
  };

  const handleDirection = (keyCode) => {
    const { x, y, shape } = store?.state?.home || {};

    const longestSide = getShapeLongestRowSide(shape);
    const computedX = x + KEY_CODE_DIRECTION_SEED[keyCode];

    // 超小 || 超大 || 发生碰撞 
    const newX = computedX < 0 || computedX + longestSide > COL_SIZE || checkCollision(computedX, y) ? x : computedX;

    store.setX(newX);
  };

  const left = () => {
    handleDirection(KEY_CODE_DIRECTION.LEFT);
  };

  const right = () => {
    handleDirection(KEY_CODE_DIRECTION.RIGHT);
  };

  const start = () => {
    bus.emit(EVENT_KEY.START_GAME);
  };

  const reset = () => {
    bus.emit(EVENT_KEY.RESET_GAME);
  };

  useEffect(() => {
    bus.on(KEY_CODE_DIRECTION.SPACE, change);
    bus.on(KEY_CODE_DIRECTION.DOWN, down);
    bus.on(KEY_CODE_DIRECTION.LEFT, left);
    bus.on(KEY_CODE_DIRECTION.RIGHT, right);
  }, []);

  return (
    <div className="control">
      <div>
        <div className="control__core">
          <Btn className="control__btn--start" text="开始" onTouchStart={start} />
          <Btn className="control__btn--reset" text="重玩" onTouchStart={reset} />
        </div>
        <Btn className="control__btn--change" text="变形(SPACE)" onTouchStart={change} />
      </div>
      <div className="control__direction">
        <Btn className="control__btn--left" text="左移" onTouchStart={left} />
        <Btn className="control__btn--right" text="右移" onTouchStart={right} />
        <Btn className="control__btn--down" text="掉落" onTouchStart={down} />
      </div>
    </div>
  );
}
