def merge_sort(array):  # #@function-def
    if len(array) <= 1:  # #@base-case
        return array

    mid = len(array) // 2  # #@split
    left = merge_sort(array[:mid])  # #@recursive-calls
    right = merge_sort(array[mid:])  # #@recursive-calls

    return merge(left, right)  # #@merge


def merge(left, right):  # #@merge
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:  # #@left-copy
            result.append(left[i])
            i += 1
        else:  # #@right-copy
            result.append(right[j])
            j += 1

    result.extend(left[i:])  # #@remaining
    result.extend(right[j:])  # #@remaining

    return result
