function setPopup(feature, layer) {
	// assemble transmitter popup content
    var msg = '';
    if (feature.properties.name)
        msg += '<h2>' + feature.properties.name + '</h2>';
    if (feature.properties.channel)
        msg += '<b>Channel: ' + feature.properties.channel + '</b><br>'
    if (feature.properties.location)
        msg += '<b>Location: ' + feature.properties.location + '</b><br>';
    if (feature.properties.start)
        msg += 'Start: ' + feature.properties.start + '<br>';
    if (feature.properties.operator) {
        msg += 'Operator: ';
        if (feature.properties.operatorUrl)
            msg += '<a href="' + feature.properties.operatorUrl + '">';
        msg += feature.properties.operator;
        if (feature.properties.operatorUrl)
            msg += '</a>';
        msg += '<br>';
    }
    if (feature.properties.moreInfoUrl)
        msg += '<a href="' + feature.properties.moreInfoUrl + '">More information</a>';
    layer.bindPopup(msg);
}


function createGeo(map, imageUrlPrefix, controlLayers, layerData, layerName, displayName) {
	// set layer icon
    var icon = L.icon({
        iconUrl: imageUrlPrefix + "images/icon_" + layerName + ".png",
        iconSize: [32, 49]
    });
    
    // add all transmitters from JSON
    var geo = L.geoJSON(layerData, {
        onEachFeature: function(feature, layer) {
            layer.setIcon(icon);
            setPopup(feature, layer);
        },
        attribution: '<a href="https://www.opendigitalradio.org">Opendigitalradio</a>'
    });
    
    // add layer
    geo.addTo(map);
    controlLayers.addOverlay(geo, '<img src="' + imageUrlPrefix + 'images/icon_' + layerName + '.png" width=16> ' + displayName);

    return geo;
}


function createMap(mapID, imageUrlPrefix) {
    // create map
    var map = L.map(mapID);

    // add scale control
    L.control.scale().addTo(map);

    // add layers control
    var controlLayers = L.control.layers(null, null, {
        collapsed: false
    });
    controlLayers.addTo(map);

    // add OSM tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 2,
        maxZoom: 16, // >16 is not cached by OSM
        attribution: 'Map data © <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // add transmitter layers
    var geoRegular = createGeo(map, imageUrlPrefix, controlLayers, dataRegular, "regular", "regular");
    var geoTest = createGeo(map, imageUrlPrefix, controlLayers, dataTest, "test", "test");
    var geoInactive = createGeo(map, imageUrlPrefix, controlLayers, dataInactive, "inactive", "inactive");

    // fit all transmitters into view
    var bounds = geoRegular.getBounds().extend(geoTest.getBounds()).extend(geoInactive.getBounds());
    map.fitBounds(bounds, {
        padding: [50, 50]
    });

    return map;
}
