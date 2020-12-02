'use strict';

let id;

const videoSearchURL = 'https://www.googleapis.com/youtube/v3/search';

const videoApiKey = 'AIzaSyBKL_QU5ywZC8PIVKkZeAXXdZt85Fa93BU'; 

const recipeSearchURL = 'https://api.spoonacular.com/recipes/complexSearch';

const recipeApiKey = 'e5ca2fbc6e1c4e07ac209c9b8b0a7ad0';



function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(key => 
    `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function getFitnessChoice(query, maxResults=3) {

  const params = {
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults,
    key: videoApiKey
  };

  const queryString = formatQueryParams(params)
  const url = videoSearchURL + '?' + queryString;
  console.log(url);
  
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayExerciseResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function displayExerciseResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('.exerciseResults').empty();
  for (let i = 0; i < responseJson.items.length; i++) {
    $('.exerciseResults').append(
      `<h3>Today's Featured Exercise:</h3>
        <li>
          <a href="https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}"><h3>${responseJson.items[i].snippet.title}</h3></a><br>
          <a href="https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}"><img class="thumbPic" src="${responseJson.items[i].snippet.thumbnails.medium.url}"></a><br>
          <p>${responseJson.items[i].snippet.description}</p><br>
        </li>
      `
    );
  };
  //display the results section  
  $('.exercise').removeClass('hidden');
}

function getDietChoice(query, resultCount=10) {

  const params = {
    apiKey: recipeApiKey,
    resultCount,
    query: query
  };

  const queryString = formatQueryParams(params)
  const url = recipeSearchURL + '?' + queryString;
  console.log(url);
  
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayDietResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function displayDietResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('.dietResults').empty();

  // iterate through the items array
  for (let i = 0; i < responseJson.results.length; i++) {
    let recipeId = responseJson.results[i].id;
    console.log(recipeId);
    getRecipe(recipeId)
    .then(response => {
      if (response.ok) {
        console.log('about to return JSON response');
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(recipe => {
      console.log('creating result')
      $('.dietResults').append(
        `
        <h3>Todays Featured Meal:</h3>
          <li>
            <h3>${responseJson.results[i].title}</h3><br>
            <img class="foodPic" src="${responseJson.results[i].image}"><br><br>
            <a href="${recipe.sourceUrl}" target="_blank">>>View Your Recipe Here!<<</a><br>
          </li>
        `
      );
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    })
  }
  $('.diet').removeClass('hidden');
} 

function getRecipe(recipeId) {

  console.log('its working');

  let recipeDetails = 'https://api.spoonacular.com/recipes/' + recipeId + '/information?apiKey=' + recipeApiKey;
  
  return fetch(recipeDetails);

}

// Listeners

function watchExerciseForm(responseJson) {
  $('#exerciseForm').submit(e => {
    e.preventDefault();
    const exercise = $('#exerciseType').val();
    getFitnessChoice(exercise);
    console.log(responseJson);
  });
}

function watchDietForm(responseJson) {
  $('#dietForm').submit(e => {
    e.preventDefault();
    const diet = $('#dietType').val();
    getDietChoice(diet);
    console.log(responseJson);
  });
}

$(watchExerciseForm);
$(watchDietForm);
