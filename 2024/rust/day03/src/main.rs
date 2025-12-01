use regex::Regex;

const INPUT_TEXT: &str = include_str!("../../../inputs/3.txt");

fn main() {
    let lines = INPUT_TEXT.lines().collect::<Vec<_>>();
    let full = lines.join("");
    // let re: Regex = Regex::new(r"mul\((\d{1,3}),(\d{1,3})\)").unwrap();
    let re: Regex = Regex::new(r"mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\)").unwrap();

    let mut sum: u64 = 0;
    let mut active = true;

    // for (_, [a, b]) in re.captures_iter(&full).map(|c| c.extract()) {
    //     sum += a.parse::<u64>().unwrap() * b.parse::<u64>().unwrap();
    // }

    for (instruction, [a, b]) in re.captures_iter(&full).map(|c| c.extract()) {
        if instruction == "do()" {
            active = true;
        } else if instruction == "don't()" {
            active = false;
        } else {
            sum += a.parse::<u64>().unwrap() * b.parse::<u64>().unwrap();
        }
    }

    println!("{}", sum);
}
