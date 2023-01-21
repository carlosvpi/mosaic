# mosaic
MVC for the front-end

From a high level perspective, a Mosaic app is made up of tiles, where each tile is one DOM element. `@carlosvazpi/mosaic` provides a quick way to create and integrate DOM elements in an HTML document, as well as to provide them with a behaviour.

# Install

```
yarn add @carlosvpi/mosaic
```

# How to use

1. Import Mosaic in your file

```javascript
import { Mosaic } from '@carlosvpi/mosaic'
```

2. Wrap `document.body`

```javascript
const bodyConstructor = Mosaic(document.body)
```

Now through `bodyConstructor` you can add or remove elements to the body of your document

# Creating new tiles in your mosaic

### The tile constructor

```javascript
const tileConstructor = Mosaic`tag[attr1 = value1; attr2 = ${ value 2 }]`
```

A tile constructor created calling `Mosaic` with a string template. On creation, a new DOM element is created, and its attributes are set to those provided by the template.

```javascript
// create a span constructor
const spanConstructor = Mosaic`span[id=span-1]`
```

### Providing attributes to a tile constructor

A tile constructor can be provided attributes that may be static (if provided at the time of creating the tile constructor) or dynamic (if, instead, a function is provided that will set the attribute at a different point in time, or points in time).

1. Static attribute

This code gives the attribute `placeholder` statically to an input constructor

```javascript
const inputConstructor = Mosaic`input[placeholder=type something here]`
```

A DOM element (input) is created and assigned the attribute `placeholder` to the value `"type something here"`.

2. Dynamic attribute

This code gives the attribute `placeholder` dynamically to an input constructor

```javascript
const assignPlaceholder = assign => {
	assign('A')
	setTimeout(() => assign('B'), 1000)
	setTimeout(() => assign('Final'), 2000)
}

const inputConstructor = Mosaic`input[placeholder=${assignPlaceholder}]`
```

A Dom element (input) is created. Then `assignPlaceholder` is called. The parameter (`assign`) is a function that sets the attribute of the input to its argument (so `assign('a')` has the effect that the placeholder of the input will be set to `'a'`). In this case, `assignPlaceholder` sets the placeholder of the input, first, to `'A'`. After 1 second, to `'B'`. And after yet another second, to `'Final'`.

### Return the tile from the tile constructor

As we said, a tile constructor creates a tile, but it doesn't return it. Instead, the constructor returns a function `children` that expects to take the children to be appended to the tile. The `children` function does return the tile form the tile constructor.

```javascript
const inputConstructor = Mosaic`input[placeholder=type something here]`
const inputTile = inputConstructor()
```

In the example above, an input is created without children.

### Providing children to a tile constructor

Children are passed as arguments to a tile constructor. This has the effect of adding the children to the tile held by the tile constructor, and also makes the whole expression return said tile.

Children passed to a tile constructor can either be other tiles or even just plain strings (which are transformed into Text DOM elements).

```javascript
const spanConstructor = Mosaic`span`
const strongConstructor = Mosaic`strong`
const strongTile = strongConstructor('Bold')
const spanTile = spanConstructor('This text is in ', strongTile, '. And this one is not.')
```

In the example above, a couple of elements are created and one is nested inside the other.

### Assigning classes to a tile

Like attributes, classes can be static or dynamic. Classes are assigned to tiles, not to tile constructors.

Classes are assigned through the `.classed()` method, which accepts two parameters: the class name and whether the class is to be added (true) or removed (false). Alternatively, instead of two parameters, classes can be given in the form of a hash `{ string => boolean }`.

The `.classed()` method returns the tile, so it is chainable.

1. Static classes

This code adds class 'my-class' statically to a span tile.

```javascript
const spanTile = Mosaic`span`().classed('my-class', true)
```

Notice that we have to call the span constructor (`Mosaic\`span\``) in order to assign its tile a class.

Another way to do the same:

```javascript
const spanTile = Mosaic`span`().classed({ 'my-class': true })
```

The above method allows us to add several classes with one call.

2. Dynamic classes

Like with the dynamic attributes, if instead `true` or `false` we provide a function when calling `.classed()`, the function will be called and assign the class in a timely manner.

```javascript
const assignMyClass = assign => {
	let value = true
	assign(value)
	setInterval(() => assign(value = !value), 1000)
}
const spanTile = Mosaic`span`().classed('my-class', assignMyClass)
```

The above code assigns initially the class `my-class` to the span tile, and it toggles this class every second.

Another way to do the same:

```javascript
const assignMyClass = assign => {
	let value = true
	assign(value)
	setInterval(() => assign(value = !value), 1000)
}
const spanTile = Mosaic`span`().classed({ 'my-class': assignMyClass })
```

### Assigning event listeners

Event listeners can be assigned using the `.on()` on tiles. This method has the same signature as `.addEventListener`.

The `.on()` method returns the tile, so it is chainable.

```javascript
const buttonTile = Mosaic`button`('Click me').on('click', () => { alert('Clicked') })
```

The above code makes an alert appear upon clicking the button.

### Render everything inside the body

In order to build a page, we just pass to the bodyConstructor function the children we expect it to have

```javascript
bodyConstructor(inputTile, spanTile)
```

# How to compile

@carlosvpi/mosaic is provided as a ts module. In order to use it in the browser you will have some ts file `src/index.ts` importing it like so

```javascript
import { Mosaic } from `@carlosvpi/mosaic`

Mosaic(document.body)(Mosaic`h1`('Hello, world'))
```

Follow these steps:

1. Compile it

Run

```
tsc
```

You will need a tsconfig.json file roughly like this one

```
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2015",
    "lib": ["es6", "dom", "es2017"],
    "declaration": true,
    "outDir": "./js-src"
  },
  "include": [
    "src/**/*"
  ]
}
```

2. Browserify it

Run

```
browserify js-src/index.js > dist/index.js
```

You will need to have browserify installed globally. Alternatively, install it in your devDependencies and use `yarn browserify` instead of `browserify` (in that case, you will need to remove the first 2 and last lines of the resulting file with `sed -i '' '1,2d;$d' dist/index.js`).

3. Minify it

Run

```
minify dist/index.js > dist/index.min.js
```

You will need to have minify installed globally. Alternatively, install it in your devDependencies and use `yarn minify` instead of `browserify` (in that case, you will need to remove the first 2 and last lines of the resulting file with `sed -i '' '1,2d;$d' dist/index.min.js`).