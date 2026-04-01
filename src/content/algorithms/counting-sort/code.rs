pub fn counting_sort(arr: &[usize]) -> Vec<usize> {  // #@generic-function
    if arr.is_empty() {
        return vec![];
    }

    let max_val = *arr.iter().max().unwrap();  // #@find-max

    let mut count = vec![0usize; max_val + 1];  // #@count-array

    for &num in arr {  // #@counting
        count[num] += 1;
    }

    for i in 1..count.len() {  // #@cumulative
        count[i] += count[i - 1];
    }

    let mut output = vec![0usize; arr.len()];  // #@output

    for &num in arr.iter().rev() {  // #@placement
        output[count[num] - 1] = num;
        count[num] -= 1;
    }

    output
}
