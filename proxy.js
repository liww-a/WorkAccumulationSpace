let obj = {}
let handler = {
    get (target, propKey, receiver) {

    },
    set (target, propKey, value, receiver) {

    },
    has (target, propKey) {

    },
    deleteProperty (target, propKey) {

    },
    ownKeys (target) {

    },
    getOwnPropertyDescriptor (target, propKey) {

    },
    defineProperty (target, propKey, propDesc) {

    },
    preventExTensions (target) {

    },
    isExtensible (target) {

    },
    setPrototypeOf (target, proto) {

    },
    apply (target, object, args) {

    },
    construct (target, args) {

    }
}
let proxyObj = new Proxy(obj, handler)