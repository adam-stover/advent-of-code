use std::collections::HashSet;

const INPUT_TEXT: &str = include_str!("../../inputs/1.txt");

fn main() {
    let mut first: Vec<usize> = Vec::new();
    let mut second: Vec<usize> = Vec::new();
    let mut sum: usize = 0;
    let mut sum_2: usize = 0;
    let mut hash: HashSet<usize> = HashSet::new();

    for line in INPUT_TEXT.lines() {
        let mut iter = line.split_whitespace().map(|x| x.parse::<usize>().unwrap());
        let first_val = iter.next().unwrap();
        let second_val = iter.next().unwrap();
        first.push(first_val);
        second.push(second_val);
        hash.insert(first_val);
    }

    first.sort();
    second.sort();

    for (i, a) in first.iter().enumerate() {
        let b: &usize = &second[i];

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
