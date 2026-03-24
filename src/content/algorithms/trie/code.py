class TrieNode:  # #@class-def
    def __init__(self):  # #@class-def
        self.children = {}  # #@class-def
        self.is_end = False  # #@mark-end


class Trie:  # #@class-def
    def __init__(self):  # #@init-root
        self.root = TrieNode()  # #@init-root

    def insert(self, word):  # #@insert-op
        node = self.root  # #@traverse
        for char in word:  # #@traverse
            if char not in node.children:  # #@check-exists
                node.children[char] = TrieNode()  # #@create-node
            node = node.children[char]  # #@traverse
        node.is_end = True  # #@mark-end

    def search(self, word):  # #@search-op
        node = self._find_node(word)  # #@search-op
        return node is not None and node.is_end  # #@search-op

    def startsWith(self, prefix):  # #@prefix-op
        return self._find_node(prefix) is not None  # #@prefix-op

    def _find_node(self, s):  # #@traverse
        node = self.root  # #@traverse
        for char in s:  # #@traverse
            if char not in node.children:  # #@check-exists
                return None  # #@check-exists
            node = node.children[char]  # #@traverse
        return node  # #@traverse

    def autocomplete(self, prefix):
        node = self._find_node(prefix)
        if not node:
            return []
        results = []
        self._dfs(node, prefix, results)
        return results

    def _dfs(self, node, current, results):
        if node.is_end:
            results.append(current)
        for char, child in node.children.items():
            self._dfs(child, current + char, results)
