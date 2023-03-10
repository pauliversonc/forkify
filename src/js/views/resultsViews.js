import View from "./View.js";
import icons from "url:../../img/icons.svg" // Parcel 2
import previewViews from "./previewViews.js";

class ResultsView extends View{
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipes found for your query! Please try again`;
  _message = `Just a regular message!`;

  _generateMarkup() {
    return this._data.map(result => previewViews.render(result, false)).join('');
  };



};

export default new ResultsView();