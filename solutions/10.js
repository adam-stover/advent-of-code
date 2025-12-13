import { getLines, ints, count, filterMap, has, max, min, copyExcept, rotateMatrix, sum, log, cloneMatrix } from '../utils.js';

let URL = './inputs/10.txt';
// URL = './inputs/t.txt';

const ON = '#';
const OFF = '.';

const getMinPresses = (target, buttons, startingState) => {
  const cache = {};

  const fn = (state, pressedButtons) => {
    if (pressedButtons === undefined) pressedButtons = buttons.map(_ => false);
    if (target.every((t, i) => t === state[i])) return 0;

    const key = `${state.join('-')}|${pressedButtons.join('-')}`;
    if (!has(cache, key)) cache[key] = min(buttons.map((stateList, i) => {
      if (pressedButtons[i]) return Infinity;
      const nextState = [...state];
      const nextPressedButtons = pressedButtons.map((b, index) => index === i ? true : b);
      for (const i of stateList) {
        nextState[i] = nextState[i] === OFF ? ON : OFF;
      }
      return 1 + fn(nextState, nextPressedButtons);
    }));
    return cache[key];
  }

  return fn(startingState);
}

export async function run1() {
  const lines = await getLines(URL);

  const presses = [];

  for (let i = 0; i < lines.length; i++) {
    log(`processing ${i}`)
    const line = lines[i];
    const pieces = line.split(' ');
    const state = [];
    const targets = [];
    const buttons = [];

    for (let i = 1; i < pieces[0].length - 1; i++) {
      if (pieces[0][i] === ON) targets.push(ON);
      else if (pieces[0][i] === OFF) targets.push(OFF);
      state.push(OFF);
    }

    for (let i = 1; i < pieces.length - 1; i++) {
      buttons.push(ints(pieces[i]));
    }

    presses.push(getMinPresses(targets, buttons, state));
  }

  const res = presses.reduce((acc, cur) => acc + cur);
  log(res);
}

// const stateKey = (state) => state.join('-');

// const stateDiff = (target, state) => target.map((jolt, i) => jolt - state[i]);
// const WIN = 0;
// const LOW = 1;
// const BUST = 2;
// const INSUFFICIENT_PYLONS = 3;

// const genius = (target, buttons) => {
//   buttons.sort((a, b) => b.length - a.length);
//   const hash = { [stateKey(target.map(_ => 0))]: 0 };
//   // const hashPerButton = buttons.map(_ => ({ [stateKey(target.map(_ => 0))]: 0 }));
//   for (let i = 0; i < buttons.length; i++) {
//     const button = buttons[i];
//     const state = target.map(_ => 0);
//     let steps = 0;

//     while (true) {
//       for (let j = 0; j < button.length; j++) {
//         const index = button[j];
//         state[index]++;
//       }
//       steps++;
//       const key = stateKey(state);
//       if (has(hash, key) && hash[key] <= steps) {
//         log('continuing');
//         continue;
//       }
//       hash[key] = steps;
//       // hashPerButton[i][key] = steps;
//       const complement = stateDiff(target, state);
//       const compKey = stateKey(complement);
//       if (has(hash, compKey)) return steps + hash[compKey];
//       if (complement.some(jolt => jolt < 0)) break;
//     }
//   }

//   const indices = buttons.map(_ => 0);

//   const check = (target, state) => {
//     const diff = stateDiff(target, state);
//     let win = true;
//     for (let i = 0; i < diff.length; i++) {
//       if (diff[i] < 0) return BUST;
//       if (diff[i] > 0) win = false;
//     }
//     if (win) return WIN;
//     const compKey = stateKey(diff);
//     if (has(hash, compKey)) {
//       return WIN;
//     };
//     const key = stateKey(state);
//     if (!has(hash, key)) hash[key] = currentPushes;
//     else {
//       if (hash[key] > currentPushes) hash[key] = currentPushes;
//     }

//     return LOW;
//   }

//   const getSolvers = () => {
//     const irrelevantJoltIndicesPerButton = new Array(buttons.length);
//     const temp = new Set(target.map((_, i) => i));
//     for (let buttonIndex = buttons.length - 1; buttonIndex >= 0; buttonIndex--) {
//       for (const index of buttons[buttonIndex]) {
//         temp.delete(index);
//       }
//       irrelevantJoltIndicesPerButton[buttonIndex] = [...temp];
//     }

//     const differences = [];

//     for (let i = 0; i < buttons.length - 1; i++) {
//       const aset = new Set(buttons[i]);
//       const bset = new Set(buttons.slice(i + 1).flat())
//       const diff = [...aset.difference(bset)];
//       // log(`${buttons[i]} and its ${diff}`)
//       differences.push(diff);
//     }

//     return (buttonIndex) => {
//       if (irrelevantJoltIndicesPerButton[buttonIndex].some(i => state[i] !== target[i])) return false;
//       const diffs = differences[buttonIndex];
//       if (diffs.length) {
//         const requiredPushes = target[diffs[0]] - state[diffs[0]];
//         for (let i = 1; i < diffs.length; i++) {
//           if (target[diffs[i]] - state[diffs[i]] !== requiredPushes) {
//             // log(`We cannot proceed because we're the only ones who can change the ${diffs[0]} and the ${diffs[i]} jolts`)
//             return false;
//           }
//         }
//         return requiredPushes;
//       }
//       return true;
//     }
//   }
//   const canSolve = getSolvers();

//   const getSteps = (state) => {
//     return currentPushes + hash[stateKey(stateDiff(target, state))];
//   }


//   let best = Infinity;

//   // helpers starts at max then goes down
//   // indices is just how many times we've pushed each button
//   const state = target.map(_ => 0);
//   let currentPushes = 0;
//   const updateIndex = (buttonIndex, newIndex) => {
//     const button = buttons[buttonIndex];
//     const diff = newIndex - indices[buttonIndex];
//     if (diff === 0) return;
//     indices[buttonIndex] = newIndex;
//     for (let i = 0; i < button.length; i++) {
//       state[button[i]] += diff;
//     }
//     currentPushes += diff;
//   }

//   const getMins = (buttonIndex) => {
//     const howMuchDependsOnUs = target.map(_ => 0);

//     for (let i = buttonIndex + 1; i < buttons.length; i++) {
//       const joltIndices = buttons[i];
//       for (let j = 0; j < joltIndices.length; j++) {
        
//       }
//     }

//     return () => {
//       const joltIndices = buttons[buttonIndex];
//       const diffs = joltIndices.map(i => target[i] - state[i]);
//     }
//   }

//   const buttonMappings = buttons.map((_, i) => i);

  // indices is just how many times we've pushed each button
  // OK we have two types of lists:
  // state lists, which are numJolts long where each element at i is in a range inclusive from 0 to target[i]
  // these include state and target
  // button lists, which are numButtons long
  // buttons: each element is variable length, matches an index from 0 to numJolts - 0
  // "indices", which is actually better names as numPresses for each button
  // here's our current approach:
  // for each button, from biggest to smallest
    // if there are irrelevant state values, ensure they match target, otherwise return [false]
    // if there are state values that only we can press
      // if they don't match, return [false]
      // if they do, we know we must press this button exactly this many times
    // else, we go from high to low, recursing to the next button until we get a WIN
    // high is the minimum diff between target and state on our button's joltIndices
  // this should work because to get the minimum presses, a press that does more is worth more
  // so if we have a button that hits 5 indices, and it takes 10 presses to complete
  // then it's not worth checking 9 presses
  // let's imagine an input that has (0,1,2),(0,1),(1,2),(2,3),(3), with targets of [5,6,7,6]
  // we can solve this with five presses of (0,1,2), one press of (1,2), one press of (2,3), five presses of (3) for total of 12
  // but we could also solve it with five presses of (0,1), one press of (1,2) and six presses of (2,3)
  // it's hard to prove but I'm pretty sure this is the case
  // however, when buttons are shared, it definitely is possible that the best for A can be beaten
  // so let's say there are three buttons with the same length
  // to solve the highest for A, you lock in A at 15, B at 10, C at 5, and D at 4
    // then, ignoring A and B, we solve DC (with D's lowest at 4 )
    // now we have may already tried 5-10, 5-9, 5-8, 5-7, 5-6, 5-5
    // but D's "high" may be higher now that C isn't in its way
    // so we end up trying ABCD ABDC ACBD ACDB ADBC ADCB and so on (24 combos)
  // unfortunately, this is n! permutations
  // I really suspect permutations aren't the way to go
  // my instincts tell me perhaps there is some math solution
  // for n = 1: ensure each target is the same, that is our solution
  // for n = 2: if a or b has any unique targets, that is what they must press; answer is that + rest
  // for n = 3: find uniques. but what if there are no uniques? ok this gets interesting
    // let's say (0,1),(1,2),(0,2) [15,15,20] (solution is 5,10,10 or 25 -- this is simple so it happens to be the best possible)
    // let's say (0,2,3,4) (1,2,3,4) (0,1,2) (0,4) (2,3) [7,5,12,7,2]
    // there are no uniques
    // if we work from the smallest target to the biggest, the smallest target is 2 (index 4)
    // there are three buttons which can press it, if we group them by size we see that our best options are (0,2,3,4) and (1,2,3,4)
    // their difference is 0 and 1, which have targets of 7 and 5
    // this alone might make us prefer the one with the larger target, but what if the other button that hits 0 also hits 2 and 3
    // whereas the other button that hits 1 only hits 1? wouldn't that make 1 higher value?
    // can we weight each index how many buttons hit it?
    // what about the first example: (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
    // can we go from biggest down? for example, 7 is the biggest; what's biggest that targets 7? (1,3) and (2,3)
    // (1,3) targets 5 which is bigger, so we prioritize that. but after one push, indices 1 and 2 are the same size
    // we still prioritize 1 because only one other can hit it, but after two pushes of (1,3) we're at {3,3,4,5}
    // now we push (2,3) and get {3,3,3,4}, then we push (1,3) again to get to {3,2,3,3}
    // we prioritize 0 & 2 over 3 because there are only two buttons that can push them, and we pick (0,2) because it gets both
    // so we push (0,2) and get to {2,2,2,3}
    // ok so either we go for the largest or the smallest, or we go for the largest buttons first
    // push all unique buttons as far as possible
    // try to eliminate the smallest target. this will require "target" presses
    // my reasoning is that once a target is eliminated, we remove buttons (they become unpressable)
    // use the largest pushable button
    // if there is a tie: sum up their targets, get the one with a larger sum?
    // this is tricky -- with unique buttons, there is pure objectivity, they MUST be pressed and it must be exactly X times
    // for instance, what if there is button A that does 0,1,2,3,4,5 (and their targets are 1,2,2,2,2,2)
    // and button B that does 0,6,7,8,9,10 (and their targets are 1,10,10,10,10,10)
    // we can't know which to use for which press without knowing about the other buttons, for example, it might be that there
    // is a button C that does (1,2,3,4,5) and buttons D-whatever that each do (1,6,7,8,9) and (2,7,8,9,10) etc.
    // however if instead of those buttons there are buttons that just do (1) (2) etc. and those are the only ways to hit those targets
    // then we definitely want to use button A, but in the former case we want to use button B
    // each button has direct value in that it gets us X closer per press
    // but increasing a joltage has value inversely proportional to how much value other buttons can gain
    // so in the former case, B > A because joltages 1-5 have high value; using button A means D-G can only be pushed once instead of twice
    // but in the latter case, A > B because joltages 1-5 have abysmal value: they require the pushing of awful buttons D-G
    // how to quantify this generally though? is it cyclical?
    // joltage is valued based on its pressability (of the buttons that can press it, which has the highest value?)
    // when deciding between a jolt that can be pressed
    // but you need to go through it to the end
    // so if four buttons can push a single jolt and they all push three other jolts
    // we rank those buttons by the inverse ranking of the three other jolts
    // so to measure a jolt, we say: in our current state, to get it to 0, we can lower 30 jolts in other jolts
    // i.e. most change per press
    // so for example above, it's even -- but we've lowered jolts that are easy to press (part of high-value buttons) in one (bad)
    // and lowered jolts that are hard to press (part of low-value buttons) in another
    // it is kind of a cyclical thing, where to determine which button to press, we look at the jolts, but to evaluate the jolts,
    // we need to look at the buttons, and so on. can we get away with stopping at level one?
    // can I say "this jolt is low-value to change as a byproduct because it can be removed easily"
    // in fact, trivially, look at this: (0,1,2) (0,3) (1,4) (2,5) (3) (4) (5) [10,10,10,20,20,20]
    // can be solved either with 10 presses of A, then twenty presses each of EFG for (70), or 10 presses of BCD then 10 presses of EFG for (60)
    // so starting with the biggest button is actually retarded
    // ranking each jolt by how many jolts it can take down with it? [30,30,30,30,30,30], or [3,3,3,1.5,1.5,1.5] if we're weighting them
    // after one push of A we took out 3 jolts, but our state is now [27,27,27,29,29,29] ->  [3,3,3,1.45,1.45,1.45]
    // whereas one push of B only takes out 2 jolts but our avg is now [27,29,29,28,30,30]-> [3,2.9,2.9,1.47,1.45,1.45]
    // we have 10 presses to distribute between A-B for taking care of i=0
    // after 10 presses of A we result in [0,0,0,20,20,20] which seems great, better than [0,10,10,10,20,20]
    // but with each press of A we eliminate the opportunity to use C-D
    // if those later targets were smaller, it wouldn't matter, but they're not
    // each press of A gets three jolts but turns B->E, C->F, and D->G, turning our efficiency at eliminating everything from 90/60 to 90/70
    // our goal is to minimize the number of presses to get to exactly 0, i.e. to maximize our average jolts/press
    // each jolt MUST be pressed target[i] times
    // MAYBE this works??? but I think this is too much calculation
    // let's stick to what's easily calculable
    // for example, a button that is the only button to target a jolt
    // how can we solve the case with two buttons?
    // each button is unique, so they must have differences
    // whatever A has that B doesn't, push it that amount of times, and vice versa for B (may be nothing for one of them), then whatever is left
    // for three buttons? it's possible that nothing is unique to any of them now and they go in a circle (0,1) (1,2) (2,0) [10,10,20]
    // how do we detect that pushing (0,1) even once leaves us in an unsolvable state?
    // oh shit, here we go
    // target is [10,11,11,5,10,5]
    // button is [1,1,1,1,1,0] [1,0,0,1,1,0] etc.
    // the formula is a*z1 + b*z2 + c*z3 etc. = t
    // we want to minimize a + b + c + d
    // but how do we even generate solutions in the first place?
    // is there a way to efficiently know we're in an unsolvable state?
    // like, what if one target is 1000 and the rest are 1-9 and the buttons all target multiple?
    // even just [17,4,4,4,4] with (0,1) (0,2) (0,3) (0,4), we can't get to exactly 0 anymore, how can we detect that?
    // (each button must be pressed four times, and then there's one left over)
    // for only one button, if target has any non-zeros where button has zeros, or if button has any 1s where target has 0s, fail
    // but for two buttons? what about (0,1) (1,2) and [15,15,5] well first button must be pushed 15 times and then it's unsolvable
    // but for three buttons? (0,1) (1,2) (2,0) and [5,4,3]. after pushing C once, we push A twice, getting us to [2,2,2]
    // then [1,1,2] then [1,0,1] then [0,0,0] so A three times, B once, and C twice. but what if it was [3,4,3]?
    // A once and B once gets us to [2,2,2]. As long as there are an even number, looks like it's solvable as long as one number isn't too big
    // e.g. [4,1,1] hits a dead end -- another button that just hits (0) would save us. this is trivial, but how to prove this?
    // this would help us immensely
    // one idea is to go through every button and push it to its max, if we run out of pushable buttons before hitting 0, we fail
    // but is it possible that this is then order-dependent?
    // for example, [3,1,1,1,1] (0,1) (0,2) (0,3) (0,4), each jolt can hit 0, but not all of them
    // this example could be proven by first pushing all mandatory buttons their required amount
    // but it could be complicated by simply adding a button (1,2,3,4) 
    // now we can show it's unsolvable by reducing 3 to 0, and showing that all buttons are now unpushable
    // but do we have to reduce to 3 in every possible way? for example if there is also a button (0)
    // but we try to solve with other buttons, we will fail
    // it is trivial to check to see if we are low, high, or exact
    // we know each button's best case maximum
    // can binary search really not help us?
    // maybe, but the problem is that the space isn't ordered, so we can binary search for a single button
    // but even using a cache to cut off the last button, we still end up with too many goddamn combos
    // linear algebra?
    // t = az1 + bz2 + cz3 + dz4
    // expand it out into a system of equations
    // 0 = a*0 + b*0 + c*0 + d*0 + e*1 + f*1 - 3
    // 0 = a*0 + b*1 + c*0 + d*0 + e*0 + f*1 - 5
    // 0 = a*0 + b*0 + c*1 + d*1 + e*1 + f*0 - 4
    // 0 = a*1 + b*1 + c*0 + d*1 + e*0 + f*0 - 7
    // this is four equations six variables so it's underdetermined, but maybe we can do something?
    // 0 = e + f - 3
    // 0 = b + f - 5
    // 0 = c + d + e - 4
    // 0 = a + b + d - 7
    // one benefit is that we know we need zero or positive integer solutions -- so for example, e and f can both only be 0,1,2 or 3
    // if f is 0, that means e is 3 and b is 5
    // 0 = c + d - 1
    // 0 = a + d - 2
    // this forces d to be 1, c to be 0, and a to be 2, for a total of 3+5+1+2 = 11
    // keep trying different f. if f is 1, e is 2 and b is 4
    // 0 = c + d - 2
    // 0 = a + d - 3
    // now we have different options: d=0,c=2,a=3;d=1,c=1,a=2;d=2,c=0,a=1. the best is last, so we have 1+2+4+2+1=10 which is the answer
    // however the reality is much more complicated
    // for example, the first problem, which is far from the hardest, has 9 equations and 9 variables, which seems to be a minimum
    // let's putz around

  const print = (matrix, msg) => {
    const numVariables = matrix[0].length - 1;
    for (let i = 0; i < matrix.length; i++) {
      const target = matrix[i][numVariables];

      const coefficients = matrix[i].slice(0, -1);
      if (coefficients.some(v => v !== 0)) {
        const str = matrix[i].slice(0, -1).reduce((acc, cur, i) => {
          if (!cur) return acc;
          const char = String.fromCharCode(97 + i);
          if (!acc) {
            if (cur === 1) return char;
            if (cur === -1) return `-${char}`
            return `${cur}${char}`;
          }

          if (cur === 1) return `${acc} + ${char}`;
          if (cur > 0) return `${acc} + ${cur}${char}`;
          if (cur === -1) return `${acc} - ${char}`;
          return `${acc} - ${Math.abs(cur)}${char}`;
        }, '') + ` = ${target}`;
        log(str);
      }
    }
    if (msg) log(msg);
    log('');
  }

  const swap = (matrix, i, j) => {
    const temp = matrix[i];
    matrix[i] = matrix[j];
    matrix[j] = temp;
  }

  const removeDupes = (matrix) => {
    if (!matrix.length) return [];
    if (!matrix[0].length) return [];
    const key = (row) => row.join('-');
    const cache = new Set();
    cache.add(key(matrix[0]))
    const cloned = [matrix[0]];
    for (let i = 1; i < matrix.length; i++) {
      const k = key(matrix[i]);
      if (!cache.has(k)) {
        cloned.push(matrix[i]);
        cache.add(k);
      }
    }

    return cloned;
  }

  // returns [possiblyCorrect, changed, numSteps, newMatrix]
  const substituteOnce = (matrix) => {
    if (!matrix.length) return [matrix, 0, false];
    let i = 0;
    let equationIndex = -1;
    let coefficientIndex = -1;
    let value = -1;
    const targetIndex = matrix[0].length - 1;
    while (i < matrix.length) {
      if (count(matrix[i].slice(0, -1), v => v !== 0) === 1) {
        equationIndex = i;
        coefficientIndex = matrix[i].findIndex(v => v !== 0);
        const coefficient = matrix[i][coefficientIndex];
        matrix[i] = mult(matrix[i], 1/coefficient);
        value = matrix[i][targetIndex];
        if (value < 0 || value !== Math.round(value)) {
          // print(matrix, 'unsolvablegg')
          // unsolvable, we did something wrong previously
          return [false];
        }
        break;
      }
      i++;
    }
    if (equationIndex === -1) {
      // no substitutions were found
      return [true, false];
    }

    // we are able to substitute, time to perform it. we remove the equation
    // and we substitute the variable in all others
    const cloned = [];
    for (let i = 0; i < matrix.length; i++) {
      if (i !== equationIndex) {
        const row = [];
        for (let j = 0; j < targetIndex; j++) {
          if (j !== coefficientIndex) {
            row.push(matrix[i][j]);
          }
        }
        const newTarget = matrix[i][targetIndex] - round(value * matrix[i][coefficientIndex]);
        row.push(newTarget);
        cloned.push(row);
      }
    }
    return [true, true, value, cloned];
  }

  const substitute = (matrix) => {
    const initialClone = cloneMatrix(matrix);
    let [viable, changed, value, cloned] = substituteOnce(initialClone);
    if (!viable) return [false];
    if (!changed) return [initialClone, 0];
    let steps = value;
    let lastCloned = cloned;

    while (changed) {
      [viable, changed, value, cloned] = substituteOnce(lastCloned);
      if (!viable) return [false];
      if (changed) {
        steps += value;
        lastCloned = cloned;
      }
    }

    return [lastCloned, steps];
  }

  const PRECISION = 10**4;
  const round = (x) => {
    const str = x.toString();
    if (
      str.includes('0000000000')
      || str.includes('999999999')
      || str.includes('e')
    ) return Math.round(PRECISION * x) / PRECISION;
    return x;
  };
  const sub = (rowA, rowB) => rowA.map((v, i) => round(v - rowB[i]));
  const mult = (row, val) => row.map(v => round(v * val));
  const solved = (matrix) => matrix.every(row => row.every(val => val === 0));

  const sortMatrix = (matrix) => {
    if (!matrix.length) return matrix;
    const rotated = rotateMatrix(matrix);
    const coefficients = rotated.slice(0, -1);
    const targets = rotated[rotated.length - 1];
    coefficients.sort((a, b) => count(b, x => x !== 0) - count(a, x => x !== 0));
    coefficients.push(targets);
    const sorted = rotateMatrix(coefficients);
    sorted.sort((a, b) => count(a, val => val !== 0) - count(b, val => val !== 0));
    return sorted;
  }

  const processInitialMatrix = (targets, buttons) => {
    let matrix = rotateMatrix(buttons.map(joltIndices => {
      const line = targets.map(_ => 0);
      for (const i of joltIndices) {
        line[i] = 1;
      }
      return line;
    }));

    matrix.forEach((v, i) => {
      v.push(targets[i]);
    });
    let steps = 0;

    matrix = removeDupes(matrix);
    [matrix, steps] = substitute(matrix);
    if (!matrix) {
      log(`We failed early because it's unviable`)
      return;
    }
    matrix = removeDupes(matrix);
    matrix = sortMatrix(matrix);
    return [matrix, steps];
  }

  const TROUBLE = [];

  const wrapper = (targets, buttons, i) => {
    if (TROUBLE.length && !TROUBLE.includes(i)) return -1;
    const [initialMatrix, initialSteps] = processInitialMatrix(targets, buttons);
    if (TROUBLE.includes(i)) {
      print(initialMatrix, `${i}: start: ${targets.length} eqs, ${buttons.length} vars; end: ${initialMatrix.length} eqs, ${initialMatrix[0].length - 1} vars`)
    }
    if (solved(initialMatrix)) return initialSteps;
    const [solvedMatrix, subsequentSteps] = solve(initialMatrix);
    if (solved(solvedMatrix)) {
      return initialSteps + subsequentSteps;
    }

    const [recursedMatrix, recursedSteps] = search(solvedMatrix);
    if (solved(recursedMatrix)) {
      return initialSteps + subsequentSteps + recursedSteps;
    }

    print(solvedMatrix, `${i}: start: ${targets.length} eqs, ${buttons.length} vars; end: ${solvedMatrix.length} eqs, ${solvedMatrix[0].length - 1} vars`)

    return Infinity;
  }

  const solve = (initialMatrix, substituteFirst = false) => {
    let matrix = initialMatrix;
    let steps = 0;
    if (substituteFirst) {
      [matrix, steps] = substitute(initialMatrix);
      if (!matrix) return [initialMatrix, Infinity];
      if (solved(matrix)) return [matrix, steps];
      matrix = removeDupes(matrix);
      matrix = sortMatrix(matrix);
    }
    let totalSteps = steps;
    do {
      matrix = eliminate(matrix);
      [matrix, steps] = substitute(matrix);
      if (!matrix) {
        return [initialMatrix, Infinity];
      }
      matrix = removeDupes(matrix);
      matrix = sortMatrix(matrix);
      totalSteps += steps;
    } while (steps !== 0);

    return [matrix, totalSteps];
  }


  const search = (matrix) => {
    if (!matrix || !matrix[0] || matrix[0].length <= 1) return [matrix, 0];
    const numEquations = matrix.length;
    const numVars = matrix[0].length - 1;
    const missingVars = numVars - numEquations;
    if (missingVars <= 0) return solve(matrix);

    let maxGuess = 1000;

    for (let i = 0; i < matrix.length; i++) {
      if (matrix[i][0] !== 0 && (matrix[i].every(val => val >= 0) || matrix[i].every(val => val <= 0))) {
        const max = 1 + Math.floor(matrix[i][numVars] / matrix[i][0]);
        if (max >= 0 && max < maxGuess) maxGuess = max;
      }
    }

    let guess = 0;
    let best = Infinity;
    let bestMatrix = matrix;

    // print(matrix, `searching from 0 to ${maxGuess}`)
    while (guess <= maxGuess) {
      const cloned = cloneMatrix(matrix);
      const newEquation = [1];
      for (let i = 1; i < numVars; i++) {
        newEquation.push(0);
      }
      newEquation.push(guess++);
      cloned.push(newEquation);
      // print(cloned, `guess ${guess}`)
      const [oneStepMatrix, steps] = solve(cloned, true);
      if (steps === Infinity) {
        // log(`guess ${guess} is unviable`);
        continue;
      }
      if (solved(oneStepMatrix)) {
        best = min([best, steps]);
        bestMatrix = oneStepMatrix;
        continue;
      }
      // print(oneStepMatrix, `After guessing for ${guess} we get this with ${steps}`)
      const [recursedMatrix, recursedSteps] = search(oneStepMatrix);
      if (recursedSteps !== Infinity && (steps + recursedSteps) < best) {
        best = min([best, steps + recursedSteps]);
        bestMatrix = recursedMatrix;
      }
    }

    return [bestMatrix, best];
  }

  const eliminate = (matrix) => {
    for (let i = 0; i < matrix.length - 1; i++) {
      let pivot = matrix[i][i];
      if (pivot === 0) {
        let j = i;
        while (pivot === 0 && j < matrix.length - 1) {
          j++;
          pivot = matrix[j][i]
        }
        if (pivot === 0) {
          // log(`No pivot at row ${i}`)
          continue;
        }
        swap(matrix, i, j);
      }
      for (let j = i + 1; j < matrix.length; j++) {
        if (matrix[j][i]) {
          const eliminating = matrix[j][i];
          let multiplier = round(eliminating / pivot);
          const multiplied = mult(matrix[i], multiplier);
          matrix[j] = sub(matrix[j], multiplied);
        }
      }
    }
    return matrix.filter(row => row.some(val => val !== 0));
  }

export async function run() {
  const lines = await getLines(URL);
  // const wrongAnswer = await getLines('temp.txt');
  // const answers = wrongAnswer.slice(0, -1).map(line => ints(line)[1]);

  const presses = [];

  const t0 = performance.now();
  for (let i = 0; i < lines.length; i++) {
    // if (i > 0) continue;
    const line = lines[i];
    const pieces = line.split(' ');
    const buttons = [];
    const targets = ints(pieces[pieces.length - 1]);

    for (let i = 1; i < pieces.length - 1; i++) {
      buttons.push(ints(pieces[i]));
    }

    const t1 = performance.now();
    const solved = wrapper(targets, buttons, i);
    const t2 = performance.now();
    if (solved !== -1) {
      if (solved !== Infinity) presses.push(solved);
      log(`solved ${i}? ${solved !== Infinity ? `yes! in ${solved} steps` : 'no'} in ${((t2 - t1)/1000).toFixed(2)} seconds.`)
    }
  }
  const t1 = performance.now();

  const res = presses.reduce((acc, cur) => acc + cur, 0);
  log(res);
  // log(`${presses.length} solves in ${((t1 - t0)/1000).toFixed(2)} seconds`)

  // 21352 is too high
  // 21347 is also too high
}

export default run;
