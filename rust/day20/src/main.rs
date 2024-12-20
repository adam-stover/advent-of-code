const INPUT_TEXT: &str = include_str!("../../../inputs/20.txt");

#[derive(PartialEq, Copy, Clone)]
enum Direction {
    North,
    East,
    South,
    West,
}

const DIRS: [Direction; 4] = [Direction::North, Direction::East, Direction::South, Direction::West];
const DIR_MOVES: [(i32, i32); 4] = [(0, -1), (1, 0), (0, 1), (-1, 0)];
const START: u8 = b'S';
const END: u8 = b'E';
const WALL: u8 = b'#';
const CHEAT_TIME: i32 = 20;
const TIME_SAVE_THRESHOLD: i32 = 100;

fn manhattan_distance(a: (i32, i32), b: (i32, i32)) -> i32 {
    let x = (a.0 - b.0).abs();
    let y = (a.1 - b.1).abs();

    return x + y;
}

fn main() {
    let lines = INPUT_TEXT
        .lines()
        .collect::<Vec<_>>();

    let height = lines.len();
    let width = lines[0].len();

    let grid = lines
        .iter()
        .flat_map(|l| l.as_bytes())
        .copied()
        .collect::<Vec<_>>();

    let mut start = (0, 0);
    let mut end = (0, 0);

    for y in 0..height {
        for x in 0..width {
            if grid[y * width + x] == START {
                start = (x as i32, y as i32);
            } else if grid[y * width + x] == END {
                end = (x as i32, y as i32);
            }
        }
    }

    let mut path: Vec<(i32, i32)> = Vec::new();

    let mut cur = start.clone();
    // let mut dist = 0;
    let mut cur_dir = Direction::South;
    let mut total = 0;

    while cur != end {
        path.push((cur.0, cur.1));
        // dist += 1;
        for dir in DIRS {
            let (movex, movey) = DIR_MOVES[dir as usize];
            let newx = cur.0 + movex;
            let newy = cur.1 + movey;
            if dir != DIRS[(cur_dir as usize + 2) % 4] && grid[newy as usize * width + newx as usize] != WALL {
                cur = (newx, newy);
                cur_dir = dir;
                break;
            }
        }
    }

    path.push((cur.0, cur.1));

    println!("Total time: {}", path.len());

    for (i, (source_x, source_y)) in path.iter().enumerate() {
        // OK, now we want to go through all the items in the path
        for j in (i + TIME_SAVE_THRESHOLD as usize)..path.len() {
            let (dest_x, dest_y) = path[j];
            // If we're within CHEAT_TIME manhattan distance, we good
            let man_dist = manhattan_distance((*source_x, *source_y), (dest_x, dest_y));
            if man_dist <= CHEAT_TIME && j as i32 - (i as i32 + man_dist) >= TIME_SAVE_THRESHOLD {
                total += 1;
            }
        }
    }

    println!("{}", total);
}
