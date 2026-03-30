from collections import deque  # #@init-queue


def topological_sort_kahn(graph):  # #@function-def
    # Calcular grau de entrada
    in_degree = {v: 0 for v in graph}  # #@init-indegree
    for v in graph:  # #@init-indegree
        for neighbor in graph[v]:  # #@init-indegree
            in_degree[neighbor] += 1  # #@init-indegree

    # Vertices sem dependencias
    queue = deque([v for v in graph if in_degree[v] == 0])  # #@init-queue
    result = []

    while queue:  # #@main-loop
        v = queue.popleft()  # #@dequeue
        result.append(v)  # #@dequeue

        for neighbor in graph[v]:  # #@process-neighbors
            in_degree[neighbor] -= 1  # #@process-neighbors
            if in_degree[neighbor] == 0:  # #@check-zero
                queue.append(neighbor)  # #@check-zero

    if len(result) != len(graph):  # #@check-cycle
        return None  # Ciclo detectado  # #@check-cycle

    return result


def topological_sort_dfs(graph):  # #@function-def
    visited = set()
    result = []

    def dfs(v):  # #@dfs-visit
        visited.add(v)
        for neighbor in graph[v]:  # #@dfs-visit
            if neighbor not in visited:  # #@dfs-visit
                dfs(neighbor)  # #@dfs-visit
        result.append(v)  # #@post-order

    for v in graph:
        if v not in visited:
            dfs(v)

    return result[::-1]  # #@post-order
