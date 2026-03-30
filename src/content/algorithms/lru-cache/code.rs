use std::collections::HashMap;
use std::cell::RefCell;
use std::rc::Rc;

type Link = Option<Rc<RefCell<Node>>>;

struct Node {  // #@node-def
    key: i32,  // #@node-def
    val: i32,  // #@node-def
    prev: Link,  // #@node-def
    next: Link,  // #@node-def
}

impl Node {
    fn new(key: i32, val: i32) -> Rc<RefCell<Self>> {  // #@node-def
        Rc::new(RefCell::new(Node {
            key,
            val,
            prev: None,
            next: None,
        }))
    }
}

struct LRUCache {  // #@class-def
    capacity: usize,  // #@init-cache
    cache: HashMap<i32, Rc<RefCell<Node>>>,  // #@hash-lookup
    head: Rc<RefCell<Node>>,  // #@init-cache
    tail: Rc<RefCell<Node>>,  // #@init-cache
}

impl LRUCache {
    fn new(capacity: i32) -> Self {  // #@init-cache
        let head = Node::new(0, 0);  // #@init-cache
        let tail = Node::new(0, 0);  // #@init-cache
        head.borrow_mut().next = Some(Rc::clone(&tail));  // #@init-cache
        tail.borrow_mut().prev = Some(Rc::clone(&head));  // #@init-cache

        LRUCache {
            capacity: capacity as usize,
            cache: HashMap::new(),
            head,
            tail,
        }
    }

    fn remove(&self, node: &Rc<RefCell<Node>>) {  // #@remove-node
        let prev = node.borrow().prev.clone().unwrap();  // #@remove-node
        let next = node.borrow().next.clone().unwrap();  // #@remove-node
        prev.borrow_mut().next = Some(Rc::clone(&next));  // #@remove-node
        next.borrow_mut().prev = Some(Rc::clone(&prev));  // #@remove-node
    }

    fn add_front(&self, node: &Rc<RefCell<Node>>) {  // #@add-to-front
        let next = self.head.borrow().next.clone().unwrap();  // #@add-to-front
        node.borrow_mut().prev = Some(Rc::clone(&self.head));  // #@add-to-front
        node.borrow_mut().next = Some(Rc::clone(&next));  // #@add-to-front
        self.head.borrow_mut().next = Some(Rc::clone(node));  // #@add-to-front
        next.borrow_mut().prev = Some(Rc::clone(node));  // #@add-to-front
    }

    fn get(&mut self, key: i32) -> i32 {  // #@get-op
        if let Some(node) = self.cache.get(&key).cloned() {  // #@hash-lookup
            self.remove(&node);  // #@move-to-front
            self.add_front(&node);  // #@move-to-front
            return node.borrow().val;  // #@get-op
        }
        -1  // #@get-op
    }

    fn put(&mut self, key: i32, value: i32) {  // #@put-op
        if let Some(node) = self.cache.get(&key).cloned() {  // #@hash-lookup
            self.remove(&node);  // #@remove-node
        }
        let node = Node::new(key, value);  // #@node-def
        self.cache.insert(key, Rc::clone(&node));  // #@hash-lookup
        self.add_front(&node);  // #@add-to-front

        if self.cache.len() > self.capacity {  // #@evict-lru
            let lru = self.tail.borrow().prev.clone().unwrap();  // #@evict-lru
            self.remove(&lru);  // #@evict-lru
            self.cache.remove(&lru.borrow().key);  // #@evict-lru
        }
    }
}
