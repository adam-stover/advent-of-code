const INPUT_TEXT: &str = include_str!("../../../inputs/2.txt");

fn is_safe(nums: &[u64]) -> bool {
    let is_ascending: bool = nums[1] > nums[0];

    for i in 1..nums.len() {
        if (nums[i] > nums[i - 1]) != is_ascending {
            return false;
        }
        let diff = nums[i].abs_diff(nums[i - 1]);

        if diff < 1 || diff > 3 {
            return false;
        }
    }

    return true;
}

fn copy_except(nums: &[u64], index: usize) -> Vec<u64> {
    if nums.len() <= 1 {
        return vec![];
    }

    let mut copy: Vec<u64> = Vec::with_capacity(nums.len() - 1);

    for (i, item) in nums.iter().enumerate() {
        if i != index {
            copy.push(*item);
        }
    }

    return copy;
}

fn is_safe_2(nums: &[u64]) -> bool {
    if is_safe(&nums) {
        return true;
    }

    for i in 0..nums.len() {
        if is_safe(&copy_except(nums, i)) {
            return true;
        }
    }

    return false;
}

fn main() {
    let mut count: u64 = 0;
    let mut count_2: u64 = 0;

    for line in INPUT_TEXT.lines() {
        let nums: Vec<u64> = line
            .split_whitespace()
            .map(|x| x.parse::<u64>().unwrap())
            .collect();

        if is_safe(&nums) {
            count += 1;
        }

        if is_safe_2(&nums) {
            count_2 += 1;
        }
    }

    println!("{}", count);
    println!("{}", count_2);
}
