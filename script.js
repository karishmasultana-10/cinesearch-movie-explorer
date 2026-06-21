const API_KEY = "74a972cd";

let movieInput = document.getElementById("movie-search");
let searchBtn = document.getElementById("search-btn");
let moviesContnr = document.getElementById("movies-container");
let welcomeMessage = document.getElementById("welcomeMessage");
let latestSearchResult;

async function performSearch() {
    welcomeMessage.style.display = "none";

    const searchResult = await searchMovies();

    if (searchResult === undefined) {
        return;
    }

    latestSearchResult = searchResult;
    displayMovies(searchResult);
    movieInput.value = "";
}

searchBtn.onclick = async function (event) {
    await performSearch();
};

async function searchMovies() {
    let inputVal = movieInput.value.trim();
    let inputLwr = inputVal.toLowerCase();

    let url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${inputLwr}`;

    if (inputLwr === "") {
        alert("Enter valid name");
        return;
    }

    moviesContnr.innerHTML = "Loading...";

    let response = await fetch(url);
    let data = await response.json();

    if (data.Response === "False") {
        return [];
    }

    // console.log(data);
    // console.log(data.Search);
    // for(let i=0;i<movies.length;i++){
    //     let movieLwr=movies[i].name.toLowerCase();
    //     if(movieLwr.includes(inputLwr)){
    //         matchedmovies.push(movies[i]);
    //
    //     }
    //}

    return data.Search;
}

function displayMovies(moviesArray) {
    moviesContnr.textContent = "";
    moviesContnr.style.display = "grid";

    if (moviesArray.length === 0) {
        let notFoundHead = document.createElement("h3");
        notFoundHead.textContent = "🎬 No Movies Found";
        notFoundHead.classList.add("notFoundHead");

        let notFoundMsg = document.createElement("p");
        notFoundMsg.textContent = "Try searching with a different movie title";
        notFoundMsg.classList.add("notFoundMsg");

        moviesContnr.append(notFoundHead);
        moviesContnr.append(notFoundMsg);

        return;
    }

    for (let i = 0; i < moviesArray.length; i++) {
        let card_div = document.createElement("div");
        card_div.classList.add("movieCard");

        let title = document.createElement("h2");
        title.textContent = moviesArray[i].Title;

        let poster_img = document.createElement("img");

        if (moviesArray[i].Poster === "N/A") {
            poster_img.src = "https://placehold.co/200x300?text=No+Image";
        } else {
            poster_img.src = moviesArray[i].Poster;
        }

        poster_img.classList.add("posterImg");

        let year_p1 = document.createElement("p");
        year_p1.textContent = `Year: ${moviesArray[i].Year}`;

        let type_p2 = document.createElement("p");
        type_p2.textContent = `Type: ${moviesArray[i].Type}`;

        let IMDb_ID_p3 = document.createElement("p");
        IMDb_ID_p3.textContent = `ImgID: ${moviesArray[i].imdbID}`;

        card_div.dataset.imdbId = moviesArray[i].imdbID;

        card_div.onclick = async function (event) {
            moviesContnr.innerHTML = "<h2>Loading Movie Details...</h2>";

            let fullMovieDetails = await getMovieDetails(card_div.dataset.imdbId);

            // console.log(fullMovieDetails);

            displayMovieDetails(fullMovieDetails);
        };

        card_div.append(title);
        card_div.append(poster_img);
        card_div.append(year_p1);
        card_div.append(type_p2);

        moviesContnr.append(card_div);
    }
}

async function getMovieDetails(imdbId) {
    let movieUrl = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbId}`;

    let detailsResponse = await fetch(movieUrl);
    let movieDetails = await detailsResponse.json();

    return movieDetails;

    // console.log(movieDetails);
}

function displayMovieDetails(movieinsights) {
    document.getElementById("searchContainer").style.display = "none";

    moviesContnr.innerHTML = "";
    moviesContnr.style.display = "block";

    let backToSearch = document.createElement("button");
    backToSearch.textContent = "← Back to Results";

    let movieCard = document.createElement("div");

    let movieTitle = document.createElement("h2");
    movieTitle.textContent = movieinsights.Title;

    let movieYear = document.createElement("p");
    movieYear.textContent = `Year: ${movieinsights.Year}`;

    let movieGenre = document.createElement("p");
    movieGenre.textContent = `Genre: ${movieinsights.Genre}`;

    let movieRuntime = document.createElement("p");
    movieRuntime.textContent = `Runtime: ${movieinsights.Runtime}`;

    let movieImdbRating = document.createElement("p");
    movieImdbRating.textContent = `Rating: ${movieinsights.imdbRating}`;

    let moviePlot = document.createElement("p");
    moviePlot.textContent = `Plot: ${movieinsights.Plot}`;

    let movieDirector = document.createElement("p");
    movieDirector.textContent = `Director: ${movieinsights.Director}`;

    let movieActors = document.createElement("p");
    movieActors.textContent = `Actors: ${movieinsights.Actors}`;

    let moviePoster = document.createElement("img");

    if (movieinsights.Poster === "N/A") {
        moviePoster.src = "https://placehold.co/300x450?text=No+Image";
    } else {
        moviePoster.src = movieinsights.Poster;
    }

    let movieInfo = document.createElement("div");

    movieInfo.classList.add("movieInfo");
    movieCard.classList.add("movieDetailsCard");
    moviePoster.classList.add("movieDetailsPoster");
    backToSearch.classList.add("backBtn");

    movieInfo.append(
        movieTitle,
        movieYear,
        movieGenre,
        movieRuntime,
        movieImdbRating,
        moviePlot,
        movieDirector,
        movieActors
    );

    moviesContnr.append(backToSearch);

    movieCard.append(moviePoster, movieInfo);
    moviesContnr.append(movieCard);

    backToSearch.onclick = function (event) {
        document.getElementById("searchContainer").style.display = "flex";
        displayMovies(latestSearchResult);
    };
}

movieInput.addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
        await performSearch();
    }
});