import { combineReducers } from 'redux'
// state 初始化 若有傳值近來則不參照預設
let snackBarReducer = (state = {}, action) => {
    switch (action.type) {
        case 'SHOW':
            return { 'open': true, 'text': action.text, 'severity': action.severity }
        case 'HIDEN':
            return { ...state, 'open': false }
        default:
            return state
    }
}

let loginReducer = (state = false, action) => {
    switch (action.type) {
        case 'IS_LOGIN':
            return true
        case 'IS_LOGOUT':
            return false
        default:
            return state
    }
}

let userReducer = (state = {}, action) => {
    switch (action.type) {
        case 'USER_DATA':
            return action.data
        case 'USER_DATA_CLEAR':
            return {}
        default:
            return state
    }
}

let allReducer = combineReducers({
    snackBarReducer: snackBarReducer,
    loginReducer: loginReducer,
    userReducer: userReducer,

})

export default allReducer
