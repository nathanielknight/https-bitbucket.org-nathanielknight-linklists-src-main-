# Web Checklist

A client-side only app for using checklists embedded in URLs.

(WIP as of 2018-07-10)

# Building and Testing

The code is written in [TypeScript][TS], so you'll need to install
the TypeScript compiler to build it. The project uses [NPM][NPM] to
manage dependencies and building.

[TS]: https://www.typescriptlang.org/
[NPM]: https://www.npmjs.com/

    npm install  # install dependencies
    npm build    # compile everything into app.js

The test-suite is written using [Tinytest][JSTT]. The tests
themselves are in the `tests` directory. They can be run by starting
a web-server and loading the `test.html` document.

[JSTT]: https://github.com/joewalnes/jstinytest

    python3 -m http.server 3030  # start the server

Then load [localhost:3030/test.html](localhost:3030/test.html) to
run the tests. The page will be green for passing tests or red
for failing tests. More information will be available in the Web
Console.
