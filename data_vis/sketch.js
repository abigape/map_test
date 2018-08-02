let subscriberData;
let trainMap;
let canvas;
let countries;
let data = [];

// Create a new Mappa instance using Leaflet.
const mappa = new Mappa('Leaflet');
const options = {
  lat: 0,
  lng: 0,
  zoom: 1.5,
  style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
}

function preload() {
  subscriberData = loadTable('subscribers_geo.csv', 'csv', 'header');
  countries = loadJSON('countries.json');
}

function setup() {
	canvas = createCanvas(1000, 800);
  trainMap = mappa.tileMap(options);

  trainMap.overlay(canvas);

  let maxSubs = 0;
  let minSubs = Infinity;

  for (let row of subscriberData.rows) {
    let country = row.get('country_id').toLowerCase();
    let latlon = countries[country];
    // Only if defined
    if(latlon) {
      let lat = latlon[0];
      let lon = latlon[1];
      let subCount = Number(row.get('subscribers'));  // Don't get a number from CSV by default, it's a string
      data.push({lat, lon, subCount});

      if (subCount > maxSubs) {maxSubs = subCount;}
      if (subCount < minSubs) {minSubs = subCount;}

    }
  }

  let minD = sqrt(minSubs);
  let maxD = sqrt(maxSubs);
  for (let country of data) {
    country.diameter = map(sqrt(country.subCount), minD, maxD, 1, 10);
  }

  console.log(data);

}

function draw() {
  clear();

  for (let country of data) {
    const pix = trainMap.latLngToPixel(country.lat, country.lon);
    fill(255, 0, 200, 100);
    const zoom = trainMap.zoom();
    const scl = pow(2, zoom);
    ellipse(pix.x, pix.y, country.diameter * scl);
  }

}
