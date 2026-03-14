pub fn bubble_sort<T: Ord>(arr: &mut [T]) {  // #@generic-function
    let n = arr.len();

    for i in 0..n - 1 {  // #@outer-loop
        let mut swapped = false;

        for j in 0..n - i - 1 {  // #@inner-loop
            if arr[j] > arr[j + 1] {  // #@comparison-swap
                arr.swap(j, j + 1);  // #@swap-method
                swapped = true;
            }
        }

        if !swapped {  // #@early-exit
            break;
        }
    }
}
