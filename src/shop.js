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

    brieUpdate(item) {
        if(item.sellIn > 0) item.quality += 1;
        if(item.sellIn <= 0) item.quality += 2;
        if(item.quality > 50) item.quality = 50;
        item.sellIn -= 1;
    }

    sulfurasUpdate(item) {

    }

    backstagePassUpdate(item) {
        item.quality += 1;
        if(item.sellIn <= 10) item.quality += 1;
        if(item.sellIn <= 5) item.quality += 1;
        if(item.quality > 50) item.quality = 50;
        if(item.sellIn <= 0) item.quality = 0;
        item.sellIn -= 1;
    }

    updateQuality() {
        this.items.forEach(item => {
            // seam
            if(item.name === "Aged Brie") {
                return this.brieUpdate(item);
            }
            if(item.name === "Sulfuras, Hand of Ragnaros") {
                return this.sulfurasUpdate(item);
            }
            if(item.name === "Backstage passes to a TAFKAL80ETC concert") {
                return this.backstagePassUpdate(item);
            }
            return this.normalUpdate(item);

        });

        return this.items;
    }
}

module.exports = Shop;