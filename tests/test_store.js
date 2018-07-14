(function() {

    const EXAMPLE_DATA = new AppData([
        {id: "1", content: "First", done: true},
        {id: "2", content: "Second", done: false},
        {id: "3", content: "Third", done: false},
    ]);

    tests({
        "on an empty store, returns null": function(){
            localStorage.clear();
            let v = AppStore.get("Test Items", EXAMPLE_DATA);
            if (v != null) {
                fail("Expected no retrieval on cleared cache");
            }
        },
        "can round trip without errors": function(){
            localStorage.clear();
            AppStore.put("Test Items", EXAMPLE_DATA);
            let retrieved = AppStore.get("Test Items", EXAMPLE_DATA);
            let items = retrieved.items;
            itemsEqual(items, EXAMPLE_DATA.items);
        },
        "can round trip, state is persisted even if not matching": function() {
            localStorage.clear();
            let items = [{id: "1", content: "Test", done: true}];
            let ad = new AppData(items);
            ad.toggle("1");
            AppStore.put("Test Items", ad);
            ad.toggle("1");
            let retrieved = AppStore.get("Test Items", ad);
            if (retrieved == null) {
                fail("couldn't retrieve expected data");
            }
            let expected = { id: "1", content: "Test", done: false };
            if (!itemsEqual(retrieved.items[0], expected)) {
                fail("retrieved item wasn't as expected");
            }

        }
    });

    localStorage.clear();
})();