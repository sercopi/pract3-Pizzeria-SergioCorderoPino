class Custom {
  customPizza;
  customPizzaCounter;
  calculatePizzaPrice;
  pushSelectedPizza;
  constructor() {
    this.customPizzaCounter = 1;
  }

  DOM = {
    content: document.getElementById('custom'),
    selectSauces: document.getElementById('selectSauces'),
    selectSizes: document.getElementById('selectSizes'),
    sizesText: document.getElementById('sizesText'),
    selectIngredients: document.getElementById('selectIngredients'),
    ingredientsInfo: document.getElementById('ingredientsInfo'),
    saucesInfo: document.getElementById('saucesText'),
    customPrice: document.getElementById('customPrice'),
    buttonAdd: document.getElementById('buttonAdd'),
    ingredientsTable: document.getElementById('ingredients')
  };

  initCustom = () => {
    this.createOptionsSizes();
    this.createIngredientsTable();
    this.createOptionsSauces();
    this.customPizza = new Pizza('custom ' + this.customPizzaCounter);
  };

  resetCustomMenu = () => {
    this.DOM.customPrice.innerHTML = '';
    this.DOM.ingredientsTable.hidden = true;
    this.DOM.ingredientsInfo.innerHTML = '';
    this.DOM.selectSauces.hidden = true;
    this.DOM.selectSauces.innerHTML = '';
    this.DOM.selectSizes.innerHTML = '';
    this.DOM.sizesText.innerHTML = '';
    this.DOM.saucesInfo.innerHTML = '';
  };

  bindGetBaseElementsPrices = handler => {
    this.getBaseElementsPrices = handler;
  };

  bindCalculatePizzaPrice = handler => {
    this.calculatePizzaPrice = handler;
  };

  bindPushSelectedPizza = handler => {
    this.pushSelectedPizza = handler;
  };

  createOptionsSizes = () => {
    const optionDefault = document.createElement('option');
    optionDefault.textContent = 'choose a size';
    optionDefault.setAttribute('selected', true);
    optionDefault.setAttribute('disabled', true);
    this.DOM.selectSizes.appendChild(optionDefault);
    Object.entries(this.getBaseElementsPrices('sizes')()).reduce(
      (selectOutput, [key, { price, multiplier }]) => {
        const option = document.createElement('option');
        option.textContent = key;
        option.setAttribute('value', key);
        option.addEventListener('click', () => {
          this.DOM.sizesText.innerHTML =
            key +
            ' selected, it costs: ' +
            price +
            ' from base and an additional ' +
            multiplier +
            ' multiplier for each ingredient and sauce!';
          this.selectedSize = key;
          this.createIngredientsTable();
          this.customPizza = new Pizza(
            'custom ' + this.customPizzaCounter,
            key
          );
          console.log(this.customPizza);
          if (!this.DOM.selectSauces.hidden) {
            this.customPizza.setSauce(this.DOM.selectSauces.value);
          }
          this.DOM.customPrice.innerHTML =
            '<h3>price: ' +
            this.calculatePizzaPrice(this.customPizza) +
            '</h3>';
          this.DOM.selectSauces.hidden = false;
        });
        selectOutput.appendChild(option);
        return selectOutput;
      },
      this.DOM.selectSizes
    );
  };

  createOptionsSauces = () => {
    const optionDefault = document.createElement('option');
    optionDefault.textContent = 'choose a sauce';
    optionDefault.setAttribute('selected', true);
    optionDefault.setAttribute('disabled', true);
    this.DOM.selectSauces.appendChild(optionDefault);
    Object.entries(this.getBaseElementsPrices('sauces')()).reduce(
      (selectOutput, [sauce, price]) => {
        const option = document.createElement('option');
        option.textContent = sauce;
        option.value = sauce;
        option.addEventListener('click', event => {
          this.DOM.saucesInfo.innerHTML = '';
          this.DOM.saucesInfo.textContent =
            sauce + ' selected, it costs: ' + price;
          this.customPizza.setSauce(sauce);
          console.log(this.customPizza);
          this.DOM.customPrice.innerHTML =
            '<h3>price: ' +
            this.calculatePizzaPrice(this.customPizza) +
            '</h3>';
          this.DOM.ingredientsTable.hidden = false;
          this.DOM.buttonAdd.hidden = false;
        });
        selectOutput.appendChild(option);
        return selectOutput;
      },
      this.DOM.selectSauces
    );
  };

  createIngredientsTable = () => {
    this.DOM.ingredientsInfo.innerHTML = '';
    Object.entries(this.getBaseElementsPrices('ingredients')()).reduce(
      (ingredientsInfoAccumulator, [ingredient, price]) => {
        console.log(ingredient + ' ' + price);
        const tr = document.createElement('tr');
        const name = document.createElement('td');
        name.textContent = ingredient;
        const ingredientPrice = document.createElement('td');
        ingredientPrice.textContent = price;
        const multiplier = document.createElement('td');
        const finalPrice = document.createElement('td');
        if (this.selectedSize) {
          const multiplierNumber = this.getBaseElementsPrices('sizes')()[
            this.selectedSize
          ]['multiplier'];
          multiplier.textContent = multiplierNumber;
          finalPrice.textContent = (
            parseFloat(price) * parseFloat(multiplierNumber)
          ).toFixed(2);
        } else {
          multiplier.textContent = '--';
          finalPrice.textContent = price;
        }
        const addRemove = document.createElement('td');
        const add = document.createElement('input');
        add.setAttribute('id', 'add' + ingredient);
        add.setAttribute('type', 'button');
        add.setAttribute('value', 'add');
        add.setAttribute('class', 'none');
        add.addEventListener('click', event => {
          this.customPizza.addIngredient(ingredient);
          event.target.disabled = true;
          event.target.className = 'disabledButton';
          document.getElementById('remove' + ingredient).disabled = false;
          document.getElementById('remove' + ingredient).className = '';
          this.DOM.customPrice.innerHTML =
            '<h3>price: ' +
            this.calculatePizzaPrice(this.customPizza) +
            '</h3>';
        });
        const remove = document.createElement('input');
        remove.setAttribute('id', 'remove' + ingredient);
        remove.setAttribute('value', 'remove');
        remove.setAttribute('disabled', true);
        remove.setAttribute('type', 'button');
        remove.setAttribute('class', 'disabledButton');
        remove.addEventListener('click', event => {
          this.customPizza.removeIngredient(ingredient);
          event.target.disabled = true;
          event.target.className = 'disabledButton';
          document.getElementById('add' + ingredient).disabled = false;
          document.getElementById('add' + ingredient).className = '';
          this.DOM.customPrice.innerHTML =
            '<h3>price: ' +
            this.calculatePizzaPrice(this.customPizza) +
            '</h3>';
        });
        addRemove.appendChild(add);
        addRemove.appendChild(remove);
        tr.appendChild(name);
        tr.appendChild(ingredientPrice);
        tr.appendChild(multiplier);
        tr.appendChild(finalPrice);
        tr.appendChild(addRemove);
        ingredientsInfoAccumulator.appendChild(tr);
        return ingredientsInfoAccumulator;
      },
      this.DOM.ingredientsInfo
    );
  };

  bindAddCustomizedPizza = () => {
    this.DOM.buttonAdd.addEventListener('click', event => {
      this.pushSelectedPizza(this.customPizza);
      this.customPizzaCounter++;
      this.resetCustomMenu();
      this.initCustom();
      event.target.hidden = true;
    });
  };
}
