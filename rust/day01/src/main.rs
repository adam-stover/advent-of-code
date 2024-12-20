use std::collections::HashSet;

const INPUT_TEXT: &str = include_str!("../../../inputs/1.txt");
const CAPACITY: usize = 1000;

fn main() {
    let mut first: Vec<u64> = Vec::with_capacity(CAPACITY);
    let mut second: Vec<u64> = Vec::with_capacity(CAPACITY);
    let mut sum: u64 = 0;
    let mut sum_2: u64 = 0;
    let mut hash: HashSet<u64> = HashSet::with_capacity(CAPACITY);

    for line in INPUT_TEXT.lines() {
        let mut iter = line.split_whitespace().map(|x| x.parse::<u64>().unwrap());
        let first_val = iter.next().unwrap();
        let second_val = iter.next().unwrap();
        first.push(first_val);
        second.push(second_val);
        hash.insert(first_val);
    }

    first.sort();
    second.sort();

    for (i, a) in first.iter().enumerate() {
        let b: &u64 = &second[i];

        sum += if a > b { a - b } else { b - a };
    }

    for num in second.iter() {
        if hash.contains(num) {
            sum_2 += num;
        }
    }

    println!("{sum}");
    println!("{sum_2}");
}
