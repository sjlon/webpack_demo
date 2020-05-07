// console.log($)
// console.log(_)
console.log(IS_ENV, 'IS_ENV')

function PromiseS () {
    return new Promise((resolve, reject) => {
        resolve(1111)
    })
}

PromiseS().then(res => {
    console.log(res)
});

[1, 2, 3 ].map(i => i ** 2)

var a = [2,3 ,4 , 5]
for(let keys of a.values()) {
    console.log(keys)
}
var a = {
    a: 1,
    b: 2
}
console.log(Object.entries(a))
