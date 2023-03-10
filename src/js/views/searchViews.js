class SearchView {
  _parentElement = document.querySelector('.search');

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  };

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  };
  
  // Publisher - is a code knows when to react || basically nasa kanya yung event listener
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function(e){
      e.preventDefault()
      handler();
    })
  }
};

export default new SearchView();