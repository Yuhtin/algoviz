def bubble_sort(array):  # #@function-def
    n = len(array)

    for i in range(n - 1):  # #@outer-loop
        swapped = False  # #@optimization-flag

        for j in range(n - i - 1):  # #@inner-loop
            if array[j] > array[j + 1]:  # #@comparison-swap
                array[j], array[j + 1] = array[j + 1], array[j]
                swapped = True

        if not swapped:  # #@early-exit
            break

    return array
