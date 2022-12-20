import { getLines } from '../utils.js';

const URL = './inputs/7.txt';

class Directory {
  constructor(parent = null) {
    this.parent = parent;
    this.dirs = {};
    this.files = {};
  }

  addDirectory(name) {
    this.dirs[name] = new Directory(this);
  }

  addFile(name, size) {
    this.files[name] = Number(size);
  }

  addEntity(a, b) {
    if (a === 'dir') this.addDirectory(b);
    else this.addFile(b, a);
  }

  size() {
    let sum = 0;
    for (const dir of Object.values(this.dirs)) {
      sum += dir.size();
    }

    for (const fileSize of Object.values(this.files)) {
      sum += fileSize;
    }

    return sum;
  }

  iterate(cb) {
    cb(this);
    for (const dir of Object.values(this.dirs)) {
      dir.iterate(cb);
    }
  }
}



export default async function daySeven() {
  const lines = await getLines(URL);
  const root = new Directory();
  let workingDirectory;
  // let sum = 0;

  for (let i = 0; i < lines.length; ++i) {
    const [a, b, c] = lines[i].split(' ');

    if (a === '$') {
      if (b === 'cd') {
        if (c === '/') workingDirectory = root;
        else if (c === '..') workingDirectory = workingDirectory.parent;
        else workingDirectory = workingDirectory.dirs[c];
      }
    } else {
      workingDirectory.addEntity(a, b);
    }
  }

  const totalSpace = 70000000;
  const requiredUnusedSpace = 30000000;
  const rootSize = root.size();
  const currentUnusedSpace = totalSpace - rootSize;
  const mustDeleteAtLeast = requiredUnusedSpace - currentUnusedSpace;
  let smallestAboveThreshold = rootSize;

  root.iterate((dir) => {
    const size = dir.size();
    if (size >= mustDeleteAtLeast && size < smallestAboveThreshold) {
      smallestAboveThreshold = size;
    }
  });

  console.log(smallestAboveThreshold);
}
