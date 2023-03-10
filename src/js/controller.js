import * as model from './model.js';
import recipeViews from './views/recipeViews.js';
import searchViews from './views/searchViews.js';
import resultsViews from './views/resultsViews.js';
import paginationViews from './views/paginationViews.js';
import bookmarksViews from './views/bookmarksViews.js';
import addRecipeViews from './views/addRecipeViews.js';
import { MODAL_CLOSE_SEC } from './config.js';

// console.log(icons); // Basically a file path to a bundled svg file
import 'core-js/stable';
import 'regenerator-runtime/runtime';

if(module.hot) {
  module.hot.accept();
}

const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);

    // return if id doesn't exist
    if(!id) return;
    recipeViews.renderSpinner();

    // 0. Update Results view
    resultsViews.update(model.getSearechResultsPage());
    bookmarksViews.update(model.state.bookmarks);
    
    // Loading Recipes
    await model.loadRecipe(id)
    
    recipeViews.render(model.state.recipe);
    // Render All Recipes 

  } catch (error) {
    recipeViews.renderError(error);
  }


};

  // Subscriber - this is the code that wants to react 
  // example itong code na control na mag rereact once na ma trigger ang event
const controlSearchResults = async function() {
  try {
    resultsViews.renderSpinner();

    // 1. Get search quest
    const query = searchViews.getQuery();
    if(!query) return;



    // 2. Load search result
    await model.loadSearchResult(query);

    // 3. Render results per page
    // resultsViews.render(model.state.search.results);
    resultsViews.render(model.getSearechResultsPage());
    

    // 4.  Render pagination button
    paginationViews.render(model.state.search);

  } catch (error) {
    console.error(error);
  }
};

const controlPagination = function (goToPage) {
  console.log(goToPage);
  resultsViews.render(model.getSearechResultsPage(goToPage));
  paginationViews.render(model.state.search);

};

const controlServings = function (newServings) {
  model.updateServing(newServings);
  // recipeViews.render(model.state.recipe);
  recipeViews.update(model.state.recipe);
};


const controlAddBookmark = function() {
  // Add remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // Update recipe view
  recipeViews.update(model.state.recipe);

  bookmarksViews.render(model.state.bookmarks);
};


const controlBookmarks = function() {
  bookmarksViews.render(model.state.bookmarks);
};

const controlAddRecipe = async function(newRecipe){
  try {
    // Loading spinner
    addRecipeViews.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    recipeViews.render(model.state.recipe);

    addRecipeViews.renderMessage();

    // Render bookmark view
    bookmarksViews.render(model.state.bookmarks);

    // Change ID in URL without reloading the page
    window.history.pushState(null, '', `#${model.state.recipe.id}`);


    setTimeout(() => {
      addRecipeViews.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.warn('ERROR:', error);
    addRecipeViews.renderError(error.message);
  }

};



// INIT function will pass the function to view js file para masunod yung 1 directional flow 
// or para hindi ma access ni view yung controller 
const init = function () {

  // LINK or Subscribe to Publisher sabi sa tutorial
  // pero ang pagkaka intindi ko dito ay ni lilink ang subscriber function 
  // dun sa publisher para dun na tawagin yung function
  // parang pinasa as argument yung funtion 
  bookmarksViews.addHandlerRender(controlBookmarks);
  recipeViews.addHandlerRender(controlRecipes);
  searchViews.addHandlerSearch(controlSearchResults);
  paginationViews.addHandlerClick(controlPagination);
  recipeViews.addHandlerUpdateServings(controlServings);
  recipeViews.addHandlerAddBookmark(controlAddBookmark);
  addRecipeViews.addHandlerUpload(controlAddRecipe);
};
init();


