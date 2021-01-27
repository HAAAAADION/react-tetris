import React from 'react';
import cx from 'classname';
import { STATE } from 'config/constant';
import './index.scss';

export default (props) => {
  const { type } = props;

  return (
    <div
      className={cx('cube', {
        'cube--active': type === STATE.PROGRESS,
        'cube--complete': type === STATE.COMPLETE
      })}
    />
  );
}
