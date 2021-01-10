import fetch from './fetch'

export function postLogin(params) {
    return fetch.post('/api/card/login', params)
}