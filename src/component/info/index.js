import React from 'react';
import { connect } from 'dva';
import Next from 'component/next';
import './index.scss';

const Info = (props) => {
  const { score } = props;

  return (
    <div className="info">
      <p className="info__title">得分</p>
      <p>{score}</p>
      <p className="info__title">下一个</p>
      <Next />
    </div>
  );
}

export default connect(({
  home,
}) => ({
  score: home.score,
}))(Info);
