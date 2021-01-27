import React from 'react';
import Game from 'component/game';
import Info from 'component/info';
import './index.scss';

export default () => {
  return (
    <div className="game-area">
      <div className="game-area__wrap">
        <div className="game-area__container">
          <Game />
          <Info />
        </div>
      </div>
    </div>
  );
}