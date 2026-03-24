use std::collections::{HashMap, HashSet};  // #@init-visited

pub fn dfs_recursive(  // #@function-def
    graph: &HashMap<char, Vec<char>>,
    start: char,
    visited: &mut HashSet<char>,
) {
    if visited.contains(&start) {  // #@base-case
        return;
    }

    visited.insert(start);  // #@mark-visited
    println!("{}", start);  // #@process-node

    if let Some(neighbors) = graph.get(&start) {  // #@recurse
        for &neighbor in neighbors {
            dfs_recursive(graph, neighbor, visited);  // #@recurse
        }
    }
}

pub fn dfs_iterative(  // #@function-def
    graph: &HashMap<char, Vec<char>>,
    start: char,
) -> Vec<char> {
    let mut visited = HashSet::new();  // #@init-visited
    let mut stack = vec![start];  // #@stack-push
    let mut result = Vec::new();

    while let Some(vertex) = stack.pop() {  // #@main-loop  // #@stack-pop
        if visited.contains(&vertex) {  // #@base-case
            continue;
        }

        visited.insert(vertex);  // #@mark-visited
        result.push(vertex);  // #@process-node

        if let Some(neighbors) = graph.get(&vertex) {  // #@recurse
            for &neighbor in neighbors.iter().rev() {
                if !visited.contains(&neighbor) {
                    stack.push(neighbor);  // #@stack-push
                }
            }
        }
    }

    result
}
