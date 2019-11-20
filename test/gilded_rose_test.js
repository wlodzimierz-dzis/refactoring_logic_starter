const test = require("tape");
const Item = require("../src/item");
const Shop = require("../src/shop");

test("normal item before sell data", function(t) {
    // given
    const item = new Item('+5 Dexterity Vest', 10, 20);
    const shop = new Shop([item]);

    // when
    shop.updateQuality();

    // then
    t.equal(item.sellIn, 9);
    t.equal(item.quality, 19);
    t.end();
});

test("normal item on sell date", function (t) {
    // given
    const item = new Item("+5 Dexterity Vest", 1, 20);
    const shop = new Shop([item]);

    // when
    shop.updateQuality();

    // then
    t.equal(item.sellIn, 0);
    t.equal(item.quality, 19);
    t.end()
});

test("normal item after sell date with low quality", function (t) {
    // given
    const item = new Item("+5 Dexterity Vest", 0, 0);
    const shop = new Shop([item]);

    // when
    shop.updateQuality();

    // then
    t.equal(item.sellIn, -1);
    t.equal(item.quality, 0);
    t.end()
});

test("normal item after sell date", function (t) {
    // given
    const item = new Item("+5 Dexterity Vest", 0, 20);
    const shop = new Shop([item]);

    // when
    shop.updateQuality();

    // then
    t.equal(item.sellIn, -1);
    t.equal(item.quality, 18);
    t.end();
});

test("normal item of zero quality never goes below zero", function (t) {
    // given
    const item = new Item("+5 Dexterity Vest", 2, 0);
    const shop = new Shop([item]);

    // when
    shop.updateQuality();

    // then
    t.equal(item.sellIn, 1);
    t.equal(item.quality, 0);
    t.end();
});

test("brie increases in quality over time", function (t) {
    // given
    const item = new Item("Aged Brie", 1, 0);
    const shop = new Shop([item]);

    // when
    shop.updateQuality();

    // then
    t.equal(item.sellIn, 0);
    t.equal(item.quality, 1);
    t.end();
});

test("brie increases in quality faster after sell in", function (t) {
    // given
    const item = new Item("Aged Brie", 0, 0);
    const shop = new Shop([item]);

    // when
    shop.updateQuality();

    // then
    t.equal(item.sellIn, -1);
    t.equal(item.quality, 2);
    t.end();
});

test("brie increases in quality up to 50", function (t) {
    // given
    const item = new Item("Aged Brie", 1, 49);
    const shop = new Shop([item]);

    // when
    shop.updateQuality();

    // then
    t.equal(item.sellIn, 0);
    t.equal(item.quality, 50);
    t.end();
});

test("brie never increases quality of 50", function (t) {
    // given
    const item = new Item("Aged Brie", 1, 50);
    const shop = new Shop([item]);

    // when
    shop.updateQuality();

    // then
    t.equal(item.sellIn, 0);
    t.equal(item.quality, 50);
    t.end();
});

test("sulfuras never decrease in quality and sellIn never changes", function (t) {
    // given
    const item = new Item("Sulfuras, Hand of Ragnaros", 1, 10);
    const shop = new Shop([item]);

    // when
    shop.updateQuality();

    // then
    t.equal(item.sellIn, 1);
    t.equal(item.quality, 10);
    t.end();
});

test("backstage passes over 10 days to concert", function (t) {
    // given
    const item = new Item("Backstage passes to a TAFKAL80ETC concert", 11, 10);
    const shop = new Shop([item]);

    // when
    shop.updateQuality();

    // then
    t.equal(item.sellIn, 10);
    t.equal(item.quality, 11);
    t.end()
});

test("backstage passes with 10 days to concert", function (t) {
    // given
    const item = new Item("Backstage passes to a TAFKAL80ETC concert", 10, 10);
    const shop = new Shop([item]);

    // when
    shop.updateQuality();

    // then
    t.equal(item.sellIn, 9);
    t.equal(item.quality, 12);
    t.end();
});

test("backstage passes with 6 days to concert", function (t) {
    // given
    const item = new Item("Backstage passes to a TAFKAL80ETC concert", 6, 10);
    const shop = new Shop([item]);

    // when
    shop.updateQuality();

    // then
    t.equal(item.sellIn, 5);
    t.equal(item.quality, 12);
    t.end();
});

test("backstage passes with 5 days to concert", function (t) {
    // given
    const item = new Item("Backstage passes to a TAFKAL80ETC concert", 5, 10);
    const shop = new Shop([item]);

    // when
    shop.updateQuality();

    // then
    t.equal(item.sellIn, 4);
    t.equal(item.quality, 13);
    t.end();
});

test("backstage passes with 1 day to concert", function (t) {
    // given
    const item = new Item("Backstage passes to a TAFKAL80ETC concert", 1, 10);
    const shop = new Shop([item]);

    // when
    shop.updateQuality();

    // then
    t.equal(item.sellIn, 0);
    t.equal(item.quality, 13);
    t.end();
});

test("backstage passes with 0 days to concert", function (t) {
    // given
    const item = new Item("Backstage passes to a TAFKAL80ETC concert", 0, 10);
    const shop = new Shop([item]);

    // when
    shop.updateQuality();

    // then
    t.equal(item.sellIn, -1);
    t.equal(item.quality, 0);
    t.end();
});

test("backstage passes with quality close to 50", function (t) {
    // given
    const item = new Item("Backstage passes to a TAFKAL80ETC concert", 1, 48);
    const shop = new Shop([item]);

    // when
    shop.updateQuality();

    // then
    t.equal(item.sellIn, 0);
    t.equal(item.quality, 50);
    t.end();
});

test("backstage passes with quality close to 50", function (t) {
    // given
    const item = new Item("Backstage passes to a TAFKAL80ETC concert", 1, 49);
    const shop = new Shop([item]);

    // when
    shop.updateQuality();

    // then
    t.equal(item.sellIn, 0);
    t.equal(item.quality, 50);
    t.end();
});