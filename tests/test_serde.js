import test from 'ava';
import SerDe from "../app";

const EXAMPLE_ITEMS = [
    {id: "1", content: "First", done: true},
    {id: "2", content: "Second", done: false},
    {id: "3", content: "Third", done: false},
];

test("serializing a ChecklistItem should succeed", t => {
    t.plan(0); // just checking for exceptions
    SerDe.serialize(EXAMLE_ITEMS);
});

test("round-tripping items should be idempotent", t => {
    t.plan(1);
    t.deepEqual(
        EXAMPLE_ITEMS,
        SerDe.deserialize(SerDe.serialize(EXAMPLE_ITEMS)),
    );
});