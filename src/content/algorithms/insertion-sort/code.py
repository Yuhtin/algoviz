def insertion_sort(array):  # #@function-def
    for i in range(1, len(array)):  # #@outer-loop
        key = array[i]  # #@key
        j = i - 1

        while j >= 0 and array[j] > key:  # #@inner-loop
            array[j + 1] = array[j]  # #@shift
            j -= 1

        array[j + 1] = key  # #@insert

    return array
