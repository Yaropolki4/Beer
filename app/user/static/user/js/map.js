let map = document.querySelector('.map');


ymaps.ready(init);
function init() {
    var myMap = new ymaps.Map("map", {
            center: [55.76, 37.64],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        })

     let objectManager = new ymaps.ObjectManager({
        // Включаем кластеризацию.
        clusterize: true,
        // Опции кластеров задаются с префиксом 'cluster'.
        clusterHasBalloon: false,
        // Опции геообъектов задаются с префиксом 'geoObject'.
        geoObjectOpenBalloonOnClick: false
    });
    //Непонятная настройка с кластером
    objectManager.clusters.options.set({
        preset: 'islands#grayClusterIcons',
        hintContentLayout: ymaps.templateLayoutFactory.createClass('Группа объектов')
    });
    //иконка
    objectManager.objects.options.set('preset', 'islands#grayIcon');
    //добавление точки
    //добавление менеджера на карту
    // метка по клику
    let counter = 0
    myMap.events.add('click', function (e) {
        counter++;
        var coords = e.get('coords');
        //myPlacemark = createPlacemark(coords);
       // myMap.geoObjects.add(myPlacemark);
        //myPlacemark.geometry.setCoordinates(coords);
            //myPlacemark.events.add('dragend', function (event) {
                //getAddress(myPlacemark.geometry.getCoordinates());
                //console.log(myPlacemark.geometry.getCoordinates())
            //});
        //getAddress(coords);
        //console.log(coords)
        objectManager.add({
        type: 'Feature',
        id: `${counter}`,
        geometry: {
            type: 'Point',
            coordinates: coords,
        },
        properties: {
            hintContent: 'Содержание всплывающей подсказки',
            balloonContent: 'Содержание балуна'
        }
    });
    console.log(objectManager.objects._objectsById)
    });
    myMap.geoObjects.events.add('dblclick', function (e) {
        // Получение ссылки на дочерний объект, на котором произошло событие.
        let object = e.get('target');
        console.log(object);
        objectManager.remove(object);
        console.log(1)
    });
    myMap.geoObjects.add(objectManager);
    function getAddress(coords) {
        myPlacemark.properties.set('iconCaption', 'поиск...');
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);

            myPlacemark.properties
                .set({
                    // Формируем строку с данными об объекте.
                    iconCaption: [
                        // Название населенного пункта или вышестоящее административно-территориальное образование.
                        firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                        // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
                        firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                    ].filter(Boolean).join(', '),
                    // В качестве контента балуна задаем строку с адресом объекта.
                    balloonContent: firstGeoObject.getAddressLine()
                });
        });
    }


        myMap.controls.remove('geolocationControl'); // удаляем геолокацию
        myMap.controls.remove('searchControl'); // удаляем поиск
        myMap.controls.remove('trafficControl'); // удаляем контроль трафика
        myMap.controls.remove('typeSelector'); // удаляем тип
        myMap.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
        myMap.controls.remove('zoomControl'); // удаляем контрол зуммирования
        myMap.controls.remove('rulerControl'); // удаляем контрол правил
        map.addEventListener('click', event => {
            if(event.target.closest('.nav')!=nav){
                nav.classList.remove('visible');
                borderButton.classList.remove('visible');
                notifications.classList.remove('visible');
                friends.classList.remove('visible');
            }
        });
}




