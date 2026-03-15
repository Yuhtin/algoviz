pub fn has_single_cycle(array: &[i32]) -> bool {  // #@function-def
    let n = array.len() as i32;  // #@init
    let mut current_idx: i32 = 0;
    let mut num_visited = 0;

    while num_visited < array.len() {  // #@main-loop
        if num_visited > 0 && current_idx == 0 {  // #@direction-check
            return false;
        }

        num_visited += 1;  // #@increment
        current_idx = ((current_idx + array[current_idx as usize]) % n + n) % n;  // #@modulo-rust
    }

    current_idx == 0  // #@return
}
