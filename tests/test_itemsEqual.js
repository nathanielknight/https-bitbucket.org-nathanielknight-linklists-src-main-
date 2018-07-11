tests({
    "equal items compare equal": function() {
        let item1 = {id: "one", content: "asdf", done: true};
        let item2 = {id: "one", content: "asdf", done: true};
        assert(itemsEqual(item1, item2), "equal items compare equal");
    },
    "different items compare different": function() {
        let item1 = {id: "one", content: "asdf", done: true};
        let item2 = {id: "two", content: "jkl", done: false};
        assert(!itemsEqual(item1, item2), "different items compare different");
    },

});