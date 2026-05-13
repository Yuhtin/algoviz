pub fn coin_change(coins: &[i32], amount: i32) -> i32 {  // #@generic-function
    let n = amount as usize;
    let mut dp: Vec<Option<i32>> = vec![None; n + 1];  // #@init-dp
    dp[0] = Some(0);

    for j in 1..=n {  // #@outer-loop
        for &c in coins {  // #@inner-loop
            let c = c as usize;
            if c <= j {  // #@validity-check
                if let Some(prev) = dp[j - c] {
                    let candidate = prev + 1;  // #@recurrence
                    dp[j] = Some(match dp[j] {
                        Some(cur) => cur.min(candidate),
                        None => candidate,
                    });
                }
            }
        }
    }

    dp[n].unwrap_or(-1)  // #@return-result
}
