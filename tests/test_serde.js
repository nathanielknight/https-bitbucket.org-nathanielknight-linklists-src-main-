import test from 'ava';
import SerDe from "../app";
import btoa from "btoa";
import atob from "atob";


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

test("deserializing invalid input throws an exception", t => {
    t.plan(1);
    let input = [{these: "are", the: "wrong keys", and: "values"}];
    let serialized = btoa(JSON.stringify(input));
    t.throws(() => SerDe.deserialize(serialized));
});