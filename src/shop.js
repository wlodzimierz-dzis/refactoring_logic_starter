class Shop {
    constructor(items = []) {
        this.items = items;
    }

    // decrease sellIn by 1
    // decrease quality by 1 when sellIn > 0
    // decrease quality by 2 when sellIn <= 0
    // never drop quality below 0
    normalUpdate(item) {
        if(item.sellIn > 0) item.quality -= 1;
        if(item.sellIn <= 0) item.quality -= 2;
        if(item.quality < 0) item.quality = 0;
        item.sellIn -= 1;
    }

    updateQuality() {
        this.items.forEach(item => {

            // seam
            if(item.name === "+5 Dexterity Vest") {
                return this.normalUpdate(item);
            }

            if (item.name != 'Aged Brie' && item.name != 'Backstage passes to a TAFKAL80ETC concert') {
                if (item.quality > 0) {
                    if (item.name != 'Sulfuras, Hand of Ragnaros') {
                        item.quality = item.quality - 1
                    }
                }
            } else {
                if (item.quality < 50) {
                    item.quality = item.quality + 1
                    if (item.name == 'Backstage passes to a TAFKAL80ETC concert') {
                        if (item.sellIn < 11) {
                            if (item.quality < 50) {
                                item.quality = item.quality + 1
                            }
                        }
                        if (item.sellIn < 6) {
                            if (item.quality < 50) {
                                item.quality = item.quality + 1
                            }
                        }
                    }
                }
            }
            if (item.name != 'Sulfuras, Hand of Ragnaros') {
                item.sellIn = item.sellIn - 1;
            }
            if (item.sellIn < 0) {
                if (item.name != 'Aged Brie') {
                    if (item.name != 'Backstage passes to a TAFKAL80ETC concert') {
                        if (item.quality > 0) {
                            if (item.name != 'Sulfuras, Hand of Ragnaros') {
                                item.quality = item.quality - 1
                            }
                        }
                    } else {
                        item.quality = item.quality - item.quality
                    }
                } else {
                    if (item.quality < 50) {
                        item.quality = item.quality + 1
                    }
                }
            }

        });

        return this.items;
    }
}

module.exports = Shop;