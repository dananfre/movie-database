import { checkImageExists } from '../modules/api.js'

export function buildCard(movie, elementId) {
    let cardContainerRef = document.querySelector(`#${elementId}`)
    
    let newCardRef = document.createElement("div")
    newCardRef.classList.add("movie-card")

    let favoriteIconRef = document.createElement("div");
    favoriteIconRef.classList.add("movie-favorite");
    favoriteIconRef.id = movie.imdbID
    let starRef = document.createElement("img")
    starRef.src = 'res/icons/starempty.svg'
    starRef.alt = "favorite-star-empty"
    favoriteIconRef.appendChild(starRef)
    
    let moviePosterRef = document.createElement("img");

    checkImageExists(movie.Poster)
        .then((exists) => {
            moviePosterRef.src = exists ? movie.Poster : "res/icons/missing-poster.svg";
        })
        .catch(() => {
            moviePosterRef.src = "res/icons/missing-poster.svg";
        });
    
    moviePosterRef.alt = `Poster: ${movie.Title}`;
    moviePosterRef.classList.add("movie-poster");

    let movieTitleRef = document.createElement("p");
    movieTitleRef.textContent = movie.Title;
    movieTitleRef.id = movie.imdbID
    movieTitleRef.classList.add("movie-title");

    newCardRef.appendChild(favoriteIconRef);
    newCardRef.appendChild(moviePosterRef);
    newCardRef.appendChild(movieTitleRef);

    cardContainerRef.appendChild(newCardRef);  
}

export function buildMovieInfo(movie) {
    let movieInfoRef = document.querySelector(".movie-info__wrapper")

    movieInfoRef.innerHTML = `
    <article class="movie-info">
        <div class="movie-info__head">
            <div class="movie-info__title">
                <h2>${movie.Title}</h2>
            </div>
            <div class="movie-info__fav" id="${movie.imdbID}">
                <img src='res/icons/starempty.svg' id="favIcon" alt="favorite-star-empty">
            </div>
        </div>
        <article class="movie-info__about">
            <div class="movie-info__poster">
                <img src="${movie.Poster}" alt="${movie.Title}">
            </div>
            <div class="movie-info__details">
                <div class="movie-info__misc">
                    <p><strong>IMDb Rated:</strong> ${movie.Rated}</p>    
                    <p><strong>Genre:</strong> ${movie.Genre}</p>
                    <p><strong>Runtime:</strong> ${movie.Runtime}</p>
                    <p><strong>Released:</strong> ${movie.Released}</p>
                    <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
                </div>
                <div class="movie-info__plot">
                    <h3>Plot</h3>
                    <p>${movie.Plot}</p>
                </div>
                <div class="movie-info__people">
                    <div class="movie-info__director">
                        <p><strong>Director:</strong></p>
                        <p>${movie.Director}</p>
                    </div>
                    <div class="movie-info__writer">
                        <p><strong>Writer:</strong></p>
                        <p>${movie.Writer}</p>
                    </div>
                    <div class="movie-info__actors">
                        <p><strong>Actors:</strong></p>
                        <p>${movie.Actors}</p>
                    </div>
                </div>
            </div>
        </article>
    </article>
    `
}