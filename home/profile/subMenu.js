if (localStorage.getItem("point") == null) {
    localStorage.setItem("point", 12000);
}
var potalPoint = localStorage.getItem("point");

function updatePoint() {
    document.getElementById("point_text").innerText = potalPoint;
    document.getElementById("gift_text").innerText = localStorage.getItem("price");
}

function exchanging(num) {
    localStorage.setItem("price", num);
    location.href = 'exchange.html';
}

function calcPoint() {
    var total = parseInt(localStorage.getItem("point")),
        price = parseInt(localStorage.getItem("price"));
    if (total >= price) {
        total -= localStorage.getItem("price");
        localStorage.setItem("point", total);
        location.href = 'last_change.html';
    }
    else{
        swal({
            text: "포인트가 부족합니다.",
            button: "확인",
        }).then(() => {
            location.href ='init.html';
            }
        )
    }
}

updatePoint();
