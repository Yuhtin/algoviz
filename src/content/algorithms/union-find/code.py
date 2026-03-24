class UnionFind:  # #@class-def
    def __init__(self, n):  # #@class-def
        self.parent = list(range(n))  # #@init-parent
        self.rank = [0] * n  # #@init-rank

    def find(self, x):  # #@find-op
        if self.parent[x] != x:  # #@find-op
            self.parent[x] = self.find(self.parent[x])  # #@path-compression
        return self.parent[x]  # #@find-op

    def union(self, x, y):  # #@union-op
        px, py = self.find(x), self.find(y)  # #@union-op
        if px == py:  # #@connected
            return False  # Ja conectados  # #@connected

        # Union by rank  # #@union-by-rank
        if self.rank[px] < self.rank[py]:  # #@union-by-rank
            px, py = py, px  # #@union-by-rank
        self.parent[py] = px  # #@union-by-rank
        if self.rank[px] == self.rank[py]:  # #@union-by-rank
            self.rank[px] += 1  # #@union-by-rank
        return True

    def connected(self, x, y):  # #@connected
        return self.find(x) == self.find(y)  # #@connected


# Exemplo: detectar ciclo
def has_cycle(n, edges):
    uf = UnionFind(n)
    for u, v in edges:
        if not uf.union(u, v):
            return True  # Ciclo encontrado
    return False
