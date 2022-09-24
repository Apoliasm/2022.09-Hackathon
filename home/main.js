//----------------------- 지도 표시 -----------------------
{
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
        mapOption = {
            center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
            level: 4 // 지도의 확대 레벨 
        };
    var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
    // 지도에 표시된 마커 객체를 가지고 있을 배열입니다
    var markers = [];
    var overlays = [];
    var clicked = false;
    var locPosition;
    
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
    // HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
    if (navigator.geolocation) {

        // GeoLocation을 이용해서 접속 위치를 얻어옵니다
        navigator.geolocation.getCurrentPosition(function (position) {

            var lat = position.coords.latitude, // 위도
                lon = position.coords.longitude; // 경도
            locPosition = new kakao.maps.LatLng(lat, lon); // 인포윈도우에 표시될 내용입니다

            // 마커와 인포윈도우를 표시합니다
            displayMarker(locPosition);
        });

    } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
        alert('geolocation을 사용할수 없어요..');
    }

    // 지도에 마커를 표시하는 함수입니다
    function displayMarker(locPosition) {
        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            map: map,
            position: locPosition
        });
        if (currOver) {
            currOver.setMap(null);
        }
        // 지도 중심좌표를 접속위치로 변경합니다
        map.setCenter(locPosition);
        if(clicked)
            calcDistc();
    }
}


//----------------------- DB 마커 표시 -----------------------
{
    var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
    var imageSize = new kakao.maps.Size(24, 35);
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
    var currOver = null;
    var positions = [
        {
            latlng: new kakao.maps.LatLng(35.338526759033975, 129.020394573412)
        },
        {
            latlng: new kakao.maps.LatLng(35.33590347260101, 129.0231445305009)
        },
        {
            latlng: new kakao.maps.LatLng(35.333380, 129.022047)
        },
        {
            latlng: new kakao.maps.LatLng(35.33493615118316, 129.01847965892148)
        }
    ];
    var content =
        '<div class="wrap">' +
        '    <div class="info">' +
        '        <div class="title">쓰레기가 너무 많아요</div>' +
        '        <button class="close" onclick="closeOverlay()" title="닫기"></button>' +
        '        <div class="body">' +
        '           <div class="image"><img src="https://img.etoday.co.kr/pto_db/2022/01/600/20220128134644_1713593_696_507.jpg" width="100%"></image></div>' +
        '           <button onclick="doDisplay()">해결하기</button>' +
        '       </div>' +
        '   </div>' +
        '</div>';


    for (var i = 0; i < positions.length; i++) {
        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: positions[i].latlng, // 마커의 위치
            image: markerImage // 마커 이미지
        });

        var overlay = new kakao.maps.CustomOverlay({
            content: content,
            position: marker.getPosition()
        });
        markers[i] = marker;
        overlays[i] = overlay;

        kakao.maps.event.addListener(marker, 'click', makeOutListener(overlay));
        kakao.maps.event.addListener(marker, 'click', makeOverListener(overlay));
    }

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
}


//----------------------- 플로깅 버튼 -----------------------
{
    var clickLine = null,
        distance = 0
        menu = menu = document.querySelector('#ploggingWindow');

    function doDisplay(){
        menu.classList.toggle('active');
        calcDistc();
    }

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

    function complete() {
        if(currOver){
            calcDistc();
            if (distance < 200) {
                //카메라찍음 사진 전송
                swal("확인 후 포인트가 지급됩니다.");
                markers[overlays.indexOf(currOver)].setMap(null);
                markers[overlays.indexOf(currOver)] = null;
                overlays[overlays.indexOf(currOver)] = null;
                cancel();
            }
            else {
                swal("해당 위치로 이동하세요.");
            }
        }
    }

    function cancel() {
        menu.classList.toggle('active');
        document.getElementById("address").innerText = "";
        document.getElementById("distance").innerText = "";
        currOver = null;
        clicked = false;
        setMarkers(map);
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
    function addMarker() {

    }
}







