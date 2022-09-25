function alerting(str) {
  swal({
    text: str,
    button: "확인",
  });
}


function signup_geturl() {
  const sign_name = document.getElementById('name_input')
  const sign_id = document.getElementById('id_input')
  const sign_password = document.getElementById('pw_input')
  const sign_login = document.getElementById('signup_text')
  if (sign_name.value == '') {
    alerting('이름을 입력하세요')
  } else if (sign_id.value == '') {
    alerting('아이디를 입력하세요')
  } else if (sign_password.value == '') {
    alerting('비밀번호를 입력하세요')
  } else {
    swal({
      text: "가입을 환영합니다",
      button: "확인",
    }).then(() => {
      location.href = '../index.html';
    })
  }
}