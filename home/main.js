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
    var locPosition;
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
        // 지도 중심좌표를 접속위치로 변경합니다
        map.setCenter(locPosition);
    }
}


//----------------------- DB 마커 표시 -----------------------
{
    var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
    var imageSize = new kakao.maps.Size(24, 35);
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
    var positions = [
        {
            content: '<div>카카오</div>',
            latlng: new kakao.maps.LatLng(35.338526759033975, 129.020394573412)
        },
        {
            content: '<div>카카오</div>',
            latlng: new kakao.maps.LatLng(35.33590347260101, 129.0231445305009)
        },
        {
            content: '<div>카카오</div>',
            latlng: new kakao.maps.LatLng(35.333380, 129.022047)
        },
        {
            content: '<div>카카오</div>',
            latlng: new kakao.maps.LatLng(35.33493615118316, 129.01847965892148)
        }
    ];
    var content = '<div class="wrap">' +
        '    <div class="info">' +
        '        <div class="title">' +
        '            쓰레기가 너무 많아요'+
        '        </div>' +
        '        <div class="body">' +
    '                <img src="https://img.etoday.co.kr/pto_db/2022/01/600/20220128134644_1713593_696_507.jpg" width="150" height="100">'+
    '                <button><i class="fa-solid fa-route"></i>플로깅</button>' +
        '        </div>' +
        '    </div>' +
        '</div>';

    var currOver = null;
    
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
        return function() {
            if(currOver){
                currOver.setMap(null);
            }
            overlay.setMap(map);
            currOver = overlay;
        };
    }
    
    function makeOutListener(overlay) {
        return function() {
            overlay.setMap(null);
        };
    }

    kakao.maps.event.addListener(map, 'click', function() {        
        for (var i = 0; i < positions.length; i++) {
            overlays[i].setMap(null);
        }
    });













}