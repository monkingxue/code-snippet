function composeAsync (middleware) {
	if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, function next () {
          return dispatch(i + 1)
        }))
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}

class Application {
  constructor() {
    this.middleware = []
  }

  use(fn) {
    this.middleware.push(fn);
    return this;
  }

  run() {
    const fn = compose(this.middleware)
    fn(this, () => console.log('done'))
  }
}

const app = new Application();

app.use((ctx, next) => {
  console.log('before 1');
  next();
  console.log('after 1')
})

app.use((ctx, next) => {
  console.log('before 2');
  next();
  console.log('after 2')
})

app.use((ctx, next) => {
  console.log('before 3');
  next();
  console.log('after 3')
})

app.run()

