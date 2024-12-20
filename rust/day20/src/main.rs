use std::collections::VecDeque;

const INPUT_TEXT: &str = include_str!("../../../inputs/20.txt");

const DIRS: [(i32, i32); 4] = [(-1, 0), (0, 1), (1, 0), (0, -1)];
const START: u8 = b'S';
const END: u8 = b'E';
const WALL: u8 = b'#';
const CHEAT_TIME: i32 = 20;
const TIME_SAVE_THRESHOLD: i32 = 100;

struct State {
    x: i32,
    y: i32,
    time: i32
}

struct StateWithPath {
    x: i32,
    y: i32,
    time: i32,
    path: String
}

fn bfs(
    grid: &[u8],
    height: i32,
    width: i32,
    start: (i32, i32),
    end: (i32, i32)
) -> (i32, String) {
    let mut queue: VecDeque<StateWithPath> = VecDeque::new();
    let mut seen = vec![false; height as usize * width as usize];

    let initial_state = StateWithPath {
        x: start.0,
        y: start.1,
        time: 0,
        path: String::from("")
    };

    queue.push_back(initial_state);

    while let Some(StateWithPath {
        x,
        y,
        time,
        path
    }) = queue.pop_front() {
        if x == end.0 && y == end.1 {
            return (time, path);
        }

        if seen[y as usize * width as usize + x as usize] {
            continue;
        }

        seen[y as usize * width as usize + x as usize] = true;

        for (dx, dy) in DIRS.iter() {
            let newy = y + dy;
            let newx = x + dx;
            if newy >= 0 && newy < height && newx >= 0 && newx < width && grid[newy as usize * width as usize + newx as usize] != WALL {
                let mut new_path = path.clone();
                new_path.push_str("|");
                new_path.push_str(&x.to_string());
                new_path.push_str("-");
                new_path.push_str(&y.to_string());
                queue.push_back(StateWithPath {
                    x: newx,
                    y: newy,
                    time: time + 1,
                    path: new_path
                })
            }
        }
    }

    return (0, String::from(""));
}

fn bfs2(
    grid: &[u8],
    height: i32,
    width: i32,
    start: (i32, i32),
    end: (i32, i32),
    start_time: i32,
    target: i32
) -> bool {
    let mut queue: VecDeque<State> = VecDeque::new();
    let mut seen = vec![false; height as usize * width as usize];

    let initial_state = State {
        x: start.0,
        y: start.1,
        time: start_time
    };

    queue.push_back(initial_state);

    while let Some(State {
        x,
        y,
        time
    }) = queue.pop_front() {
        if time > target || seen[y as usize * width as usize + x as usize] {
            continue;
        }

        if x == end.0 && y == end.1 {
            return true;
        }

        seen[y as usize * width as usize + x as usize] = true;

        for (dx, dy) in DIRS.iter() {
            let newy = y + dy;
            let newx = x + dx;
            if newy >= 0 && newy < height && newx >= 0 && newx < width && grid[newy as usize * width as usize + newx as usize] != WALL {
                queue.push_back(State {
                    x: newx,
                    y: newy,
                    time: time + 1
                })
            }
        }
    }

    return false;
}

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

    let (best_time, best_path) = bfs(&grid, height as i32, width as i32, start, end);
    let target = best_time - TIME_SAVE_THRESHOLD;

    println!("best time: {}; target: {}", best_time, target);

    let locations = best_path
        .split("|")
        .filter(|x| x.len() > 0)
        .map(|str| str.split("-").map(|x| x.parse::<i32>().unwrap()));

    let mut total = 0;

    for (index, mut loc) in locations.enumerate() {
        let startx = loc.next().unwrap();
        let starty = loc.next().unwrap();

        for y in 0..height {
            for x in 0..width {
                let man_dist = manhattan_distance((startx, starty), (x as i32, y as i32));

                if man_dist <= CHEAT_TIME && grid[y * width + x] != WALL {
                    let success = bfs2(&grid, height as i32, width as i32, (x as i32, y as i32), end, index as i32 + man_dist, target);
                    if success {
                        // println!("We cheated from {},{} to {},{} at {}", startx, starty, x, y, index);
                        total += 1;
                    }
                }
            }
        }

        if index % 100 == 0 {
            println!("processing {} for total of {}", index, total);
        }
    }

    println!("{}", total);
}
