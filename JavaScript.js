// Mutability & Reference Equality

const arr = [1, 2];
const copy = arr;

copy.push(3);
console.log(arr === copy);
console.log(arr);

// Closures & Scope
function makeCounter() {
  let count = 0;
  return function () {
    count++;
    console.log(count);
  };
}

const counter1 = makeCounter();
counter1();
counter1();

const counter2 = makeCounter();
counter2();

// Event Loop / Microtasks
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3");
});

console.log("4");

// this and Arrow Functions

const obj = {
  value: 42,
  regular: function () {
    return this.value;
  },
  arrow: () => {
    return this.value;
  },
};

console.log(obj.regular());
console.log(obj.arrow());

/////////////////////

const user = {
  name: "Mohamed",
  sayHi() {
    setTimeout(function () {
      console.log(this.name);
    }, 100);
  },
};

user.sayHi();

//  Async/Await and Event Loop
async function f() {
  console.log("1");
  await Promise.resolve();
  console.log("2");
}

console.log("start");
f();
console.log("end");
