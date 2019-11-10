const Item = require("./item");
const Shop = require("./shop");

const items = [];

items.push(new Item('+5 Dexterity Vest', 10, 20));
items.push(new Item('Aged Brie', 2, 0));
items.push(new Item('Elixir of the Mongoose', 5, 7));
items.push(new Item('Sulfuras, Hand of Ragnaros', 0, 80));
items.push(new Item('Sulfuras, Hand of Ragnaros', -1, 80));
items.push(new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20));
items.push(new Item('Backstage passes to a TAFKAL80ETC concert', 10, 49));
items.push(new Item('Backstage passes to a TAFKAL80ETC concert', 5, 49));
// this conjured item does not work properly yet
items.push(new Item('Conjured Mana Cake', 3, 6));

const shop = new Shop(items);

const days = 2;

let result = "";
for (let i = 0; i < days; i++) {
    result += showHeaderFor(i);
    result += showItemsFor(i);
    shop.updateQuality();
}


function showHeaderFor(day) {
    return '-------- day ' + day + ' --------\n';
}

function showItemsFor(day) {
    let result = "";
    result += 'name, sellIn, quality\n';
    for (let j = 0; j < items.length; j++) {
        const item = items[j];
        result += (item.name + ', ' + item.sellIn + ', ' + item.quality + "\n");
    }
    return result;
}



console.log(result);
