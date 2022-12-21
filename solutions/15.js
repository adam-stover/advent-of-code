import { getLines, ints, rangeUnion } from '../utils.js';

const URL = './inputs/15.txt';

const distance = (ax, ay, bx, by) => {
  return Math.abs(ax - bx) + Math.abs(ay - by);
}

const couldBeacon = (sensor, x, y) => {
  return distance(...sensor) < distance(sensor[0], sensor[1], x, y);
}

const countBeaconRow = (sensors, y) => {
  const cache = new Set();

  for (const sensor of sensors) {
    const d = distance(...sensor);
    const dy = Math.abs(sensor[1] - y);

    if (d >= dy) {
      const dx = d - dy;
      for (let i = sensor[0] - dx; i <= sensor[0] + dx; ++i) {
        if (
          !(sensor[2] === i && sensor[3] === y)
          && !couldBeacon(sensor, i, y)
        ) {
          cache.add(i);
        }
      }
    }
  }

  return cache.size;
}

const getBeacon = (sensors, min, max) => {
  for (let y = min; y <= max; ++y) {
    console.log(`trying row ${y}`);

    const ranges = [];

    for (const sensor of sensors) {
      const d = distance(...sensor);
      const dy = Math.abs(sensor[1] - y);

      if (d >= dy) {
        const dx = d - dy;
        const minx = min > sensor[0] - dx ? min : sensor[0] - dx;
        const maxx = max < sensor[0] + dx ? max : sensor[0] + dx;

        ranges.push([minx, maxx]);
      }
    }

    const union = rangeUnion(ranges);

    if (union[0][0] > min) {
      return [min, y];
    }

    if (union.length > 1) {
      return [union[0][1] + 1, y];
    }

    if (union[0][1] < max) {
      return [max, y];
    }
  }
}

export default async function dayFifteen() {
  const lines = await getLines(URL);

  const sensors = lines.map(ints);

  // console.log(countBeaconRow(sensors, 2000000));

  const res = getBeacon(sensors, 0, 4000000);

  console.log(res);

  console.log(res[0] * 4000000 + res[1])
}
