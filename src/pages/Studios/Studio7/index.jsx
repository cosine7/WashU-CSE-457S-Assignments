import { json } from 'd3';
import { useRef, useEffect, useState } from 'react';
import { feature } from 'topojson-client';
import Pending from '../Pending';
import ForceSimulation from './ForceSimulation';
import Map from './Map';

export default function Studio7() {
  const [data, setData] = useState();
  const wrapper = useRef();

  useEffect(() => {
    (async () => {
      const airports = await json('./data/studio7/airports.json');
      const world = await json('./data/studio7/world-110m.json');
      const { width } = wrapper.current.getBoundingClientRect();

      setData({
        airports,
        world: feature(world, world.objects.countries),
        width,
      });
    })();
  }, []);

  return (
    <div ref={wrapper}>
      <Pending
        data={data}
        render={d => (
          <>
            <ForceSimulation width={d.width} airports={d.airports} />
            <Map {...d} />
          </>
        )}
      />
    </div>
  );
}
