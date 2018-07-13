CHOPPER
=======

```
 GGG  EEEE TTTTTT     TTTTTT  OOO      TTTTTT H  H EEEE      CCC H  H  OOO  PPPP  PPPP  EEEE RRRR  !!! 
G     E      TT         TT   O   O       TT   H  H E        C    H  H O   O P   P P   P E    R   R !!! 
G  GG EEE    TT         TT   O   O       TT   HHHH EEE      C    HHHH O   O PPPP  PPPP  EEE  RRRR  !!! 
G   G E      TT         TT   O   O       TT   H  H E        C    H  H O   O P     P     E    R R       
 GGG  EEEE   TT         TT    OOO        TT   H  H EEEE      CCC H  H  OOO  P     P     EEEE R  RR !!! 
```


Generates screenshots of UI elements.

Usage
-----

```
node chopper.js http://example.com div
```
or simply
```
./chopper.js http://example.com div
```

*Argument 1*: URL - required

*Argument 2*: Optional DOM selector. Defaults to 'div'.
Also supports multiple selectors, e.g. 'header,footer'.

Examples
--------

See `yarn demo` and `yarn tagesschau`.

