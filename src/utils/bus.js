class Bus {
  funs = {};

  on = (key, fn) => {
    this.funs[key] = fn;
  };

  emit = (key, props) => {
    if (!this.funs[key]) return;

    this.funs[key](props);
  };

  off = (key) => {
    delete this.funs[key];
  };
}

export const bus = new Bus();
export default Bus;
