const sign_name = document.getElementById('sign_name')
const sign_id = document.getElementById('sign_id')
const sign_password = document.getElementById('sign_password')
const sign_login = document.getElementById('sign_login')

sign_login.addEventListener('click', () => {
    if(sign_name.value==''){
        alert('이름을 입력하세요')
    }else{
        alert(sign_name.value + '님 가입을 환영합니다.')
        return './home.html'
    }
    
});