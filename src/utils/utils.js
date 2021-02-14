/**
 * 获取范围随机数
 * @param   {Number}  min 最小值
 * @param   {Number}  max 最大值
 * @return  {Number}      随机数
 */
export const getRandom = (min, max) => parseInt(Math.random() * (max - min + 1) + min, 10);

/**
 * 边界判断
 * @param   {Number}  min 最小值
 * @param   {Number}  max 最大值
 */
export const boundaryFix = (num, min, max) => num < min ? min : num > max ? max : num;

/**
 * 获取形状边长
 * @param   {Array}   shape 形状数据
 * @returns {Number}        边长
 */
export const getShapeSize = (shape) => shape?.[0]?.length || 0;

/**
 * 获取形状边长的一半
 * @param   {Array}   shape 形状数据
 * @returns {Number}        边长一半
 */
export const getShapeHalfSize = (shape) => Math.floor(getShapeSize(shape) / 2);

/**
 * 分割数组
 * @param   {Array} arr   目标数组
 * @param   {Array} size  分割数组长度
 * @return  {Array}       分割后数组 
 */
export const slice = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length / size; i++) {
    result.push(arr.slice(size * i, size * i + size));
  }

  return result;
};

/**
 * 获取形状横向最长的边
 * @param   {Array}   shape 形状矩阵
 * @return  {Number}        最长边占位  
 */
export const getShapeLongestRowSide = (shape) => {
  const sizeArr = shape.map(e => e.length);
  return Math.max(...sizeArr);
};

/**
 * 内容是否为空
 * @param   {*} v     判断数据内容
 * @return  {Boolean} 是否为空
 */
export const isEmpty = (v) => {
  const objType = Object.prototype.toString.call(v);
 
  switch (objType) {
    case '[object Array]':
      return v.length <= 0;
    case '[object Object]':
      return Object.keys(v).length <= 0;
    default:
      return v === undefined;
  }
};

/**
 * 是否手机
 */
export const isMobile = () => /Android|webOS|iPhone|iPad|BlackBerry/i.test(navigator.userAgent);

/**
 * 延迟执行
 * @param   {Number}  duration  延迟时间(毫秒)
 * @return  {Promise}
 */
export const sleep = (duration) => {
  return new Promise((resolev) => {
    setTimeout(() => {
      resolev();
    }, duration);
  });
};