pub fn quick_sort<T: Ord>(arr: &mut [T]) {  // #@generic-function
    let len = arr.len();
    if len <= 1 {  // #@base-case
        return;
    }
    let pivot_index = partition(arr);  // #@slice-partition
    quick_sort(&mut arr[..pivot_index]);  // #@recursive-calls
    quick_sort(&mut arr[pivot_index + 1..]);  // #@recursive-calls
}

fn partition<T: Ord>(arr: &mut [T]) -> usize {  // #@slice-partition
    let len = arr.len();
    let pivot_index = len - 1;  // #@pivot
    let mut i = 0;

    for j in 0..pivot_index {
        if arr[j] <= arr[pivot_index] {  // #@comparison
            arr.swap(i, j);  // #@swap
            i += 1;
        }
    }

    arr.swap(i, pivot_index);  // #@pivot-placement
    i
}
