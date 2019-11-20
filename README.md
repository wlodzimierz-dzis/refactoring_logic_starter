# Gilded Rose Refactoring Kata in JS

This refactoring kata is inspired by https://github.com/NotMyself/GildedRose

Purpose: go through a refactoring kata to learn repeatable rules for refactoring **business logic** in JS
from procedural to object-oriented to functional style.


## Requirements

Open requirements.txt and get familiar with our problem domain.

Summary:
Here's some legacy code that works. There's no unit tests just a requirements description (requirements.txt)
and textual verification (gilded_rose.js). We want you to implement some modifications with some constraints.

Our goal is to refactor the code first before we add new functionality.

## Text-based approval testing/snapshot testing

We have no tests other than gilded_rose.js textual verification.
Run the JS file to see what it does.

First thing we want to do is increase number of days we use for testing
```javascript
const days = 17;
```
this way we can test full update cycle for all products.

Then we can grab the text output and put it into a variable:
```javascript
const expectedResult = `
-------- day 0 --------
...
-------- day 1 --------
...
`
console.log(result.trim() === expectedResult.trim() ? "everything works" : "you broke it");
```

It will prevent us from breaking things.

We could go one step further add some automated diff tool here.
But for now we gonna put both strings in files and compare them from IDE/diff tool when things break.

## Refactoring rules

Here's some basic rules we gonna follow while refactoring the code:
* make smaller things (smaller methods, classes)
* don't let them know too much about each other
* you cannot change production code if it's not covered by tests
* you can use your IDE refactorings


## Adding characterization tests

Let's add some tests that describe how the system behaves.

```javascript
npm i tape -D
```

package.json
```javascript
{
  "scripts": {
    "test": "tape test/*.js"
  },
  "devDependencies": {
    "tape": "4.10.1"
  }
}
```

Come up with as many test cases as you can think of. I will share mine at the end of the exercise.
If at any point of this kata you discover our unit tests didn't fail while text based tests failed,
feel free to add a missing unit test.

Here's a first one for starters:
```javascript
const test = require("tape");
const Item = require("../src/item");
const Shop = require("../src/shop");

test("normal item before sell date", function (t) {
    t.plan(2);

    const item = new Item("+5 Dexterity Vest", 10, 20);
    const shop = new Shop([item]);
    shop.updateQuality();

    t.equal(item.sellIn, 9);
    t.equal(item.quality, 19);
});
```

Let's split test writing into groups:
* normal item e.g. "+5 Dexterity Vest", "Aged Brie" and "Sulfuras, Hand of Ragnaros" group
* "Backstage passes to a TAFKAL80ETC concert" group

Each group should come up with at least 6 different tests.

## Removing duplication from tests

Let's try to remove duplication from tests.

## Refactoring: replace for loop with forEach

We don't want to deal with indexes and boundary conditions so let's use forEach.
My IDE doesn't have automated JS refactoring for this so I use search and replace (this.items[i] => item)

Run unit tests and text based tests after this change to verify everything still works as expected.

## Normal item update - seam

First piece of functionality I want to refactor is normal item update. I'm gonna create a seam
where I bail out from the complicated logic and delegate to my own function with cleaner code.

I want to update normalUpdate(item) method.
Based on the requirements.txt I know that normal items should:
* decrease sellIn by 1
* decrease quality by 1 when sellIn > 0
* decrease quality by 2 when sellIn <= 0
* never drop quality below 0

Based on this description I came up with this:

```javascript
    normalUpdate(item) {
        if(item.sellIn > 0) item.quality -= 1;
        if(item.sellIn <= 0) item.quality -= 2;
        if(item.quality < 0) item.quality = 0;
        item.sellIn -= 1;
    }
```

Now I have to escape the old logic as early as possible:
```javascript
        this.items.forEach(item => {
            if(item.name === "+5 Dexterity Vest") {
                return this.normalUpdate(item);
            }
```

Run tests to verify if everything is still fine.


## Aged Brie update - seam

Based on the requirement.txt I know that Aged Brie should:
* decrease sellIn by 1
* increase quality by 1 when sellIn > 0
* increase quality by 2 when sellIn <= 0
* never increase quality above 50

Implement brieUpdate(item) and inject it similarly to the previous seam.

## Sulfuras update - seam

Based on the requirement.txt I know that Sulfuras should:
* never decrease in quality
* never decrease in sellIn date

Implement sulfurasUpdate(item) and inject it similarly to previous seams.


## Backstage pass update - seam

Based on the requirement.txt I know that Backstage pass update should:
* decrease sellIn by 1
* never increase quality above 50
* drop quality to 0 when after sellIn date
* quality increase by 1 over time
* if less than or equal 10 days quality increase by 2
* if less than 5 days quality increase by 3


Implement backstagePassUpdate(item) and inject it similarly to previous seams.

## Using code coverage to check how we're doing

```javascript
npm i nyc -D
```

In package.json:
```javascript
 "coverage": "nyc tape test/*.js && nyc report --reporter=html"
```

```javascript
npm run coverage
```
Open coverage/index.html.

Find if there's any lines or branches that are not covered by our test.

Note: please remember to add .nyc_output and coverage to .gitignore.

Add missing test cases.

## Removing old code

Start removing old code checking if all tests pass.
One thing we may need to do is move the normal item update as a default case so that it works
for more items.

## Moving update strategies to separate classes

Move update strategies to separate files. Run tests to verify everything works.
For now let's stick to class based design.

Here's normal.js sample solution:
```javascript
const Item = require("./item");

class Normal extends Item {
    update() {
        if (this.sellIn > 0) this.quality -= 1;
        if (this.sellIn <= 0) this.quality -= 2;
        if (this.quality < 0) this.quality = 0;
        this.sellIn -= 1;
    }
}

module.exports = Normal;
```

Do similar thing for brie.js and backstage.js.
item.js should have default no-op update strategy.

Then in shop.js:
```javascript

class Shop {
    constructor(items = []) {
        this.items = items.map(this.classFor);
    }

    classFor(item) {
        if (item.name === "Aged Brie") {
            return new Brie(item.name, item.sellIn, item.quality);
        } else if (item.name === "Sulfuras, Hand of Ragnaros") {
            return new Item(item.name, item.sellIn, item.quality);
        } else if (item.name === "Backstage passes to a TAFKAL80ETC concert") {
            return new Backstage(item.name, item.sellIn, item.quality);
        } else {
            return new Normal(item.name, item.sellIn, item.quality);
        }
    }

    updateQuality() {
        this.items.forEach(item => {
            item.update();
        });

        return this.items;
    }
}
```

You may need to update our text based test and read current items from the shop:
```javascript
    for (let j = 0; j < shop.items.length; j++) {
        const item = shop.items[j];
```

## Dynamic class lookup

classFor is quite repetitive, so let's refactor it:
```javascript
const classes = {
    "Aged Brie": Brie,
    "Sulfuras, Hand of Ragnaros": Item,
    "Backstage passes to a TAFKAL80ETC concert": Backstage
};
...
classFor(item) {
   return new (classes[item.name] || Normal)(item.name, item.sellIn, item.quality);
}
```

So we can think of dynamic class lookup as of a factory of concrete items based on the generic item role/duck type.

## Adding Conjured items

Now, we're ready to add Conjured items with more confidence.
For now you can assume we only sell "Conjured Mana Cake".
We gonna implement it with ping-pong pairing.

Here's what we know based on our requirements:
* quality decreases by 2 before sell date
* quality decreases by 4 after sell date
* quality never drops below 0

Write tests and corresponding implementation.

Hints:
* conjured item before sell date
* conjured item with small quality
* conjured item after sell date
* conjured item with zero quality

## Refactoring towards more functional style

Personally I'm not a big fan of classes in JS. In the last part of this kata we gonna change our
code to avoid using classes and stick to simple functions and object literals.

First let's remove our item classes. Here's one example with normal.js:
```javascript
function update(item) {
    item.sellIn = item.sellIn - 1;

    if (item.quality === 0) return item;
    item.quality = item.quality - 1;
    if (item.sellIn < 0 && item.quality > 0) {
        item.quality = item.quality - 1;
    }

    return item;
}

module.exports = update;
```

We only leave the update function. No this references.
Please note that if we do early return we need to return item, not the undefined value.

No it's your turn. Do the same change for backstage.js, brie.js and conjured.js

Then we can update shop.js:
```javascript
const normal = require("./normal");
const brie = require("./brie");
const backstage = require("./backstage");
const conjured = require("./conjured");

const update = {
    "Aged Brie": brie,
    "Sulfuras, Hand of Ragnaros": item => item,
    "Backstage passes to a TAFKAL80ETC concert": backstage,
    "Conjured Mana Cake": conjured
};


class Shop {
    constructor(items = []) {
        this.items = items;
    }

    updateItem(item) {
        return (update[item.name] || normal)(item);
    }

    updateQuality() {
        return this.items.map(this.updateItem);
    }
}
```

## Going even more functional

Everything up to this point maintained original constraints of not removing original classes.
Let's drop this constraint now and remove all usage of classes, this, new.

Instead of having a Shop class we can export updateQuality function:
```javascript
function updateItem(item) {
    return (update[item.name] || normal)(item);
}

function updateQuality(items) {
    return items.map(updateItem);
}

module.exports = updateQuality;
```

We dropped class noise from the previous example.

Now we need to update our test:
```javascript
const updateQuality = require("../src/shop");
...
const item = new Item(itemName, sellIn.before, quality.before);
const updatedItem = updateQuality([item])[0];
```

Optionally we can update text based text, however at this point I'm more interested in proper unit tests.

We can also remove Item class as we can use object literals.
Update your test with:
```javascript
const item = {name: itemName, sellIn: sellIn.before, quality: quality.before};
```

One small improvement we can make is to avoid mutation of input parameters in our update strategies.
We make a copy of the input argument. Object.assign is a handy utility for making a shallow copy.
And we return a new item. No modification of the input arguments.

```javascript
function update(originalItem) {
    const item = Object.assign({}, originalItem);
    // const item = {...originalItem};
```

Now our program is mostly simple data transformations operating on input arguments.
No mutation happens as we always copy input arguments.
I find this program much easier to reason about than what we had before.
You can look at each function individually and figure out what it does with its input and
how it calculates its output. There's no implicit state. All code is explicit.

## Takeaways:

* make change easy and then make the easy change
* prefer duplication to wrong abstraction
* sometimes you need to take a step backwards to move two steps forward
* Misplaced behavior: Rapid growth in complexity is a sign that the code keeps accumulating responsibilities. Often, those responsibilities would be better off when expressed as separate units, so use refactorings like Extract Class/Function
* Excess conditional logic: Quite often new features or bug fixes are squeezed into an existing design with the use of if/else chains. Most nested conditionals indicate a missing abstraction, and refactoring the code to use polymorphism erases special cases from the code.