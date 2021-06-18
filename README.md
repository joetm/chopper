CHOPPER
=======

![Chopper](https://raw.githubusercontent.com/joetm/chopper/master/choppa.jpg "Get to da choppa!")

Generates screenshots of UI elements.

Installation
------------

Type `yarn install` or `npm install`

Usage
-----

```
./chopper.js http://www.tagesschau.de div.box
./chopper.js 'https://twitter.com/search?q=Europe&src=tren' 'li>div.tweet'
```

*Argument 1*: URL - required

*Argument 2*: Optional DOM selector. Defaults to 'div'.
Also supports multiple selectors separated by comma, e.g. 'header,footer'.

Examples
--------

Run `yarn demo`, `yarn tagesschau`, and `yarn twitter`.

