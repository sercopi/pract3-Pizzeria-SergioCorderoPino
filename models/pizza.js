class Pizza {
  name;
  size;
  sauce;
  ingredients;
  constructor(name, size = null, sauce = null, ingredients = []) {
    this.name = name;
    this.size = size;
    this.sauce = sauce;
    this.ingredients = ingredients;
  }

  setSauce = sauce => {
    this.sauce = sauce;
  };

  getSize = () => {
    this.size = size;
  };

  setSize = size => {
    this.size = size;
  };

  addIngredient = ingredient => {
    this.ingredients.push(ingredient);
  };

  hasIngredient = ({ name }) => {
    return this.ingredients.some(setIngredient => setIngredient.name === name);
  };

  removeIngredient = ingredient => {
    this.ingredients = this.ingredients.filter(
      _ingredient => _ingredient !== ingredient
    );
  };
}
