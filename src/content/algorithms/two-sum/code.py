def two_sum(nums, target):  # #@function-def
    seen = {}  # #@hash-map

    for i, num in enumerate(nums):  # #@enumerate
        complement = target - num  # #@complement

        if complement in seen:  # #@lookup
            return [seen[complement], i]

        seen[num] = i  # #@store

    return None  # #@not-found
