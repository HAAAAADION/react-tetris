import { COL_SIZE, STATE } from 'config/constant';
import shapeList from 'config/shape.json';
import { getRandom, slice, sleep } from './utils';
import store from './store';

/**
 * 获取当前水平/垂直安全位置
 * @param   {Array}     row 判断数据
 * @param   {Number}    p   当前坐标, [x, y]
 * @return  {Object}        安全位置数据, {min, max}
 */
const _getSafeRang = (row, p) => {
    return row.reduce((result, item, i) => {
        if (item === STATE.COMPLETE) {
            if (i <= p) result.min = i + 1;
            else if (i > p && result.max === undefined) result.max = i - 1;
        }

        return result;
    }, {});
};

// 因为渲染的原因, 所有每个图形返回时都要反转一下
export const getShape = () => {
    const key = getRandom(0, shapeList.length - 1);
    // const key = 0;

    const shape = shapeList[key];
    return [...shape].reverse();
}

/**
 * 判断下一个位置是否碰撞
 * @param   {Number}  nx            检查 x
 * @param   {Number}  ny            检查 y
 * @param   {Array=}  newShape      当前形状
 * @return  {Boolean | Object}      是否碰撞 | 碰撞坐标
 */
export const checkCollision = (nx, ny, newShape) =>  {
    const { shape = [], body = [] } = store?.state?.home || {};
    const computedShape = newShape || shape;
    let result = false;

    const newBody = body.map(e => e ===  STATE.PROGRESS ? STATE.EMPTY : e);

    loop:
    for(let i = 0; i < computedShape.length; i += 1)  {
        for(let k = 0; k < computedShape[i].length; k += 1) {
        const yIndex = (ny - i) * COL_SIZE;

        // 当前 x
        const cX = nx + k;
        if (computedShape[i][k] === 1 && newBody[yIndex + cX] === STATE.COMPLETE) {
            result = { x: cX, y: yIndex };
            break loop;
        }
        }
    }

    return result;
};

/**
 * 判断是否停止
 * @param   {Number}  nx  当前 x
 * @param   {Number}  ny  当前 y
 * @return  {Boolean}     是否停止(是否到底 || 下一个位置是否碰撞)
 */
export const checkStop = (nx, ny) => {
    const { body = [] } = store?.state?.home || {};
    const matrix = slice(body, COL_SIZE);

    return ny >= matrix.length || checkCollision(nx, ny);
}

/**
 * 获取相对与当前 x y 最后要停止的 y 的位置
 * @param   {Number=}  ny   当前 y
 * @return  {Number}        y 应该停止的位置
 */
export const getYStop = (ny) => {
    const { x = 0, y = 0 } = store?.state?.home || {};
    const  cy = ny || y;

    return checkStop(x, cy) ? cy - 1 : getYStop(cy + 1);
}

/**
 * 获取当前可用安全位置(x, y)
 * @return  {OPbject}   x, y 安全距离
 */
export const getShapeSafeRange = () => {
    const { x, y, body } = store?.state?.home || {};

    // 画布垂直长度
    const colLength = slice(body, COL_SIZE).length;
    // 当前形状最后一行的起始的 x 位置
    const lastPointX = store.currentShape[store.currentShape.length - 1].findIndex(e => e === 1);

    // 当前行数据
    const rowX = body.slice(y * COL_SIZE, y * COL_SIZE + COL_SIZE);
    // 当前列数据
    const rowY = Array(colLength).fill('0').map((e, i) => body[(i * COL_SIZE) + x + lastPointX]);

    // 水平安全位置
    const sizeX = _getSafeRang(rowX, x);
    // 垂直安全位置
    const sizeY = _getSafeRang(rowY, y);

    return {
        x: Object.assign({ min: 0, max: COL_SIZE - 1 }, sizeX),
        y: Object.assign({ min: 0, max: colLength - 1 }, sizeY),
    };
};

/**
 * 清除画布动画
 * @param   {Number=}   num     当前 y
 * @param   {Number=}   seed    递归种子数, [-1, 1]
 */
export const resetAnimation = (num, seed = -1) => {
    const { body } = store.state.home;

    const total = slice(body, COL_SIZE).length - 1;
    const cNum = num !== undefined ? num : total;
    const cSeed = cNum <= 0 ? 1 : seed;
    const nextNum = cNum + seed < 0 ? 0 : cNum + cSeed;
    const cState = seed > 0 ? STATE.EMPTY : STATE.COMPLETE;
    
    if (cNum > total) return;

    const yIndex = cNum * COL_SIZE;
    body.splice(yIndex, COL_SIZE, ...Array(COL_SIZE).fill(cState));

    store.updateState({ body: [...body] });

    setTimeout(() => {
        resetAnimation(nextNum, cSeed);
    }, 50);
};

/**
 * 闪动
 * @param   {Array}     indexs  需要闪动的 y 下标集合   
 * @param   {Number=}   count   剩余闪动次数, 2 次为一组
 */
export const flash = async (indexs, count = 9) => {
    const { body } = store.state.home;

    const cCount = count - 1;
    if (cCount <= 1) return Promise.resolve();

    const state = cCount % 2 === 0 ? STATE.COMPLETE : STATE.EMPTY;

    indexs.forEach(e => {
        body.splice(e * COL_SIZE, COL_SIZE, ...Array(COL_SIZE).fill(state));
    });

    store.updateState({ body: [...body] });

    await sleep(200);
    return flash(indexs, cCount);
};

/**
 * 清除
 * @param {Array} indexs    需要清除的 y 集合
 */
export const eliminate = async (indexs) => {
    await flash(indexs);

    const { body } = store.state.home;

    indexs.forEach((e, i) => {
        body.splice((e - i) * COL_SIZE, COL_SIZE);
    });

    body.unshift(...Array(COL_SIZE * indexs.length).fill(STATE.EMPTY));

    store.updateState({ body: [...body] });
};