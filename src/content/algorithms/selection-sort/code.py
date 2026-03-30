def selection_sort(array):  # #@function-def
    n = len(array)

    for i in range(n - 1):  # #@outer-loop
        min_index = i  # #@min-index

        for j in range(i + 1, n):  # #@inner-loop
            if array[j] < array[min_index]:  # #@find-min
                min_index = j

        if min_index != i:  # #@swap
            array[i], array[min_index] = array[min_index], array[i]

    return array
