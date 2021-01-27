import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { STATE } from 'config/constant';
import store from 'utils/store';
import Cube from 'component/cube';
import './index.scss';

const ROW_SIZE = 4;
const COL_SIZE = 3;

const Next = (props) => {
  const { nextShape } = props;

  const [nextArea, setNextArea] = useState([]);

  useEffect(() => {
    const { nextShape } = store;

    const nextAreaContent = Array(ROW_SIZE * COL_SIZE).fill(STATE.EMPTY);

    nextShape.forEach((e, i) => {
      e.forEach((v, k) => {
        const yIndex = i * (ROW_SIZE - 1);
        nextAreaContent[yIndex + k] = v ? STATE.COMPLETE : STATE.EMPTY;
      })
    });

    setNextArea(nextAreaContent);
  }, [nextShape]);

  return (
    <div className="next">
      {nextArea.map((v, k) => <Cube key={k} type={v} />)}
    </div>
  );
}

export default connect(({
  home,
}) => ({
  nextShape: home.nextShape,
}))(Next);
