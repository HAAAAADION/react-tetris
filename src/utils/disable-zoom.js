export default () => {
  document.addEventListener('gesturestart', (event) => {
    event.preventDefault();
  });
  
  var lastTouchEnd = 0;
  document.documentElement.addEventListener('touchend', (event) => {
    var now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
};
