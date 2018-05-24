function delay(s) {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("Delay Error")), s)
  })
}

function *gen(a) {
  try {
    let b = yield delay(1000);
    console.log('inner');
    let c = yield delay(2000);
  } catch (e) {
    console.log(e)
  }
	
  console.log('outer')
	return a;
}

const co = (gen) => (...args) => {

  return new Promise((resolve, reject) => {
    const it = gen(...args);
    onFulfilled();

    function onFulfilled(res) {
      let ret
      try {
        ret = it.next(res);
      } catch (e) {
        return reject(r);
      }
      next(ret);
    }

    function next({value, done}) {
      if (done) return resolve(value)
      if(value) return value.then(onFulfilled, onRejected);
      return onRejected(new Error("Must have value"))
    }

    function onRejected(err) {
      let ret;
      try {
        ret = it.throw(err);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }
  })
}

const genF = co(gen);
genF(1).then(d => console.log(d));