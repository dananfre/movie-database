import { oData } from '../scripts/data/data.js'
import { fetchTopMovies, fetcSpecificFromOMDb, fetchFavoritesFromOMDb } from '../scripts/modules/api.js'
import { renderTrailers } from '../scripts/modules/caroussel.js'
import { shuffleArray } from '../scripts/utils/utils.js'
import { buildCard, buildMovieInfo } from '../scripts/components/movieCard.js'
import { setupSearchListener, buildNumberOfCards, goToMovie, favoriteListener } from '../scripts/utils/domUtils.js'

if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    
    document.addEventListener("DOMContentLoaded", () => {
        setupSearchListener();
    });

    await fetchTopMovies(); 

    let shuffledMovies = shuffleArray(oData.topMovieList)

    for (let i = 0; i < 5; i++) {
        renderTrailers(shuffledMovies[i], i + 1);         
    }

    buildNumberOfCards(shuffledMovies, shuffledMovies.length)
    
    favoriteListener(".movie-favorite")
    
    goToMovie()

} else if (window.location.pathname === '/favorites.html') {
    
    let favorites = await fetchFavoritesFromOMDb()
    
    buildNumberOfCards(favorites, favorites.length)
    
    favoriteListener(".movie-favorite")
    
    goToMovie()

} else if (window.location.pathname === '/movie.html') {
    
    let movieId = localStorage.getItem("selectedMovieId")
    
    if (movieId) {
        oData.specificMovie = await fetcSpecificFromOMDb(movieId);
        buildMovieInfo(oData.specificMovie)
    } else {
        console.log("No movie ID found in localStorage");
    }
    
    favoriteListener(".movie-info__fav")

} else if (window.location.pathname === '/search.html') {
    
    document.addEventListener("DOMContentLoaded", () => {
        setupSearchListener();
    });
    
    oData.searchedMovies = JSON.parse(localStorage.getItem("searchedMovies"))
    
    if (oData.searchedMovies) {
        oData.searchedMovies.forEach(movie => buildCard(movie, `cardCont`));
        localStorage.removeItem("searchedMovies");
    }
    
    favoriteListener(".movie-favorite")
    
    goToMovie()
}









