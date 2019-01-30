export const getCookie = (key) => {
    const cookies = decodeURIComponent(document.cookie).split('; ');
    const cookie = cookies.find(ck => {
        const parts = ck.split('=');
        return parts[0] === key && parts[1] !== '';
    });

    return cookie && cookie.split('=')[1];
};

export const MOCK = [
    {name: '-', options: []},
    {name: 'poll1', options: [{option: 'op1', voteCount: 3}, {option: 'op2', voteCount: 6}]},
    {
        name: 'poll2',
        options: [{option: 'op1', voteCount: 4}, {option: 'op2', voteCount: 0}, {option: 'op3', voteCount: 3}]
    },
    {
        name: 'poll3',
        options: [{option: 'op1', voteCount: 2}, {option: 'op2', voteCount: 7}, {
            option: 'op3',
            voteCount: 4
        }, {option: 'op4', voteCount: 1}]
    },
];

export function constructRequest(method, body = null) {
    return {
        method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-auth-header': getCookie('jwt')
        },
        credentials: 'include',
        mode: 'cors',
        body
    }
}

export function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

export function generateColors(count) {
    const colors = [];

    for (let i = 0; i < count; i++) {
        colors.push(getRandomColor());
    }

    return colors;
}