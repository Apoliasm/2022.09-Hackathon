//----------------------- 지도 표시 -----------------------
{
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
        mapOption = {
            center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
            level: 4 // 지도의 확대 레벨 
        };
    var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

    var zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    var markers = []; // 마커 객체 리스트
    var overlays = []; // 오버레이(info) 객체 리스트
    var clicked = false;

    // markers 리스트 속 마커를 지도에 표시
    function setMarkers(map) {
        for (var i = 0; i < markers.length; i++) {
            if (markers[i] && currOver != overlays[i]) {
                markers[i].setMap(map);
            }
        }
    }
}


//----------------------- GPS 사용 -----------------------
{
    var lat;
    var lon;
    var locPosition;
    var mainMarker = null;
    var options = {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 0
    };
    var navi;
    var start = false;

    function success(position) {
        lat = position.coords.latitude, // 위도
            lon = position.coords.longitude; // 경도

        locPosition = new kakao.maps.LatLng(lat, lon);
        displayMarker(locPosition);
        if (!start) { // 처음에만 중심 좌표로 이동
            start = true;
            moveCenter();
        }
    }

    function error(err) {
        console.log(err);
    }

    // HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
    if (navigator.geolocation) {
        navi = navigator.geolocation.watchPosition(success, error, options);
    }

    // 지도에 마커를 표시하는 함수입니다
    function displayMarker(locPosition) {
        if (mainMarker) {
            mainMarker.setMap(null);
        }
        mainMarker = new kakao.maps.Marker({
            map: map,
            position: locPosition
        });

        mainMarker.setZIndex(0);

        if (clicked) {
            calcDistc();
        }
    }

    // 지도 중심좌표를 접속위치로 변경합니다
    function moveCenter() {
        if (currOver) {
            currOver.setMap(null);
        }
        map.panTo(locPosition);
        if (clicked) {
            calcDistc();
        }
    }
}


var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
var imageSize = new kakao.maps.Size(24, 35);
var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
var currOver = null;

function makeOverListener(overlay) {
    return function () {
        if (currOver) {
            currOver.setMap(null);
        }
        if (!clicked) {
            overlay.setMap(map);
            currOver = overlay;
        }
    };
}

function makeOutListener(overlay) {
    return function () {
        overlay.setMap(null);
    };
}

function closeOverlay() {
    currOver.setMap(null);
}
//----------------------- test 마커 -----------------------
{
    var positions = [
        {
            latlng: new kakao.maps.LatLng(35.890817196411255, 128.6130298864513)
        },
        {
            latlng: new kakao.maps.LatLng(35.89084226606296, 128.60981884381906)
        },
        {
            latlng: new kakao.maps.LatLng(35.888467671969, 128.61083386949605)
        },
        {
            latlng: new kakao.maps.LatLng(35.88992791085498, 128.61750796238195)
        }
    ];
    var content =
        '<div class="wrap">' +
        '    <div class="info">' +
        '        <div class="title">' +
        '           <div class="text">쓰레기가 너무 많아요</div>' +
        '           <button class="close" onclick="closeOverlay()" title="닫기"></button>' +
        '        </div>' +
        '        <div class="body">' +
        '           <div class="image"><img src="https://img.etoday.co.kr/pto_db/2022/01/600/20220128134644_1713593_696_507.jpg" width="100%"></image></div>' +
        '           <button onclick="doDisplay()">해결하기</button>' +
        '       </div>' +
        '   </div>' +
        '</div>';

    for (var i = 0; i < positions.length; i++) {
        var marker = new kakao.maps.Marker({
            map: map,
            position: positions[i].latlng,
            image: markerImage,
        });
        marker.setZIndex(1);

        var overlay = new kakao.maps.CustomOverlay({
            content: content,
            position: marker.getPosition()
        });
        overlay.setZIndex(2);

        markers.push(marker);
        overlays.push(overlay);

        kakao.maps.event.addListener(marker, 'click', makeOutListener(overlay));
        kakao.maps.event.addListener(marker, 'click', makeOverListener(overlay));
    }
}

//----------------------- 플로깅 버튼 -----------------------
{
    var clickLine = null,
        distance = 0,
        menu = document.querySelector('#ploggingWindow');

    // 플로깅 창 띄우기
    function doDisplay() {
        menu.classList.toggle('active');
        calcDistc();
    }

    // 미터기 계산
    function calcDistc() {
        clickLine = new kakao.maps.Polyline({
            path: [locPosition, currOver.getPosition()]
        });
        distance = Math.round(clickLine.getLength());
        closeOverlay();
        clicked = true;
        setMarkers(null);
        addresscheck();
        document.getElementById("distance").innerText = distance + 'm';
    }

    // 확인 사진 첨부
    function addImage() {
        var completeImage = document.getElementById("addImage");
        var frame = document.getElementById('frame');
        var file;

        completeImage.addEventListener("change", function (e) {
            file = e.target.files[0];
            frame.src = URL.createObjectURL(file);
        });

    }

    function complete() {
        if (currOver) {
            calcDistc();
            if (distance < 20) {
                document.getElementById("addImage").click();

                var completeImage = document.getElementById("addImage");
                var frame = document.getElementById('frame');
                var file;

                completeImage.addEventListener("change", function (e) {
                    file = e.target.files[0];
                    frame.src = URL.createObjectURL(file);
                });

                swal({
                    text: "확인 후 포인트가 지급됩니다.",
                    button: "확인",
                });
                markers[overlays.indexOf(currOver)].setMap(null);
                markers[overlays.indexOf(currOver)] = null;
                overlays[overlays.indexOf(currOver)] = null;
                menu.classList.toggle('active');
                document.getElementById("address").innerText = "";
                document.getElementById("distance").innerText = "";
                distance = 0;
                currOver = null;
                clicked = false;
                setMarkers(map);
            }
            else {
                swal({
                    text: "해당 위치로 이동하세요.",
                    button: "확인",
                });
            }
        }
    }

    function cancel() {
        swal({
            text: "취소하시겠습니까?",
            buttons: {
                cancel: "아니요",
                catch: {
                    text: "예",
                    value: "catch",
                },
            },
        }).then((value) => {
            if (value == "catch") {
                menu.classList.toggle('active');
                document.getElementById("address").innerText = "";
                document.getElementById("distance").innerText = "";
                distance = 0;
                currOver = null;
                clicked = false;
                setMarkers(map);
            }
        })
    }

    // 주소-좌표 변환 객체를 생성합니다
    var geocoder = new kakao.maps.services.Geocoder();
    function addresscheck() {
        searchDetailAddrFromCoords(currOver.getPosition(), function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                var detailAddr = result[0].address.address_name;
                document.getElementById("address").innerText = detailAddr;
            }
        });
    }

    function searchDetailAddrFromCoords(coords, callback) {
        // 좌표로 법정동 상세 주소 정보를 요청합니다
        geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
    }
}


//----------------------- 등록 버튼 -----------------------
{
    var camera = document.getElementById("add");
    var frame = document.getElementById('frame');
    var posting = document.querySelector('#postingWindow');
    var file;

    camera.addEventListener("change", function (e) {
        file = e.target.files[0];
        frame.src = URL.createObjectURL(file);
        posting.classList.toggle('active');
    });

    function postingComplete() {
        newMarker();
        swal({
            text: "등록되었습니다.",
            button: "확인",
        });
        posting.classList.toggle('active');
        document.getElementById("titleText").value = null;
    }

    function postingCancel() {
        swal({
            text: "취소하시겠습니까?",
            buttons: {
                cancel: "아니요",
                catch: {
                    text: "예",
                    value: "catch",
                },
            },
        }).then((value) => {
            if (value == "catch") {
                posting.classList.toggle('active');
                document.getElementById("titleText").value = null;
            }
        })
    }

    // 새 마커 추가
    function newMarker() {
        var marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: locPosition, // 마커의 위치
            image: markerImage // 마커 이미지
        });
        marker.setZIndex(1);

        var content =
            '<div class="wrap">' +
            '    <div class="info">' +
            '        <div class="title">' +
            '           <div class="text">' + document.getElementById("titleText").value + '</div>' +
            '           <button class="close" onclick="closeOverlay()" title="닫기"></button>' +
            '        </div>' +
            '        <div class="body">' +
            '           <div class="image"><img src="' + URL.createObjectURL(file) + '" height="100%"></image></div>' +
            '           <button onclick="doDisplay()">해결하기</button>' +
            '       </div>' +
            '   </div>' +
            '</div>';

        var overlay = new kakao.maps.CustomOverlay({
            content: content,
            position: marker.getPosition(),
        });
        overlay.setZIndex(2);

        markers.push(marker);
        overlays.push(overlay);

        kakao.maps.event.addListener(marker, 'click', makeOutListener(overlay));
        kakao.maps.event.addListener(marker, 'click', makeOverListener(overlay));

        if (clicked) {
            marker.setMap(null);
        }
    }
}