import { getLines } from '../utils.js';

const URL = './inputs/4.txt';

export default async function dayFour() {
  const assignments = await getLines(URL);
  let count = 0;

  for (let i = 0; i < assignments.length; ++i) {
    const [a, b] = assignments[i].split(',');
    const [aStart, aEnd] = a.split('-').map(Number);
    const [bStart, bEnd] = b.split('-').map(Number);

    // if (
    //   (aStart <= bStart && aEnd >= bEnd)
    //   || (bStart <= aStart && bEnd >= aEnd)
    // ) {
    //   count++;
    // }

    if (
      (aStart <= bStart && aEnd >= bStart)
      || (bStart <= aStart && bEnd >= aStart)
      || (aEnd <= bEnd && aStart >= bEnd)
      || (bEnd <= aEnd && bStart >= aEnd)
    ) count++;
  }

  console.log(count);
}
