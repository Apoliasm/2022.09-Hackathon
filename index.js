window.initMap = function () {
  
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.5400456, lng: 126.9921017 },
    zoom: 10
  });
  
  
// BOM의 navigator객체의 하위에 geolocation객체가 새로 추가되었음.
window.navigator.geolocation.getCurrentPosition( function(position){ //OK
  const bounds = new google.maps.LatLngBounds();
    var lat= position.coords.latitude;
    var lng= position.coords.longitude;
    document.getElementById('target').innerHTML="위도 : "+lat+", 경도 : "+lng;
    const marker = new google.maps.Marker({
      position: {lat, lng},
      lable : "ME",
      map : map
    });
    bounds.extend(marker.position);
    map.fitBounds(bounds);
} ,
function(error){ //error
    switch(error.code){
        case error.PERMISSION_DENIED:
            str="사용자 거부";
            break;
        case error.POSITION_UNAVAILABLE:
            str="지리정보 없음";
            break;
        case error.TIMEOUT:
            str="시간 초과";
            break;
        case error.UNKNOWN_ERROR:
            str="알수없는 에러";
            break;
    }
    document.getElementById('target').innerHTML=str; //에러코드 출력
});

};
