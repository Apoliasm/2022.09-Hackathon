const id = document.getElementById('id')
const password = document.getElementById('password')
const login = document.getElementById('login')
const sign_id = document.getElementById('sign_id')
const sign_password = document.getElementById('sign_password')
const sign_login = document.getElementById('sign_login')
let errStack = 0;

login.addEventListener('click', () => {
    if (id.value == 'computer') {
        if (password.value == '2019') {
            alert('로그인 되었습니다!')
        }
        else {
            alert('아이디와 비밀번호를 다시 한 번 확인해주세요!')
            errStack ++;
        }
    }
    else {
        alert('존재하지 않는 계정입니다.')
    }

    if (errStack >= 5) {
        alert('비밀번호를 5회 이상 틀리셨습니다. 비밀번호 찾기를 권장드립니다.')
    }
});
sign_login.addEventListener('click', () => {
    alert('가입을 환영합니다.')
});