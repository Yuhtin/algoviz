use std::collections::{BinaryHeap, HashMap};  // #@import
use std::cmp::Reverse;  // #@import

pub fn dijkstra(  // #@function-def
    graph: &HashMap<char, Vec<(char, u32)>>,
    start: char,
) -> HashMap<char, u32> {
    let mut distances: HashMap<char, u32> = graph  // #@init-distances
        .keys()
        .map(|&node| (node, u32::MAX))
        .collect();
    *distances.get_mut(&start).unwrap() = 0;  // #@init-distances

    let mut pq = BinaryHeap::new();  // #@priority-queue
    pq.push(Reverse((0, start)));

    let mut visited = std::collections::HashSet::new();

    while let Some(Reverse((current_dist, current))) = pq.pop() {  // #@main-loop  // #@extract-min
        if visited.contains(&current) {  // #@skip-visited
            continue;
        }
        visited.insert(current);

        if let Some(neighbors) = graph.get(&current) {  // #@relax-edge
            for &(neighbor, weight) in neighbors {
                let distance = current_dist + weight;  // #@update-distance

                if distance < distances[&neighbor] {  // #@relax-edge
                    distances.insert(neighbor, distance);  // #@update-distance
                    pq.push(Reverse((distance, neighbor)));  // #@priority-queue
                }
            }
        }
    }

    distances  // #@return-result
}
