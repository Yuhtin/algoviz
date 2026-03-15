def bucket_sort(arr):  # #@function-def
    if len(arr) == 0:  # #@empty-check
        return arr

    n = len(arr)  # #@buckets-init
    buckets = [[] for _ in range(n)]

    for num in arr:  # #@distribution
        index = min(int(num * n), n - 1)
        buckets[index].append(num)

    for bucket in buckets:  # #@bucket-sort
        bucket.sort()

    result = []  # #@concatenation
    for bucket in buckets:
        result.extend(bucket)

    return result
