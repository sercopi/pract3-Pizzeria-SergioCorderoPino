class Controller {
  basePrices;
  constructor(preconfView, cartView, customView, cartService) {
    this.preconfView = preconfView;
    this.cartView = cartView;
    this.cartService = cartService;
    this.customView = customView;
    this.basePrices = {};
    this.cartService.fetchAllData().then(() => {
      this.asignBasePricesFunctions();
      this.customView.bindGetBaseElementsPrices(
        this.handlerGetBaseElementsPrices
      );
      this.customView.initCustom();
    });
    this.preconfView.fetchAllData().then(() => {
      this.preconfView.fillDefaultPizzas(preconfView.defaultPizzas);
    });
    this.cartView.bindGetSelectedPizzas(this.handleGetSelectedPizzas());
    this.preconfView.bindPushSelectedPizza(this.handlerPushSelectedPizza);
    this.customView.bindPushSelectedPizza(this.handlerPushSelectedPizza);
    this.customView.bindAddCustomizedPizza();
    this.cartView.bindCalculatePizzaPrice(this.handleCalculatePizzaPrice());
    this.preconfView.bindCalculatePizzaPrice(this.handleCalculatePizzaPrice());
    this.customView.bindCalculatePizzaPrice(this.handleCalculatePizzaPrice());
    this.cartView.bindCalculateTotalPrice(this.handleCalculateTotalPrice());
    this.cartView.bindDeleteSelectedPizza(this.handleDeleteSelectedPizza());
  }

  asignBasePricesFunctions = () => {
    this.basePrices['sauces'] = this.cartService.getBaseSaucesPrices;
    this.basePrices['sizes'] = this.cartService.getBaseSizesPrices;
    this.basePrices['ingredients'] = this.cartService.getBaseIngredientsPrices;
  };
  handlerGetBaseElementsPrices = element => {
    return this.basePrices[element];
  };

  handleCalculateTotalPrice = () => {
    return this.cartService.calculateTotalPrice;
  };

  handlerPushSelectedPizza = pizza => {
    this.cartService.pushSelectedPizza(pizza);
    this.cartView.updateCart();
  };

  handleGetSelectedPizzas = () => {
    return this.cartService.getSelectedPizzas;
  };

  handleUpdateCart = () => {
    return this.cartView.updateCart;
  };

  handleCalculatePizzaPrice = () => {
    return this.cartService.calculatePizzaPrice;
  };

  handleDeleteSelectedPizza = () => {
    return this.cartService.deleteSelectedPizza;
  };
}
