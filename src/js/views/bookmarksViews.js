import View from "./View.js";
import icons from "url:../../img/icons.svg" // Parcel 2
import previewViews from "./previewViews.js";


class BookmarksView extends View{
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yes! Find a nice recipe and bookmark it`;
  _message = `Just a regular message!`;

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  };

  _generateMarkup() {
    return this._data.map(bookmark => previewViews.render(bookmark, false)).join('');
  };



};

export default new BookmarksView();