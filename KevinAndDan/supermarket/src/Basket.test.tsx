import { Basket } from "./Basket";
const milk = { name: "Milk", price: 1.5 };
const bread = { name: "Bread", price: 3.5 };
const eggs = { name: "Eggs", price: 2.0 };
const sandwich = { name: "Sandwich", price: 4.0 };
const apple = { name: "Apple", price: 0.5 };
const coke = { name: "Coke", price: 1.0 };

function createBasketWithProducts() {
  return new Basket({
    [milk.name]: milk.price,
    [bread.name]: bread.price,
    [eggs.name]: eggs.price,
    [sandwich.name]: sandwich.price,
    [apple.name]: apple.price,
    [coke.name]: coke.price,
  });
}

test("Empty Basket returns no items and zero total price", () => {
  const basket = createBasketWithProducts();
  var receipt = basket.generateReceipt();

  expect(receipt.lines.length).toBe(0);
  expect(receipt.totalPrice).toBe(0);
});

const testItems = [milk, bread];

testItems.forEach((item) => {
  test(`Scan a single item '${item.name}' and show the correct price and total prices`, () => {
    // Arrange
    const basket = createBasketWithProducts();

    // Act
    basket.scanItem(item.name);
    var receipt = basket.generateReceipt();

    // Assert
    expect(receipt.lines).toHaveLength(1);
    expect(receipt.lines[0]).toEqual({
      name: item.name,
      price: item.price,
      discount: 0,
      quantity: 1,
      total: item.price,
    });
    expect(receipt.totalPrice).toBe(item.price);
  });
});

const testTwo = [];

test(`Scan more than item at a time and show the correct price and total prices`, () => {
  // Arrange
  const basket = createBasketWithProducts();

  // Act
  basket.scanItem(milk.name);
  basket.scanItem(milk.name);
  basket.scanItem(milk.name);
  var receipt = basket.generateReceipt();

  // Assert
  expect(receipt.lines).toHaveLength(1);
  expect(receipt.lines[0]).toEqual({
    name: milk.name,
    price: milk.price,
    discount: 0,
    quantity: 3,
    total: milk.price * 3,
  });
  expect(receipt.totalPrice).toBe(milk.price * 3);
});

test("Scan a mixture of items and show the correct price and total prices", () => {
  // Arrange
  const basket = createBasketWithProducts();

  // Act
  basket.scanItem(milk.name);
  basket.scanItem(bread.name);
  basket.scanItem(milk.name);
  var receipt = basket.generateReceipt();

  // Assert
  expect(receipt.lines).toHaveLength(2);
  expect(receipt.lines[0]).toEqual({
    name: milk.name,
    price: milk.price,
    discount: 0,
    quantity: 2,
    total: milk.price * 2,
  });
  expect(receipt.lines[1]).toEqual({
    name: bread.name,
    price: bread.price,
    discount: 0,
    quantity: 1,
    total: bread.price,
  });
  expect(receipt.totalPrice).toBe(milk.price * 2 + bread.price);
});

test("Scan two of a product and get the third one free and show the correct price and total prices", ()=>{
    const basket = createBasketWithProducts();

    // Act
    basket.scanItem(bread.name);
    basket.scanItem(bread.name);
    basket.scanItem(bread.name);
    var receipt = basket.generateReceipt();

    // Assert
    expect(receipt.lines).toHaveLength(1);
    expect(receipt.lines[0]).toEqual({
        name: bread.name,
        price: bread.price,
        discount: bread.price,
        quantity: 3,
        total: bread.price * 2,
    });
    expect(receipt.totalPrice).toBe(bread.price * 2);

})

test("If you buy one bread than you get one egg free and show the correct price and total prices", ()=>{
    const basket = createBasketWithProducts();

    // Act
    basket.scanItem(bread.name);
    basket.scanItem(eggs.name);
    var receipt = basket.generateReceipt();

    // Assert
    expect(receipt.lines).toHaveLength(2);
    expect(receipt.lines[0]).toEqual({
        name: bread.name,
        discount: 0,
        price: bread.price,
        quantity: 1,
        total: bread.price,
    });

    expect(receipt.lines[1]).toEqual({
        name: eggs.name,
        discount: eggs.price,
        price: eggs.price,
        quantity: 1,
        total: 0,
    });
    expect(receipt.totalPrice).toBe(bread.price);
})


test("If you buy a meal deal then the price and total prices are correct to £4.95", ()=>{
    const basket = createBasketWithProducts();

    // Act
    basket.scanItem(sandwich.name);
    basket.scanItem(apple.name);
    basket.scanItem(coke.name);
    var receipt = basket.generateReceipt();

    // Assert
    expect(receipt.lines).toHaveLength(4);
    expect(receipt.lines[0]).toEqual({
        name: sandwich.name,
        discount: 0,
        price: sandwich.price,
        quantity: 1,
        total: sandwich.price,
    });
    expect(receipt.lines[1]).toEqual({
        name: apple.name,
        discount: 0,
        price: apple.price,
        quantity: 1,
        total: apple.price,
    });
    expect(receipt.lines[2]).toEqual({
        name: coke.name,
        discount: 0,
        price: coke.price,
        quantity: 1,
        total: coke.price,
    });
    expect(receipt.lines[3]).toEqual({
        name: "meal deal",
        discount: (sandwich.price + apple.price + coke.price) - 4.95,
        price: 0,
        quantity: 1,
        total: -((sandwich.price + apple.price + coke.price) - 4.95),
    });
    expect(receipt.totalPrice).toBe(4.95);
})

