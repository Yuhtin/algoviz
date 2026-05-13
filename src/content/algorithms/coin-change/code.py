def coin_change(coins, amount):  # #@function-def
    INF = float('inf')
    dp = [INF] * (amount + 1)  # #@init-dp
    dp[0] = 0
    choice = [None] * (amount + 1)

    for j in range(1, amount + 1):  # #@outer-loop
        for c in coins:  # #@inner-loop
            if c <= j and dp[j - c] != INF:  # #@validity-check
                candidate = dp[j - c] + 1  # #@recurrence
                if candidate < dp[j]:
                    dp[j] = candidate
                    choice[j] = c

    if dp[amount] == INF:  # #@return-result
        return -1, []

    # Backtrack para reconstruir as moedas
    coins_used = []
    j = amount
    while j > 0:
        coins_used.append(choice[j])
        j -= choice[j]

    return dp[amount], coins_used
