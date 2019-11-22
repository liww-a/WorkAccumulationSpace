// 观察者
var shopObj = {}
// 被观察者 --商品列表
shopObj.list = []
// 订阅
shopObj.listen = function (key, fn) {
    if (!this.list[key]) {
        this.list[key] = []
    }
    this.list[key].push(fn)
}
// 发布消息
shopObj.publish = function (key) {
    for (var i = 0, fn; fn = this.list[key][i++]; ) {
        fn.apply(this, arguments)
    }
}
// a添加订阅
shopObj.listen('huawei', function (brand, model) {
    console.log(brand, model);
})
    //  b添加订阅
shopObj.listen('apple', function (brand, model) {
    console.log(brand, model);
})
console.log(shopObj.list);
shopObj.publish('huawei', 'p30')
shopObj.publish('apple', 'iphone 11')