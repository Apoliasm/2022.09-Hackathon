function alerting(str){
    swal({
        text: str,
        button: "확인",
    });
}

function geturl() {
    const id = document.getElementById('id_input')
    const password = document.getElementById('pw_input')
    const login = document.getElementById('signup_label')
    let errStack = 0;
    if (id.value == 'computer' && password.value == '2019') {
        swal({
            text: "로그인 되었습니다.",
            button: "확인",
          }).then(() => {
            location.href ='home.html';
          })
    } else if (id.value == '') {
        alerting('아이디를 입력하세요.');
    } else if (password.value == '') {
        alerting('비밀번호를 입력하세요.');
    }
    else {
        alerting('아이디 또는 비밀번호가\n틀렸습니다.');
    }

    if (errStack >= 5) {
        alert('비밀번호를 5회 이상 틀리셨습니다. 비밀번호 찾기를 권장드립니다.')
        location.href = './index.html';
    }
}