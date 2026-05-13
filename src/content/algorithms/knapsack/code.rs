pub fn knapsack(weights: &[i32], values: &[i32], capacity: i32) -> i32 {  // #@generic-function
    let n = weights.len();
    let w_cap = capacity as usize;
    let mut dp = vec![vec![0i32; w_cap + 1]; n + 1];  // #@init-dp

    for i in 1..=n {  // #@outer-loop
        let wi = weights[i - 1] as usize;
        let vi = values[i - 1];
        for w in 0..=w_cap {  // #@inner-loop
            if wi > w {  // #@weight-check
                dp[i][w] = dp[i - 1][w];
            } else {
                let skip = dp[i - 1][w];
                let take = dp[i - 1][w - wi] + vi;
                dp[i][w] = skip.max(take);  // #@decision
            }
        }
    }

    // Backtrack
    let mut w = w_cap;  // #@backtrack
    let mut i = n;
    while i > 0 {
        if dp[i][w] != dp[i - 1][w] {
            w -= weights[i - 1] as usize;
        }
        i -= 1;
    }

    dp[n][w_cap]
}
