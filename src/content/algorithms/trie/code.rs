use std::collections::HashMap;

struct TrieNode {  // #@class-def
    children: HashMap<char, TrieNode>,  // #@class-def
    is_end: bool,  // #@mark-end
}

impl TrieNode {
    fn new() -> Self {  // #@class-def
        TrieNode {
            children: HashMap::new(),
            is_end: false,
        }
    }
}

struct Trie {  // #@class-def
    root: TrieNode,  // #@init-root
}

impl Trie {
    fn new() -> Self {  // #@init-root
        Trie {
            root: TrieNode::new(),  // #@init-root
        }
    }

    fn insert(&mut self, word: &str) {  // #@insert-op
        let mut node = &mut self.root;  // #@traverse
        for char in word.chars() {  // #@traverse
            node = node.children  // #@create-node
                .entry(char)
                .or_insert_with(TrieNode::new);  // #@create-node
        }
        node.is_end = true;  // #@mark-end
    }

    fn search(&self, word: &str) -> bool {  // #@search-op
        match self.find_node(word) {  // #@search-op
            Some(node) => node.is_end,  // #@search-op
            None => false,
        }
    }

    fn starts_with(&self, prefix: &str) -> bool {  // #@prefix-op
        self.find_node(prefix).is_some()  // #@prefix-op
    }

    fn find_node(&self, s: &str) -> Option<&TrieNode> {  // #@traverse
        let mut node = &self.root;  // #@traverse
        for char in s.chars() {  // #@traverse
            match node.children.get(&char) {  // #@check-exists
                Some(child) => node = child,  // #@traverse
                None => return None,  // #@check-exists
            }
        }
        Some(node)  // #@traverse
    }

    fn autocomplete(&self, prefix: &str) -> Vec<String> {
        let mut results = Vec::new();
        if let Some(node) = self.find_node(prefix) {
            self.dfs(node, prefix.to_string(), &mut results);
        }
        results
    }

    fn dfs(&self, node: &TrieNode, current: String, results: &mut Vec<String>) {
        if node.is_end {
            results.push(current.clone());
        }
        for (&char, child) in &node.children {
            let mut next = current.clone();
            next.push(char);
            self.dfs(child, next, results);
        }
    }
}
