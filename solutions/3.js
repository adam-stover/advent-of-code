import { getLines } from '../helpers.js';

const URL = './inputs/3.txt';

const getPriority = (item) => {
  const charCode = item.charCodeAt(0);

  if (charCode > 90) return charCode - 96;
  return charCode - 38;
}

export default async function dayThree() {
  const rucksacks = await getLines(URL);

  let sum = 0;

  // for (const rucksack of rucksacks) {
  //   const mid = rucksack.length / 2;
  //   const a = rucksack.slice(0, mid);
  //   const b = rucksack.slice(mid);
  //   const c = new Set(b);
  //   let sharedItem;
  //   let i = 0;

  //   while (!sharedItem) {
  //     if (c.has(a[i])) sharedItem = a[i];
  //     else i++;
  //   }

  //   sum += getPriority(sharedItem);
  // }

  for (let i = 0; i < rucksacks.length; i += 3) {
    const a = rucksacks[i];
    const bSet = new Set(rucksacks[i + 1]);
    const cSet = new Set(rucksacks[i + 2]);
    let sharedItem;
    let j = 0;

    while (!sharedItem) {
      if (bSet.has(a[j]) && cSet.has(a[j])) sharedItem = a[j];
      else j++;
    }

    sum += getPriority(sharedItem);
  }

  console.log(sum);
}
