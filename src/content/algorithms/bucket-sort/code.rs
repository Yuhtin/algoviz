fn bucket_sort(arr: &mut [f64]) {  // #@function-def
    if arr.is_empty() {  // #@empty-check
        return;
    }

    let n = arr.len();  // #@buckets-init
    let mut buckets: Vec<Vec<f64>> = vec![vec![]; n];

    for &num in arr.iter() {  // #@distribution
        let index = ((num * n as f64) as usize).min(n - 1);
        buckets[index].push(num);
    }

    for bucket in &mut buckets {  // #@bucket-sort
        bucket.sort_by(|a, b| a.partial_cmp(b).unwrap());
    }

    let mut idx = 0;  // #@concatenation
    for bucket in buckets {
        for num in bucket {
            arr[idx] = num;
            idx += 1;
        }
    }
}
