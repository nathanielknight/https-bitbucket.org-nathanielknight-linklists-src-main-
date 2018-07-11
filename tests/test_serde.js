
const EXAMPLE_ITEMS = [
    {id: "1", content: "First", done: true},
    {id: "2", content: "Second", done: false},
    {id: "3", content: "Third", done: false},
];

tests({
    "serialize doesn't throw an exception": function() {
        SerDe.serialize(EXAMPLE_ITEMS);
    },
    "serialize-deserialize is idempotent": function() {
        let serialized = SerDe.serialize(EXAMPLE_ITEMS);
        let round_tripped = SerDe.deserialize(serialized);
        eq(round_tripped, EXAMPLE_ITEMS);
    },
    "deserialize-serialize is idempotent": function() {
        let serialized = SerDe.serialize(EXAMPLE_ITEMS);
        let deserialized = SerDe.deserialize(serialized);
        let round_tripped = SerDe.serialize(deserialized);
        eq(round_tripped, serialized);
    },
    "deserializing non-bas64 input throws an exception": function () {
        let src = "Sphinx of black quartz, judge my vow";
        let encoded = btoa(src);
        let broken = src.substring(1);
        try {
            SerDe.deserialize(broken);
        } catch {
            return
        }
        fail("Expected an exception to be thrown");
    },
    "deserializing an invalid list throws an exception": function() {
        try {
            let invalid_list = [{"not": "the", "right": "keys"}];
            SerDe.serialize(invalid_list);
        } catch {
            return
        }
        fail("Expected an exception to be thrown");
    },
    "deserializing something that's not a list throws an exception": function() {
        try {
            let invalid_object = "Alfalfa falls as a flask";
            SerDe.serialize(invalid_object);
        } catch {
            return
        }
        fail("Expected an exeption to be thrown");
    }
});