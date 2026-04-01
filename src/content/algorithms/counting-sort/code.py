def counting_sort(array):  # #@function-def
    if not array:
        return array

    max_val = max(array)  # #@find-max

    count = [0] * (max_val + 1)  # #@count-array

    for num in array:  # #@counting
        count[num] += 1

    for i in range(1, len(count)):  # #@cumulative
        count[i] += count[i - 1]

    output = [0] * len(array)  # #@output

    for i in range(len(array) - 1, -1, -1):  # #@placement
        output[count[array[i]] - 1] = array[i]
        count[array[i]] -= 1

    return output
