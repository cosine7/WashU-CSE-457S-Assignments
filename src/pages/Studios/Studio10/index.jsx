import { json } from 'd3';
import {
  Icon,
  map as Map,
  tileLayer,
  geoJson,
  circle,
} from 'leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

Icon.Default.imagePath = './image/studio10/';

const fetchData = async url => {
  const response = await fetch(url);
  const { data: { stations } } = await response.json();
  return stations;
};

const mapPosition = [41.8781, -87.6298];

export default function Studio10() {
  const [count, setCount] = useState();

  useEffect(() => {
    (async () => {
      const data = await fetchData('https://gbfs.divvybikes.com/gbfs/en/station_information.json');
      const meta = await fetchData('https://gbfs.divvybikes.com/gbfs/en/station_status.json');
      const ctaLines = await json('./data/studio10/cta-lines.json');

      data.sort((a, b) => a.station_id - b.station_id);
      meta.sort((a, b) => a.station_id - b.station_id);

      const map = Map('chicago-map').setView(mapPosition, 12);

      tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      geoJson(ctaLines.features, {
        style: feature => ({
          color: `#${feature.properties.route_color}`,
          weight: 5,
          opacity: 0.8,
        }),
        onEachFeature: (feature, layer) => {
          const { geometry: { type }, properties: { name } } = feature;

          if (type !== 'Point') {
            return;
          }
          layer.bindPopup(`
            <strong>${name}</strong><br>
          `);
        },
      }).addTo(map);

      data.forEach((d, i) => {
        const metaData = meta[i];

        circle([d.lat, d.lon], 70, {
          color: 'red',
          fillColor: '#ddd',
          fillOpacity: 0.5,
        })
          .bindPopup(`
          <strong>${d.name}</strong><br>
          Available Bikes: ${metaData.num_bikes_available}<br>
          Available Docks: ${metaData.num_docks_available}
        `)
          .addTo(map);
      });

      setCount(data.length);
    })();
  }, []);

  return (
    <div style={{ height: '100%' }}>
      <h3>Divvy Bikes - Bike Sharing in Chicago</h3>
      <h4>
        {count}
        {' '}
        Stations
      </h4>
      <div id="chicago-map" style={{ height: '90%' }} />
    </div>
  );
}
