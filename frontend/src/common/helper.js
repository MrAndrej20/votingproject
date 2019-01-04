export const getUser = () => {
    const cookies = decodeURIComponent(document.cookie).split('; ');
    const user = cookies.find(cookie => {
        const parts = cookie.split('=');
        return parts[0] === 'user' && parts[1] !== '';
    });

    return user && user.split('=')[1];
};

export const MOCK = [
    { name: '-', options: [] },
    { name: 'poll1', options: ['op1', 'op2'] },
    { name: 'poll2', options: ['op1', 'op2'] },
    { name: 'poll3', options: ['op1', 'op2', 'op3', 'op4'] },
    { name: 'poll4', options: ['op1', 'op2', 'op3', 'op4', 'op5', 'op6', 'op7'] },
    { name: 'poll5', options: ['op1', 'op2', 'op3', 'op4', 'op5', 'op6', 'op7'] },
    { name: 'poll6', options: ['op1', 'op2', 'op3', 'op4', 'op5', 'op6', 'op7'] },
    { name: 'poll7', options: ['op1', 'op2', 'op3', 'op4', 'op5', 'op6', 'op7'] },
    { name: 'poll8', options: ['op1', 'op2', 'op3', 'op4', 'op5', 'op6', 'op7'] },
    { name: 'poll9', options: ['op1', 'op2', 'op3', 'op4', 'op5', 'op6', 'op7'] },
    { name: 'poll10', options: ['op1', 'op2', 'op3', 'op4', 'op5', 'op6', 'op7'] },
    { name: 'poll11', options: ['op1', 'op2', 'op3', 'op4', 'op5', 'op6', 'op7'] },
    { name: 'poll12', options: ['op1', 'op2', 'op3', 'op4', 'op5', 'op6', 'op7'] }
];

export function constructRequest(method, body = null) {
    return {
        method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
    }
}