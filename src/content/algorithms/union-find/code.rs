struct UnionFind {  // #@class-def
    parent: Vec<usize>,  // #@init-parent
    rank: Vec<usize>,  // #@init-rank
}

impl UnionFind {  // #@class-def
    fn new(n: usize) -> Self {  // #@class-def
        UnionFind {
            parent: (0..n).collect(),  // #@init-parent
            rank: vec![0; n],  // #@init-rank
        }
    }

    fn find(&mut self, x: usize) -> usize {  // #@find-op
        if self.parent[x] != x {  // #@find-op
            self.parent[x] = self.find(self.parent[x]);  // #@path-compression
        }
        self.parent[x]  // #@find-op
    }

    fn union(&mut self, x: usize, y: usize) -> bool {  // #@union-op
        let mut px = self.find(x);  // #@union-op
        let mut py = self.find(y);  // #@union-op

        if px == py {  // #@connected
            return false;  // Ja conectados
        }

        // Union by rank  // #@union-by-rank
        if self.rank[px] < self.rank[py] {  // #@union-by-rank
            std::mem::swap(&mut px, &mut py);  // #@union-by-rank
        }
        self.parent[py] = px;  // #@union-by-rank
        if self.rank[px] == self.rank[py] {  // #@union-by-rank
            self.rank[px] += 1;  // #@union-by-rank
        }
        true
    }

    fn connected(&mut self, x: usize, y: usize) -> bool {  // #@connected
        self.find(x) == self.find(y)  // #@connected
    }
}

// Exemplo: detectar ciclo
fn has_cycle(n: usize, edges: &[(usize, usize)]) -> bool {
    let mut uf = UnionFind::new(n);
    for &(u, v) in edges {
        if !uf.union(u, v) {
            return true;  // Ciclo encontrado
        }
    }
    false
}
