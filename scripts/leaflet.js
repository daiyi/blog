var _ = require("lodash");
var tags = hexo.extend.tag;

function leaflet(args, content) {
  var options = {};

  if (content.length) {
    content.split("\n").map((d) => {
      var list = d.split(/:(.+)/);
      options[list[0]] = list[1];
    });
  }

  var model = {
    id: "leaflet" + ((Math.random() * 9999) | 0),
    width: args[3] || "100%",
    height: args[4] || "250px",
    zoom: args[2] || 8,
    scrollwheel: false,
    center: {
      latitude: args[0],
      longitude: args[1],
    },
    baseLayer:
      options.baseLayer ||
      hexo.config.leaflet.baseLayer ||
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      options.attribution ||
      hexo.config.leaflet.attribution ||
      'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors.',
    geoJSON: options.geoJSON,
  };

  var compiledMap = _.template(template);

  return (
    compiledMap(model) +
    "<noscript>You'll need javacript to see the map.</noscript>"
  );
}

tags.register("leaflet", leaflet, {
  async: false,
  ends: true,
});

const template = `
<div id="<%- id %>" style="
            height: <%- height %>;
            width: <%- width %>;
            margin: 0px;
            padding: 0px
            ">
</div>
<script defer="defer">
  window.hexoLmaps = window.hexoLmaps || { maps: {}};
  window.hexoLmaps.maps['init<%- id %>'] = function init() {
    var mymap = L.map('<%- id %>');
    mymap.setView([<%- center.latitude %> , <%- center.longitude %>], <%- zoom %>);
    var osmURL = '<%- baseLayer %>';
    L.tileLayer(osmURL, {
        attribution: '<%- attribution %>',
        maxZoom: 18
    }).addTo(mymap);
    var geoJSON = '<%- geoJSON %>'
    if (geoJSON) {
      doLoadFile(geoJSON, function(data) {
        var layer = L.geoJson(JSON.parse(data), {
          onEachFeature: function (feature, layer) {
            var title = '<b>'+feature.properties.title+'</b>';
            var description = feature.properties.description ? '<p>'+feature.properties.description+'</p>' : '';
            layer.bindPopup(title+description);
          }
        });
        layer.addTo(mymap);
        mymap.fitBounds(layer.getBounds());
      });
    }
  }
  function doLoadFile(url, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        callback(xhttp.responseText);
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
  }
  function makeMaps() {
    for (var map in window.hexoLmaps.maps) {
       console.log('map #', map);
       window.hexoLmaps.maps[map]();
    }
  }
  function doLoadScript(url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onreadystatechange = script.onload = function() {
      if (!callback.done && (!script.readyState || /loaded|complete/.test(script.readyState))) {
        callback.done = true;
        callback();
      }
    };
    document.querySelector('head').appendChild(script);
  }
  function loadScript() {
    window.hexoLmaps.mapScripLoaded = true;
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    document.querySelector('head').appendChild(css);

    doLoadScript('https://unpkg.com/leaflet@1.7.1/dist/leaflet-src.js', makeMaps)
  }
  if (!window.hexoLmaps.mapScripLoaded) {
    loadScript();
  }
</script>
`;

// # Development notes

// Forked from https://www.npmjs.com/package/hexo-tag-leaflet v1.0.4

// Still depends on lodash! So either the parent repo should have lodash, or lodash should be vendored here lol

// # Documentation

// ## Basic syntax

// The main tag can have up to 5 arguments, with none being required. To set a blank argument, use `0`. If a map is created without a center point, it will default to some fixed point. If a zoom level is not specified, it will default to 8.

// ```
// {% leaflet latitude longitude zoom width height %}
// ```

// ## Simple Example

// ```md
// {% leaflet 50.978056 11.029167 10 100% 450px %}
// {% endleaflet %}
// ```

// ## Loading a geojson route

// The boundingBox of the map will be set to cover the complete track. Markers will have popups displaying `title` and `description` attributes.

// ```md
// {% leaflet 51.307778 11.049167 13 100% 400px %}
// geoJSON:/routes/20160522_1431_Hiking.json
// {% endleaflet %}
// ```

// You may need to `skip_render` geojson files in your `_config.yml` so that they don't get rendered as posts:

// ```md
// skip_render:
// - "**.json"
// ```

// ## Config

// You can configure the plugin within the `_config.yml` file. More baselayers: https://osmlab.github.io/editor-layer-index

// ```
// leaflet:
//   baseLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
//   attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors.'
// ```

// The given values in this example are the default values, if no configuration is set.

// You can override this global config for a specific leaflet tag as follows:

// ```
// {% leaflet 51.307778 11.049167 13 100% 350px %}
// baseLayer: http://c.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png
// attribution: ©OpenStreetMap
// {% endleaflet %}
// ```
