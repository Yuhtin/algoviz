pub fn insertion_sort<T: Ord>(arr: &mut [T]) {  // #@generic-function
    let n = arr.len();

    for i in 1..n {  // #@outer-loop
        let mut j = i;  // #@key

        while j > 0 && arr[j - 1] > arr[j] {  // #@while-loop
            arr.swap(j - 1, j);  // #@shift
            j -= 1;
        }
    }
}
