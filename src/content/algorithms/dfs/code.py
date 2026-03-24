def dfs_recursive(graph, start, visited=None):  # #@function-def
    if visited is None:  # #@init-visited
        visited = set()  # #@init-visited

    if start in visited:  # #@base-case
        return  # #@base-case

    visited.add(start)  # #@mark-visited
    print(start)  # #@process-node

    for neighbor in graph[start]:  # #@recurse
        dfs_recursive(graph, neighbor, visited)  # #@recurse


def dfs_iterative(graph, start):  # #@function-def
    visited = set()  # #@init-visited
    stack = [start]  # #@stack-push

    while stack:  # #@main-loop
        vertex = stack.pop()  # #@stack-pop

        if vertex in visited:  # #@base-case
            continue  # #@base-case

        visited.add(vertex)  # #@mark-visited
        print(vertex)  # #@process-node

        for neighbor in graph[vertex]:  # #@recurse
            if neighbor not in visited:  # #@recurse
                stack.append(neighbor)  # #@stack-push
