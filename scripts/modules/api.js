import { oData } from "../data/data.js";
import { errorMessage } from "../utils/domUtils.js";

// Fetches the whole favoritemovies API
export async function fetchTopMovies() {
    try {
        let response = await fetch('https://santosnr6.github.io/Data/favoritemovies.json');
        
        if (!response.ok) {
            throw new Error(response.status)
        }
        
        let movies = await response.json();
        oData.topMovieList = movies;
        
        return oData.topMovieList 
    
    } catch (error) {
        handleApiError(error)    
    }
}

// Fetches movies from omdb, based on user search
export async function fetchFromOMDb(searchTerm) {
    try {
        let response = await fetch(`http://www.omdbapi.com/?apikey=f4578ae6&s=${searchTerm}*`);
        
        if (!response.ok) {
            throw new Error(response.status)
        }
        
        let data = await response.json();
        
        if (!data.Search || data.Search.length === 0) {
            throw new Error("The search rendered no results.")
        }
        
        return data.Search     
    
    } catch (error) {
        handleApiError(error)    
    }
}

// Fetches data on a movie based on ImdbId
export async function fetcSpecificFromOMDb(ImdbId) {
    try {
    let response = await fetch(`http://www.omdbapi.com/?apikey=f4578ae6&plot=full&i=${ImdbId}`)

    if (!response.ok) {
        throw new Error(response.status)
    }
    
    let movie = await response.json();
    
    return movie  

    } catch (error) {
        handleApiError(error)    
    }
}

// Fetches favorite movies from OMDb based on stored id
export async function fetchFavoritesFromOMDb() {
    
    try {
        oData.favoritesId = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
        oData.favorites = [];

        oData.favorites = await Promise.all(
            oData.favoritesId.map(async (id) => {
                try {
                    return await fetcSpecificFromOMDb(id);
                } catch (error) {
                    return null;
                }
            })
        );

        oData.favorites = oData.favorites.filter(movie => movie !== null);
        return oData.favorites;

    } catch (error) {
        handleApiError(error)
    }
}

export async function checkImageExists(url) {
    try {
        const response = await fetch(url, { method: "HEAD" });
        if(!response.ok) {
            throw new Error('Image does not exist');
        }
        return response.ok;
    } catch (error) {
        return false;
    }
}

function handleApiError(error) {
    
    document.querySelector(".header__logo").style.filter = "none";

    let caroussel = document.querySelector(".caroussel")
    if (caroussel) caroussel.classList.add("d-none")
        
    let recommended = document.querySelector(".recommended")
    if (recommended) recommended.classList.add("d-none")
        
    let cardContainer = document.querySelector(".card-container")
    if (cardContainer) cardContainer.classList.add("d-none")

    let movieInfo = document.querySelector(".movie-details")
    if (movieInfo) movieInfo.classList.add("d-none")

    let favoriteMovies = document.querySelector(".favorite-movies")
    if (favoriteMovies) favoriteMovies.classList.add("d-none")

    let search = document.querySelector(".search")
    if (search) search.classList.add("d-none")

    if (error.message === "The search rendered no results.") {
        errorMessage(error.message, "Try a more specific search.")
    } else {
        errorMessage(error.message, "Something went wrong in communicating with the API.")
    }
        
    return [];

}