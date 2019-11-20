const test = require("tape");
const Item = require("../src/item");
const Shop = require("../src/shop");

function verify({itemName, sellIn, quality}) {
    return function(t) {
        // given
        const item = new Item(itemName, sellIn.before, quality.before);
        const shop = new Shop([item]);
        // when
        const updatedItem = shop.updateQuality([item])[0];

        // then
        t.equal(updatedItem.sellIn, sellIn.after);
        t.equal(updatedItem.quality, quality.after);
        t.end();
    };
}


test("normal item before sell date", verify({
    itemName: "Elixir of the Mongoose",
    sellIn: {before: 10, after: 9},
    quality: {before: 20, after: 19},
}));

test("normal item on sell date",  verify({
    itemName: "+5 Dexterity Vest",
    sellIn: {before: 1, after: 0},
    quality: {before: 20, after: 19},
}));

test("normal item after sell date with low quality", verify({
        itemName: "+5 Dexterity Vest",
        sellIn: {before: 0, after: -1},
        quality: {before: 1, after: 0}
    })
);

test("normal item after sell date", verify({
    itemName: "+5 Dexterity Vest",
    sellIn: {before: 0, after: -1},
    quality: {before: 20, after: 18}

}));

test("normal item of zero quality never goes below zero", verify({
    itemName: "+5 Dexterity Vest",
    sellIn: {before: 2, after: 1},
    quality: {before: 0, after: 0}
}));

test("brie increases in quality over time", verify({
    itemName: "Aged Brie",
    sellIn: {before: 1, after: 0},
    quality: {before: 0, after: 1}
}));

test("brie increases in quality up to 50", verify({
    itemName: "Aged Brie",
    sellIn: {before: 1, after: 0},
    quality: {before: 49, after: 50}
}));

test("brie never increases quality of 50", verify({
    itemName: "Aged Brie",
    sellIn: {before: 1, after: 0},
    quality: {before: 50, after: 50}
}));

test("brie increses quality faster past sellIn", verify({
    itemName: "Aged Brie",
    sellIn: {before: -1, after: -2},
    quality: {before: 30, after: 32}
}));

test("sulfuras never decrease in quality and sellIn never changes", verify({
    itemName: "Sulfuras, Hand of Ragnaros",
    sellIn: {before: 1, after: 1},
    quality: {before: 10, after: 10}
}));

test("backstage passes over 10 days to concert", verify({
    itemName: "Backstage passes to a TAFKAL80ETC concert",
    sellIn: {before: 11, after: 10},
    quality: {before: 10, after: 11}
}));

test("backstage passes with 10 days to concert", verify({
    itemName: "Backstage passes to a TAFKAL80ETC concert",
    sellIn: {before: 10, after: 9},
    quality: {before: 10, after: 12}
}));

test("backstage passes with 6 days to concert", verify({
    itemName: "Backstage passes to a TAFKAL80ETC concert",
    sellIn: {before: 6, after: 5},
    quality: {before: 10, after: 12}
}));

test("backstage passes with 5 days to concert", verify({
    itemName: "Backstage passes to a TAFKAL80ETC concert",
    sellIn: {before: 5, after: 4},
    quality: {before: 10, after: 13}
}));

test("backstage passes with 1 day to concert", verify({
    itemName: "Backstage passes to a TAFKAL80ETC concert",
    sellIn: {before: 1, after: 0},
    quality: {before: 10, after: 13}
}));

test("backstage passes with 0 days to concert", verify({
    itemName: "Backstage passes to a TAFKAL80ETC concert",
    sellIn: {before: 0, after: -1},
    quality: {before: 10, after: 0}

}));

test("backstage passes with quality close to 50", verify({
    itemName: "Backstage passes to a TAFKAL80ETC concert",
    sellIn: {before: 1, after: 0},
    quality: {before: 48, after: 50}
}));

test("backstage passes with quality close to 50", verify({
    itemName: "Backstage passes to a TAFKAL80ETC concert",
    sellIn: {before: 1, after: 0},
    quality: {before: 49, after: 50},
}));