
tests({
    "hash can be run without exceptions": function() {
        let sig = Hash.signature(EXAMPLE_ITEMS);
        if (sig == null) {
            fail("Signature was null");
        }
    },
    "hash signature is different for different lists": function() {
        let EXAMPLE_ITEMS = [
            {id: "1", content: "First", done: true},
            {id: "2", content: "Second", done: false},
            {id: "3", content: "Third", done: false},
        ];

        let sig1 = Hash.signature(EXAMPLE_ITEMS);
        EXAMPLE_ITEMS[0].content = "Something different";
        let sig2 = Hash.signature(EXAMPLE_ITEMS);
        if (sig1 == sig2) {
            fail("Signatures weren't different");
        }
    }

})