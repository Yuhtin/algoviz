from collections import deque  # #@init-queue


def bfs(graph, start):  # #@function-def
    visited = {start}  # #@init-visited
    queue = deque([start])  # #@init-queue
    result = []

    while queue:  # #@main-loop
        vertex = queue.popleft()  # #@dequeue
        result.append(vertex)  # #@process-node

        for neighbor in graph[vertex]:  # #@enqueue
            if neighbor not in visited:  # #@check-visited
                visited.add(neighbor)  # #@mark-visited
                queue.append(neighbor)  # #@enqueue

    return result


def bfs_with_distance(graph, start):  # #@function-def
    visited = {start}  # #@init-visited
    queue = deque([(start, 0)])  # #@init-queue
    distances = {start: 0}  # #@track-distance

    while queue:  # #@main-loop
        vertex, dist = queue.popleft()  # #@dequeue

        for neighbor in graph[vertex]:  # #@enqueue
            if neighbor not in visited:  # #@check-visited
                visited.add(neighbor)  # #@mark-visited
                distances[neighbor] = dist + 1  # #@track-distance
                queue.append((neighbor, dist + 1))  # #@enqueue

    return distances
