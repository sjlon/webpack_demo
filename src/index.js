// import $ from 'jquery'
// import _ from 'lodash'
import '@/style/index.css'
import '@/style/index.less'
import Icon from './images/500x500.jpg'
import axios from 'axios'
import str  from './hotModule'
require('./demo')

//  function component() {
//     let ele = document.createElement('div')
//     ele.innerHTML = _.join(['hello', 'dfdfdsfas', '!111111111111'], ' ')
//     ele.classList.add('weight')

//     return ele

// }
async function component() {
        let ele = document.createElement('div')
        const { default: _} = await import('lodash')
    ele.innerHTML = _.join(['hello', 'dfdfdsfas', '!111111111111'], ' ')
    ele.classList.add('weight')

    return ele
}
function ImgEle() {
    let myIcon = new Image()
    myIcon.src = Icon
    return myIcon
}

component().then(res => {
    document.body.appendChild(res)
})
// document.body.appendChild(component())
document.body.appendChild(ImgEle())
async function getUserInfo() {
    let data = await axios.get('/api/getUserInfo')
    console.log(data)
}
getUserInfo()


// if(module.hot) {
//     module.hot.accept('./hotModule.js', () => {
//         console.log('HMR更新')
//         let str = require('./hotModule')
//         console.log(str)
//     })
// }
