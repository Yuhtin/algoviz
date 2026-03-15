use std::collections::HashMap;  // #@import

pub fn two_sum(nums: &[i32], target: i32) -> Option<(usize, usize)> {  // #@function-def
    let mut seen: HashMap<i32, usize> = HashMap::new();  // #@hash-map

    for (i, &num) in nums.iter().enumerate() {  // #@enumerate
        let complement = target - num;  // #@complement

        if let Some(&j) = seen.get(&complement) {  // #@pattern-match
            return Some((j, i));
        }

        seen.insert(num, i);  // #@store
    }

    None  // #@not-found
}
