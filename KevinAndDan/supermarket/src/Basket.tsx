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
        acc: Array<{
          name: string;
          price: number;
          discount: number;
          quantity: number;
          total: number;
        }>,
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
    items.forEach((item) => {
      if (item.name === "Bread" && item.quantity % 3 === 0) {
        item.discount = item.price * Math.floor(item.quantity / 3);
      } else if (
        item.name === "Eggs" &&
        items.some((x) => x.name === "Bread")
      ) {
        item.discount = item.price;
      }
      item.total = item.total - item.discount;
    });

    if (
      items.some((i) => i.name === "Sandwich") &&
      items.some((i) => i.name === "Coke") &&
      items.some((i) => i.name === "Apple")
    ) {
      const discount =
        this.products["Sandwich"] +
        this.products["Apple"] +
        this.products["Coke"] -
        4.95;
        
      items.push({
        name: "meal deal",
        discount: discount,
        price: 0,
        quantity: 1,
        total: -discount,
      });
    }

    const totalPrice = items.reduce((sum, item) => sum + item.total, 0);

    return { lines: items, totalPrice };
  }
}
