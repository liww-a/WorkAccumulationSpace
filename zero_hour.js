
// function p1(ms) {
//     return new Promise((resolve, reject) => {
//         resolve('p1')
//     });
// }
// function p2 () {
//     return new Promise((resolve, reject) => {
//         resolve('p2')
//     })
// }


// p1().then(value => {
//     console.log(value)
//     p2()
// }).then(value => {
//     console.log(value);
//     p3()
// }).then(value => {
//     console.log(value)
// })
// const p2 = new Promise((resolve, reject) => {
//     // resolve('wo shi p2')
// })

// const p1 = new Promise(function (resolve, reject) {
//     return resolve('p1')
// })

// p1.then((res) => {
//     console.log('first');
//     return res
// }).then(res => {
//     console.log('second');
//     console.log(res)
// })


let ms = {};

function getItem(key) {
    return key in ms ? ms[key] : null;
}

function setItem(key, value) {
    ms[key] = value;
}

function clear() {
    ms = {};
}

module.exports = { getItem, setItem, clear };
// 等同于
module.exports = {
    getItem: getItem,
    setItem: setItem,
    clear: clear
};
