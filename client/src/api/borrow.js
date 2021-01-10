import fetch from "./fetch";

export function refuseBorrow(borId) {
    return fetch.post(`/api/borrow/admin/refuseborrow/${borId}`)
}


export function allowBorrow(borId) {
    return fetch.post(`/api/borrow/admin/allowborrow/${borId}`)
}


export function allowReturn(borId) {
    return fetch.post(`/api/borrow/admin/allowreturn/${borId}`)
}


export function getBorrowBooks() {
    return fetch.get('/api/borrow/borrow')
}


export function getReturnBooks() {
    return fetch.get('/api/borrow/return')
}


export function postBorrowBook(bookId, cardId) {
    return fetch.post(`/api/borrow/sq/${bookId}/${cardId}`)
}