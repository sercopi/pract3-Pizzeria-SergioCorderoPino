class Preconf {
  getSelectedPizzas;
  pushSelectedPizza;
  calculatePizzaPrice;
  defaultPizzas;
  images;
  constructor() {}

  DOM = {
    container: document.getElementById('preconfigurates')
  };

  bindPushSelectedPizza = handler => {
    this.pushSelectedPizza = handler;
  };

  bindCalculatePizzaPrice = handler => {
    this.calculatePizzaPrice = handler;
  };

  fetchAllData = () => {
    const defaultPizzas = this.fetchDefaultPizzas(
      '../datas/defaultPizzas.json'
    );
    const defaultImages = this.fetchImages('../datas/images.json');
    return Promise.all([defaultImages, defaultPizzas]);
  };

  fetchDefaultPizzas(pizzasFile) {
    return fetch(pizzasFile)
      .then(pizzas => pizzas.json())
      .then(pizzas => {
        this.defaultPizzas = pizzas.map(
          ({ name, base, sauce, ingredients }) =>
            new Pizza(name, base, sauce, ingredients)
        );
      });
  }

  fetchImages = file => {
    return fetch(file)
      .then(images => images.json())
      .then(images => (this.images = images));
  };

  fillDefaultPizzas = pizzas => {
    pizzas.reduce((defaultPizzasContainer, pizza) => {
      const pizzaContainer = document.createElement('div');
      pizzaContainer.setAttribute('id', pizza.name);
      pizzaContainer.setAttribute('class', 'pizzaContainer');
      const title = document.createElement('h2');
      const titleContent = document.createTextNode(pizza.name);
      title.appendChild(titleContent);
      pizzaContainer.appendChild(title);
      const image = document.createElement('img');
      image.setAttribute('alt', '');
      image.setAttribute('src', this.images['pizza']);
      pizzaContainer.appendChild(image);
      pizzaContainer.appendChild(this.createIngredientsList(pizza.ingredients));
      this.createButtons(pizza).forEach(button =>
        pizzaContainer.appendChild(button)
      );
      defaultPizzasContainer.appendChild(pizzaContainer);
      return defaultPizzasContainer;
    }, this.DOM.container);
  };

  createIngredientsList = ingredients => {
    const list = document.createElement('ul');
    return ingredients.reduce((listAccumulator, ingredient) => {
      const listElement = document.createElement('li');
      const listElmentText = document.createTextNode(ingredient);
      listElement.appendChild(listElmentText);
      listAccumulator.appendChild(listElement);
      return listAccumulator;
    }, list);
  };

  createButtons = pizza => {
    const butSmall = this.createButton('small', pizza);
    const butNormal = this.createButton('normal', pizza);
    const butFamiliar = this.createButton('familiar', pizza);
    return [butSmall, butNormal, butFamiliar];
  };

  createButton = (type, pizza) => {
    const button = document.createElement('input');
    button.setAttribute('type', 'button');
    button.setAttribute(
      'value',
      type + ' (' + this.calculatePizzaPrice(pizza) + ' $)'
    );
    button.addEventListener('click', () => {
      this.addSizedPizza(pizza, type);
    });
    return button;
  };

  addSizedPizza = (pizza, size) => {
    pizza.setSize(size);
    console.log(this.pushSelectedPizza);
    this.pushSelectedPizza({ ...pizza });
    //this.updateCart();
  };
}
