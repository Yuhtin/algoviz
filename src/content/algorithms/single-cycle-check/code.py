def has_single_cycle(array):  # #@function-def
    current_idx = 0  # #@init
    num_visited = 0

    while num_visited < len(array):  # #@main-loop
        if num_visited > 0 and current_idx == 0:  # #@direction-check
            return False

        num_visited += 1  # #@increment
        current_idx = (current_idx + array[current_idx]) % len(array)  # #@next-index

    return current_idx == 0  # #@return
