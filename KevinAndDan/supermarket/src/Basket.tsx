type ReceiptLine = {
  name: string;
  price: number;
  discount: number;
  quantity: number;
  total: number;
};

export class Basket {
  products: Record<string, number>;
  private scannedItems: string[] = [];

  constructor(products: Record<string, number> = {}) {
    this.products = products;
  }

  scanItem(item: string) {
    this.scannedItems.push(item);
  }

  generateReceipt() {
    const items = this.scannedItems.reduce(
      (
        acc: Array<ReceiptLine>,
        item
      ) => {
        let existingItem = acc.find((i) => i.name === item);
        if (!existingItem) {
          existingItem = {
            name: item,
            price: 0,
            discount: 0,
            quantity: 0,
            total: 0,
          };
          acc.push(existingItem);
        }
        const product = this.products[item];
        if (product) {
          existingItem.price = product;
          existingItem.quantity += 1;
          existingItem.total = existingItem.price * existingItem.quantity;
        }

        return acc;
      },
      []
    );

    const buyXGetOneFree = (name: string, amount: number) => {
        return (items:ReceiptLine[] ) => {
            items.forEach((item) => {
                if (item.name === name && item.quantity >= amount) {
                    const freeItems = Math.floor(item.quantity / amount);
                    item.discount = item.price * freeItems;
                    item.total = item.total - item.discount;
                }
            });
        };
    };

    const buyOneItemGetAnotherFree = (name: string, freeItemName: string) => {
        return (items:ReceiptLine[] ) => {
            const hasItem = items.find((item) => item.name === name);
            const freeItem = items.find((item) => item.name === freeItemName);
            if (hasItem && freeItem) {
                freeItem.discount = freeItem.price;
                freeItem.total = freeItem.total - freeItem.discount;
            }
        };
    };

    const setPriceOffer = (names: string[], offerPrice: number) => {
        return (items:ReceiptLine[] ) => {
            const hasAllItems = names.every((name) =>
                items.some((item) => item.name === name)
            );  
            if (hasAllItems) {
                const totalOriginalPrice = names.reduce((sum, name) => {
                    const item = items.find((i) => i.name === name);
                    return sum + (item ? item.price : 0);
                }, 0);

                const discount = totalOriginalPrice - offerPrice;
                items.push({
                    name: "meal deal",
                    discount: discount,
                    price: 0,
                    quantity: 1,
                    total: -discount,
                });
            }

        };
    };
    

    const breadOffer = buyXGetOneFree("Bread", 3);
    const eggsOffer = buyOneItemGetAnotherFree("Bread", "Eggs");
    const mealDealOffer = setPriceOffer(["Sandwich", "Apple", "Coke"], 4.95);

    const offers = [breadOffer, eggsOffer, mealDealOffer];
    offers.forEach((offer) => offer(items));
   
    const totalPrice = items.reduce((sum, item) => sum + item.total, 0);

    return { lines: items, totalPrice };  }
}
