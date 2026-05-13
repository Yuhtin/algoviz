def knapsack(weights, values, capacity):  # #@function-def
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]  # #@init-dp

    for i in range(1, n + 1):  # #@outer-loop
        for w in range(capacity + 1):  # #@inner-loop
            if weights[i - 1] > w:  # #@weight-check
                dp[i][w] = dp[i - 1][w]
            else:
                skip = dp[i - 1][w]
                take = dp[i - 1][w - weights[i - 1]] + values[i - 1]
                dp[i][w] = max(skip, take)  # #@decision

    # Backtrack para reconstruir os itens
    chosen = []  # #@backtrack
    i, w = n, capacity
    while i > 0:
        if dp[i][w] != dp[i - 1][w]:
            chosen.append(i - 1)
            w -= weights[i - 1]
        i -= 1

    return dp[n][capacity], list(reversed(chosen))
