class Cart {
  getSelectedPizzas;
  calculatePizzaPrice;
  calculateTotalPrice;
  constructor() {
    this.DOM.total.innerHTML = '<h2>Total: 0.00</h2>';
  }

  DOM = {
    container: document.getElementById('pizzaList'),
    total: document.getElementById('totalPrice')
  };

  bindDeleteSelectedPizza = handler => {
    this.deleteSelectedPizza = handler;
  };

  bindGetSelectedPizzas = handler => {
    this.getSelectedPizzas = handler;
  };

  updateCart = () => {
    this.DOM.total.innerHTML =
      '<h2>Total: ' + this.calculateTotalPrice() + '</h2>';
    this.DOM.container.innerHTML = '';
    this.createPizzaList();
  };

  createPizzaList = () => {
    const pizzaCount = this.pizzaCount();
    Object.entries(pizzaCount).reduce(
      (accumulatedList, [nameAndSize, { amount, price }]) => {
        const listElementCard = document.createElement('div');
        const listElementCardTitle = document.createElement('h3');
        const buttonCancel = document.createElement('input');
        buttonCancel.setAttribute('type', 'button');
        buttonCancel.setAttribute('value', 'X');
        buttonCancel.addEventListener('click', () => {
          this.deleteSelectedPizza(nameAndSize);
          this.updateCart();
        });
        listElementCardTitle.textContent = nameAndSize;
        const listElementCardContent = document.createElement('p');
        listElementCardContent.textContent = amount + ' X ' + price;
        listElementCard.appendChild(listElementCardTitle);
        listElementCard.appendChild(buttonCancel);
        listElementCard.appendChild(listElementCardContent);
        accumulatedList.appendChild(listElementCard);
        return accumulatedList;
      },
      //list
      this.DOM.container
    );
  };

  pizzaCount = () => {
    return this.getSelectedPizzas().reduce((pizzaCount, pizza) => {
      const compoundName = pizza.name + ' ' + pizza.size;
      if (pizzaCount[compoundName] === undefined) {
        pizzaCount[compoundName] = {
          amount: 0,
          price: this.calculatePizzaPrice(pizza)
        };
      }
      pizzaCount[compoundName].amount++;
      return pizzaCount;
    }, {});
  };

  bindCalculatePizzaPrice = handler => {
    this.calculatePizzaPrice = handler;
  };

  bindCalculateTotalPrice = handler => {
    this.calculateTotalPrice = handler;
  };
}
