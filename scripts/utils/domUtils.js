import { fetchFromOMDb } from '../modules/api.js'
import { buildCard } from '../components/movieCard.js'

// Puts a listener on the search input field. Moves to the search page and calls to build cards on search result.
export function setupSearchListener() {
    
    let searchFormRef = document.querySelector("#searchForm")
    let searchInputRef = document.querySelector("#searchInput")
    
    searchFormRef.addEventListener("submit", async (event) => {
        
        event.preventDefault()
        
        let searchTerm = searchInputRef.value.trim()
        
        if (searchTerm) {
            let searchedMovies = await fetchFromOMDb(searchTerm)
                
            if(Array.isArray(searchedMovies) && searchedMovies.length > 0){    
                localStorage.setItem("searchedMovies", JSON.stringify(searchedMovies))
                window.location.href = "search.html"
                buildNumberOfCards(searchedMovies, searchedMovies.length)
            }          
        } 
    })
}

// Calls to build a given number of cards
export function buildNumberOfCards(movies, numberOfMovies){
    
    for (let i = 0; i < numberOfMovies; i++) {
        buildCard(movies[i], `cardCont`)
    }
}

// On movie title click, save imdbid for that movie in localStorage and go to movie.html
export function goToMovie() {
    
    let cardsRef = document.querySelectorAll("#cardCont .movie-title")   
    
    cardsRef.forEach((card) => {
        card.addEventListener("click", (event) => {
            let movieId = event.currentTarget.id;
            localStorage.setItem("selectedMovieId", movieId)
            window.location.href = `movie.html`
        });
    });
}

// Updates star icon if the movie is stored as a favorite or not in localStorage. Also updates the favorite list.
export function favoriteListener(starClass) {
    let favorites = JSON.parse(localStorage.getItem("favoriteMovies")) || []
    let starRefs = document.querySelectorAll(starClass)
    let favLogoRef = document.querySelector(".fav__logo")

    starRefs.forEach((star) => {
        let movieId = star.id;
        let starTypeRef = star.querySelector("img");   
        
        if (favorites.includes(movieId)) {
            starTypeRef.src = 'res/icons/starfilled.svg';
        }
        
        star.addEventListener("click", () => {
            if (starTypeRef.src.includes('starempty.svg')) {
                starTypeRef.src = 'res/icons/starfilled.svg';
                starTypeRef.alt = "favorite-star-filled"
                if (!favorites.includes(movieId)) {
                    favorites.push(movieId);
                }
            } else {
                starTypeRef.src = 'res/icons/starempty.svg';
                favorites = favorites.filter(id => id !== movieId);
            }
            
            localStorage.setItem("favoriteMovies", JSON.stringify(favorites));
            
            if (!window.location.href.includes(`favorites.html`)) {
                favLogoRef.classList.add("fav-logo-lit");
            
                setTimeout(() => {
                favLogoRef.classList.remove("fav-logo-lit");
                }, 1000);

            } else {
                favLogoRef.classList.remove("fav-logo-lit");
            
                setTimeout(() => {
                favLogoRef.classList.add("fav-logo-lit");
                }, 1000);
            }

        });
    });
}

// Creates an error message
export function errorMessage(errorMessage, errorText) {
    
    let errorContainerRef = document.createElement("div")
    errorContainerRef.classList.add("error-message") 
    
    let errorTitleRef = document.createElement("h2");
    errorTitleRef.textContent = errorMessage;
    
    let errorTextRef = document.createElement("p");
    errorTextRef.textContent = errorText;
    
    errorContainerRef.appendChild(errorTitleRef);
    errorContainerRef.appendChild(errorTextRef);
    
    let headerRef = document.querySelector(".header");
    if (headerRef) {
        headerRef.after(errorContainerRef);
    } else {
        document.body.prepend(errorContainerRef);
    }

}