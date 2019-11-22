// sort  是按照ascii 码来排序的
// ShadowRoot(callback)
// callback  返回正值 位置互换, 返回负值 位置不变
// 1, 参数 a, b
// 2,返回值: 1, 负值, a 排在前面
                // 2, 正值, b排在前面

// 随机排序
var arr = [1, 2, 3, 4, 5, 6]
arr.sort(function (a, b) {
    var  rand = Math.random()
    return rand - 0.5
})