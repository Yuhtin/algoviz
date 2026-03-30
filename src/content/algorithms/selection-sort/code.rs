pub fn selection_sort<T: Ord>(arr: &mut [T]) {  // #@generic-function
    let n = arr.len();

    for i in 0..n - 1 {  // #@outer-loop
        let mut min_index = i;  // #@min-index

        for j in i + 1..n {  // #@inner-loop
            if arr[j] < arr[min_index] {  // #@find-min
                min_index = j;
            }
        }

        if min_index != i {  // #@swap
            arr.swap(i, min_index);  // #@swap-method
        }
    }
}
