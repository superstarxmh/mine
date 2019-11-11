import fetch from '../router/axios';

export default {
    insertLog(data) {
        return fetch({
            url: 'insertLog/insert',
            method: 'post',
            data
        })
    }
}
