import heapq  # #@import
from collections import defaultdict  # #@import


def dijkstra(graph, start):  # #@function-def
    distances = {node: float('inf') for node in graph}  # #@init-distances
    distances[start] = 0  # #@init-distances

    pq = [(0, start)]  # #@priority-queue
    visited = set()

    while pq:  # #@main-loop
        current_dist, current = heapq.heappop(pq)  # #@extract-min

        if current in visited:  # #@skip-visited
            continue  # #@skip-visited
        visited.add(current)

        for neighbor, weight in graph[current]:  # #@relax-edge
            distance = current_dist + weight  # #@update-distance

            if distance < distances[neighbor]:  # #@relax-edge
                distances[neighbor] = distance  # #@update-distance
                heapq.heappush(pq, (distance, neighbor))  # #@priority-queue

    return distances  # #@return-result
