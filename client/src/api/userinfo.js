import fetch from "./fetch";

export function getCardAvatar(cardId) {
    return fetch.get(`/api/card/cardavatar/${cardId}`)
}


export function deleteCard(cardId) {
    return fetch.post(`/api/card/deletecard/${cardId}`)
}


export function editUser(value) {
    return fetch.post('/api/user/edit', value)
}

export async function addUser(user, card) {
    return fetch.post('/api/user/create', {...user, ...card})
}


export function editCardTotal(value) {
    return fetch.post('/api/card/total', value)
}


export function getPaymentBook(cardId) {
    return fetch.get(`/api/payment/query/${cardId}`)
}

export function payForbook(payId, time) {
    return fetch.post(`/api/payment/pay/${payId}`, {payTime: time})
}

export function returnBook(borId, realTime) {
    return fetch.post(`/api/borrow/user/return/${borId}`, {borRealtime: realTime})
}

export function XQBook(borId, newTime) {
    return fetch.post(`/api/borrow/xq/${borId}`, {newTime})
}

export function getUserBook(cardId) {
    return fetch.get(`/api/book/card/${cardId}`)
}

export function getUserInfo(userId, key) {
    return fetch.get(`/api/user/query/${userId}/${key}`)
}

export function updateUserInfo(userId, data) {
    return fetch.post(`/api/user/update/${userId}`, data)
}

export function getPageUser(cur) {
    return fetch.get(`/api/user/alluser/${cur}`)
}


export function getSearchUser(radio, value, cur = 1) {
    if (!value) return getPageUser(cur)
    return fetch.get(`/api/user/searchuser/${radio}/${value}/${cur}`)
}
