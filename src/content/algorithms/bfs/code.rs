use std::collections::{HashMap, HashSet, VecDeque};  // #@init-queue

pub fn bfs(  // #@function-def
    graph: &HashMap<char, Vec<char>>,
    start: char,
) -> Vec<char> {
    let mut visited = HashSet::new();  // #@init-visited
    visited.insert(start);
    let mut queue = VecDeque::new();  // #@init-queue
    queue.push_back(start);
    let mut result = Vec::new();

    while let Some(vertex) = queue.pop_front() {  // #@main-loop  // #@dequeue
        result.push(vertex);  // #@process-node

        if let Some(neighbors) = graph.get(&vertex) {  // #@enqueue
            for &neighbor in neighbors {
                if !visited.contains(&neighbor) {  // #@check-visited
                    visited.insert(neighbor);  // #@mark-visited
                    queue.push_back(neighbor);  // #@enqueue
                }
            }
        }
    }

    result
}

pub fn bfs_with_distance(  // #@function-def
    graph: &HashMap<char, Vec<char>>,
    start: char,
) -> HashMap<char, u32> {
    let mut visited = HashSet::new();  // #@init-visited
    visited.insert(start);
    let mut queue = VecDeque::new();  // #@init-queue
    queue.push_back((start, 0u32));
    let mut distances = HashMap::new();  // #@track-distance
    distances.insert(start, 0);

    while let Some((vertex, dist)) = queue.pop_front() {  // #@main-loop  // #@dequeue
        if let Some(neighbors) = graph.get(&vertex) {  // #@enqueue
            for &neighbor in neighbors {
                if !visited.contains(&neighbor) {  // #@check-visited
                    visited.insert(neighbor);  // #@mark-visited
                    distances.insert(neighbor, dist + 1);  // #@track-distance
                    queue.push_back((neighbor, dist + 1));  // #@enqueue
                }
            }
        }
    }

    distances
}
