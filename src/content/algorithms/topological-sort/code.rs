use std::collections::{HashMap, HashSet, VecDeque};  // #@init-queue

pub fn topological_sort_kahn(  // #@function-def
    graph: &HashMap<String, Vec<String>>,
) -> Option<Vec<String>> {
    // Calcular grau de entrada
    let mut in_degree: HashMap<&String, usize> = HashMap::new();  // #@init-indegree
    for v in graph.keys() {
        in_degree.entry(v).or_insert(0);
        for neighbor in &graph[v] {  // #@init-indegree
            *in_degree.entry(neighbor).or_insert(0) += 1;  // #@init-indegree
        }
    }

    // Vertices sem dependencias
    let mut queue: VecDeque<&String> = in_degree  // #@init-queue
        .iter()
        .filter(|(_, &deg)| deg == 0)
        .map(|(&v, _)| v)
        .collect();

    let mut result = Vec::new();

    while let Some(v) = queue.pop_front() {  // #@main-loop  // #@dequeue
        result.push(v.clone());  // #@dequeue

        for neighbor in &graph[v] {  // #@process-neighbors
            if let Some(deg) = in_degree.get_mut(neighbor) {
                *deg -= 1;  // #@process-neighbors
                if *deg == 0 {  // #@check-zero
                    queue.push_back(neighbor);  // #@check-zero
                }
            }
        }
    }

    if result.len() != graph.len() {  // #@check-cycle
        return None;  // Ciclo detectado
    }

    Some(result)
}

pub fn topological_sort_dfs(  // #@function-def
    graph: &HashMap<String, Vec<String>>,
) -> Vec<String> {
    let mut visited = HashSet::new();
    let mut result = Vec::new();

    fn dfs(  // #@dfs-visit
        v: &String,
        graph: &HashMap<String, Vec<String>>,
        visited: &mut HashSet<String>,
        result: &mut Vec<String>,
    ) {
        visited.insert(v.clone());
        if let Some(neighbors) = graph.get(v) {  // #@dfs-visit
            for neighbor in neighbors {
                if !visited.contains(neighbor) {  // #@dfs-visit
                    dfs(neighbor, graph, visited, result);
                }
            }
        }
        result.push(v.clone());  // #@post-order
    }

    for v in graph.keys() {
        if !visited.contains(v) {
            dfs(v, graph, &mut visited, &mut result);
        }
    }

    result.reverse();  // #@post-order
    result
}
