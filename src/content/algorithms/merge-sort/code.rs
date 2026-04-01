pub fn merge_sort<T: Ord + Clone>(arr: &mut [T]) {  // #@generic-function
    let len = arr.len();
    if len <= 1 {  // #@base-case
        return;
    }

    let mid = len / 2;  // #@split
    let left = arr[..mid].to_vec();  // #@vec-alloc
    let right = arr[mid..].to_vec();  // #@vec-alloc

    let mut left = left;
    let mut right = right;
    merge_sort(&mut left);  // #@recursive-calls
    merge_sort(&mut right);  // #@recursive-calls

    merge(&left, &right, arr);  // #@merge
}

fn merge<T: Ord + Clone>(left: &[T], right: &[T], result: &mut [T]) {  // #@merge
    let mut i = 0;
    let mut j = 0;
    let mut k = 0;

    while i < left.len() && j < right.len() {
        if left[i] <= right[j] {  // #@left-copy
            result[k] = left[i].clone();
            i += 1;
        } else {  // #@right-copy
            result[k] = right[j].clone();
            j += 1;
        }
        k += 1;
    }

    while i < left.len() {  // #@remaining
        result[k] = left[i].clone();
        i += 1;
        k += 1;
    }

    while j < right.len() {  // #@remaining
        result[k] = right[j].clone();
        j += 1;
        k += 1;
    }
}
