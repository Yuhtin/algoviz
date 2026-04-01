def quick_sort(array, low=0, high=None):  # #@function-def
    if high is None:
        high = len(array) - 1

    if low < high:  # #@base-case
        pivot_index = partition(array, low, high)  # #@partition
        quick_sort(array, low, pivot_index - 1)  # #@recursive-calls
        quick_sort(array, pivot_index + 1, high)  # #@recursive-calls

    return array


def partition(array, low, high):  # #@partition
    pivot = array[high]  # #@pivot

    i = low - 1

    for j in range(low, high):
        if array[j] <= pivot:  # #@comparison
            i += 1
            array[i], array[j] = array[j], array[i]  # #@swap

    array[i + 1], array[high] = array[high], array[i + 1]  # #@pivot-placement

    return i + 1
