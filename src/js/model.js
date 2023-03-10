import {async} from 'regenerator-runtime';
// import { API_URL } from './config';
// import {getJSON, sendJSON} from '../js/helpers.js';
import {AJAX} from '../js/helpers.js';
import { RES_PER_PAGE, API_URL ,KEY } from './config.js';
// import { KEY } from './config';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function(data){
  const {recipe} = data.data;
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && {key: recipe.key}),
  }
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    // Changing variables from api
    state.recipe = createRecipeObject(data);

    if(state.bookmarks.some(bookmark => bookmark.id === id)) state.recipe.bookmarked = true;
    // if(state.bookmarks.some(bookmark => bookmark.id === id)) console.log('test');
    else state.recipe.bookmarked = false;

  } catch (error) {
    throw error;
  }
};

export const loadSearchResult = async function(query) {
  try {
    state.search.query = query;

    // https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    const {recipes} = data.data;

    state.search.results = recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && {key: rec.key}),
      };
    });

    state.search.page = 1;

  } catch (error) {
    throw error;
  }

}


export const getSearechResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  // console.log(state.search.results.resultsPerPage);
  return state.search.results.slice(start, end);
};

export const updateServing = function(newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmark = function() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function(recipe){
  state.bookmarks.push(recipe);

  if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmark();
}

export const deleteBookmark = function(id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  if(id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmark();
}

export const uploadRecipe = async function(newRecipe) {
  try {
    console.log(newRecipe)
    const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
    .map(ing => {
      // const ingArr = ing[1].replaceAll(' ', '').split(',');
      const ingArr = ing[1].split(',').map(el => el.trim());
      
      if(ingArr.length !== 3) throw new Error('Wrong Ingredients Format, Please use correct format');
      const [quantity, unit, description] = ingArr;
      
      return {quantity: quantity ? +quantity : null, unit, description};
    });

    
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    }


    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};




const init = function() {
  const storage = localStorage.getItem('bookmarks');
  if(storage) state.bookmarks = (JSON.parse(storage));
}

init();