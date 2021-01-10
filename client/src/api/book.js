import fetch from "./fetch";

export function getPageBorrow(cur) {
    return fetch.get(`/api/borrow/allborrow/${cur}`)
}

export function getSearchBorrow(radio, value, cur = 1) {
    if (!value) return getPageBorrow(cur)
    // let url = '/api/book/searchbook/'
    return fetch.get(`/api/borrow/searchborrow/${radio}/${value}/${cur}`)
}

export function deleteBook(bookId) {
    return fetch.post(`/api/book/deletebook/${bookId}`)
}

export function editBook(values) {
    return fetch.post('/api/book/admin/editbook', values).catch(res => {
        return {
            status: 500
        }
    })
}

export function addBook(values) {
    return fetch.post('/api/book/admin/addbook', values).catch(res => {
        return {
            status: 500
        }
    })
}

export function getInitBook() {
    return fetch.get('/api/book/allbook')
}

export function getPageBook(cur) {
    return fetch.get(`/api/book/allbook/${cur}`)
}

export function getSearchBook(radio, value, cur = 1) {
    if (!value) return getPageBook(cur)
    // let url = '/api/book/searchbook/'
    return fetch.get(`/api/book/searchbook/${radio}/${value}/${cur}`)
}

export function getClass() {
    return fetch.get('/api/book/class')
}