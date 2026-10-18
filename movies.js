
const MOVIE_API_KEY = "your_movie_API_key_here";

export async function searchMovies(title) {
    if (!MOVIE_API_KEY) {
        throw new Error("Movie API key is missing.");
    }

    const url = `https://www.omdbapi.com/?apikey=${MOVIE_API_KEY}&s=${encodeURIComponent(title)}&type=movie`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
        throw new Error("Unable to connect to the movie service.");
    }

    if (data.Response === "False") {
        throw new Error(data.Error || "No movies found. Try another title.");
    }

    return data.Search || [];
}

export async function getMovieDetails(id) {
    const url = `https://www.omdbapi.com/?apikey=${MOVIE_API_KEY}&i=${encodeURIComponent(id)}&plot=short`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.Response === "False") {
        throw new Error(data.Error || "Unable to load movie details.");
    }

    return data;
}
