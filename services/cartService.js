class CartService {
  price;
  baseSaucesPrices;
  baseSizesPrices;
  baseIngredientsPrices;
  selectedPizzas;
  constructor() {
    this.price = 0;
    this.selectedPizzas = [];
  }

  fetchAllData = () => {
    const promsedSizesPrices = this.fetchBaseSizesPrices(
      '../datas/sizePrices.json'
    );
    const promisedIngredientsPrices = this.fetchBaseIngredientsPrices(
      '../datas/ingredientsPrices.json'
    );
    const promisedSaucesPrices = this.fetchBaseSaucesPrices(
      '../datas/saucesPrices.json'
    );
    return Promise.all([
      promisedIngredientsPrices,
      promisedSaucesPrices,
      promsedSizesPrices
    ]);
  };

  getPrice = () => {
    return this.price;
  };

  pushSelectedPizza = pizza => {
    this.selectedPizzas.push(pizza);
  };

  deleteSelectedPizza = nameAndSize => {
    // this.selectedPizzas = this.selectedPizzas.filter(
    //  ({ name, size }) => name + ' ' + size !== nameAndSize
    //);
    let found = false;
    this.selectedPizzas = this.selectedPizzas.reduce(
      (selectedPizzasAccumulator, pizza) => {
        if (nameAndSize !== pizza.name + ' ' + pizza.size || found) {
          selectedPizzasAccumulator.push(pizza);
        } else {
          found = true;
        }
        return selectedPizzasAccumulator;
      },
      []
    );
  };

  getSelectedPizzas = () => {
    return this.selectedPizzas;
  };

  fetchBaseSaucesPrices = file => {
    return fetch(file)
      .then(sauces => sauces.json())
      .then(baseSaucesPrices => (this.baseSaucesPrices = baseSaucesPrices));
  };

  fetchBaseSizesPrices = file => {
    return fetch(file)
      .then(sauces => sauces.json())
      .then(baseSizesPrices => (this.baseSizesPrices = baseSizesPrices));
  };

  fetchBaseIngredientsPrices = file => {
    return fetch(file)
      .then(sauces => sauces.json())
      .then(
        baseIngredientsPrices =>
          (this.baseIngredientsPrices = baseIngredientsPrices)
      );
  };

  calculatePizzaPrice = ({ _, size, sauce, ingredients }) => {
    let price = parseFloat(this.baseSizesPrices[size]['price']);
    const sizeMultiplier = parseFloat(this.baseSizesPrices[size]['multiplier']);
    price += sauce ? this.baseSaucesPrices[sauce] * sizeMultiplier : 0;
    price +=
      ingredients.reduce((ingredientsTotal, ingredient) => {
        ingredientsTotal += parseFloat(this.baseIngredientsPrices[ingredient]);
        return ingredientsTotal;
      }, 0.0) * sizeMultiplier;
    price = price.toFixed(2);
    return price;
  };

  calculateTotalPrice = () => {
    let total = this.selectedPizzas.reduce((totalPrice, pizza) => {
      totalPrice += parseFloat(this.calculatePizzaPrice(pizza));
      return totalPrice;
    }, 0.0);
    console.log(total);
    total = total.toFixed(2);
    return total;
  };

  getBaseSizesPrices = () => {
    return this.baseSizesPrices;
  };
  getBaseIngredientsPrices = () => {
    return this.baseIngredientsPrices;
  };
  getBaseSaucesPrices = () => {
    return this.baseSaucesPrices;
  };
}
