import React from 'react';
import { connect } from 'dva';
import Cube from 'component/cube';
import './index.scss';

const Game = (props) => {
  const { body } = props;

  return (
    <div className="game">
      {body.map((v, k) => <Cube key={k} type={v} />)}
    </div>
  );
}

export default connect(({
  home,
}) => ({
  body: home.body,
}))(Game);
