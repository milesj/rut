# FAQ

## Is the DOM really not required?

Rut itself does not require the DOM, nor does it use [JSDOM](https://github.com/jsdom/jsdom) for its
unit tests (our Jest `testEnvironment` is `node`).

However, if a component uses `window`, `document`, or any other browser based API, you will need the
DOM. An alternative would be to mock these APIS, but that might be more trouble than it's worth.

## How do I handle async calls during a mount or update?

TODO
