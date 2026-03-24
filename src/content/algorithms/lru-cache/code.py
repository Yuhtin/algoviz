class Node:  # #@node-def
    def __init__(self, key=0, val=0):  # #@node-def
        self.key = key  # #@node-def
        self.val = val  # #@node-def
        self.prev = None  # #@node-def
        self.next = None  # #@node-def


class LRUCache:  # #@class-def
    def __init__(self, capacity):  # #@init-cache
        self.cap = capacity  # #@init-cache
        self.cache = {}  # key -> node  # #@hash-lookup
        # Sentinelas para simplificar operacoes
        self.head = Node()  # #@init-cache
        self.tail = Node()  # #@init-cache
        self.head.next = self.tail  # #@init-cache
        self.tail.prev = self.head  # #@init-cache

    def _remove(self, node):  # #@remove-node
        node.prev.next = node.next  # #@remove-node
        node.next.prev = node.prev  # #@remove-node

    def _add_front(self, node):  # #@add-to-front
        node.next = self.head.next  # #@add-to-front
        node.prev = self.head  # #@add-to-front
        self.head.next.prev = node  # #@add-to-front
        self.head.next = node  # #@add-to-front

    def get(self, key):  # #@get-op
        if key not in self.cache:  # #@hash-lookup
            return -1  # #@get-op
        node = self.cache[key]  # #@hash-lookup
        self._remove(node)  # #@move-to-front
        self._add_front(node)  # #@move-to-front
        return node.val  # #@get-op

    def put(self, key, value):  # #@put-op
        if key in self.cache:  # #@hash-lookup
            self._remove(self.cache[key])  # #@remove-node
        node = Node(key, value)  # #@node-def
        self.cache[key] = node  # #@hash-lookup
        self._add_front(node)  # #@add-to-front
        if len(self.cache) > self.cap:  # #@evict-lru
            lru = self.tail.prev  # #@evict-lru
            self._remove(lru)  # #@evict-lru
            del self.cache[lru.key]  # #@evict-lru
