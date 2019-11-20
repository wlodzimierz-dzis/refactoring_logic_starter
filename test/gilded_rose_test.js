const test = require("tape");
const Item = require("../src/item");
const Shop = require("../src/shop");

test("normal item before sell date", function(t) {
    const item = new Item('+5 Dexterity Vest', 10, 20);
    const shop = new Shop([item]);

    shop.updateQuality();

    t.equal(item.sellIn, 9);
    t.equal(item.quality, 19);
    t.end();
});