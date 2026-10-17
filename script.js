
import { getWeather } from "./weather.js";
import { searchMovies, getMovieDetails } from "./movies.js";

const weatherForm = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const weatherResult = document.getElementById("weather-result");
const weatherMessage = document.getElementById("weather-message");

const movieForm = document.getElementById("movie-form");
const movieInput = document.getElementById("movie-input");
const movieResult = document.getElementById("movie-result");
const movieMessage = document.getElementById("movie-message");

weatherForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        weatherMessage.textContent = "Please enter a city name.";
        return;
    }

    weatherForm.querySelector("button").disabled = true;
    weatherMessage.textContent = "Loading weather...";
    weatherResult.replaceChildren();

    try {
        const weather = await getWeather(city);

        weatherResult.innerHTML = `
            <div class="weather-card">
                <h3>${weather.name}</h3>
                <img
                    src="https://openweathermap.org/img/wn/${weather.icon}@2x.png"
                    alt="${weather.description}"
                >
                <p class="temperature">${weather.temp}°C</p>
                <p>${weather.description}</p>

                <div class="weather-details">
                    <p>
                        <strong>Feels Like</strong><br>
                        ${weather.feels_like}°C
                    </p>
                    <p>
                        <strong>Humidity</strong><br>
                        ${weather.humidity}%
                    </p>
                    <p>
                        <strong>Wind Speed</strong><br>
                        ${weather.speed} m/s
                    </p>
                </div>
            </div>
        `;

        weatherMessage.textContent = "";
    } catch (error) {
        weatherMessage.textContent = error.message;
    } finally {
        weatherForm.querySelector("button").disabled = false;
    }
});

movieForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = movieInput.value.trim();

    if (!title) {
        movieMessage.textContent = "Please enter a movie title.";
        return;
    }

    movieForm.querySelector("button").disabled = true;
    movieMessage.textContent = "Searching movies...";
    movieResult.replaceChildren();

    try {
        const movies = await searchMovies(title);

        movieMessage.textContent =
            `${movies.length} movie result(s) found.`;

        movies.forEach((movie) => {
            const card = document.createElement("article");
            card.className = "movie-card";

            const poster = document.createElement("img");
            poster.className = "movie-poster";
            poster.alt = `${movie.Title} poster`;
            poster.loading = "lazy";

            if (movie.Poster && movie.Poster !== "N/A") {
                poster.src = movie.Poster;
            } else {
                poster.alt = "Poster unavailable";
            }

            const info = document.createElement("div");
            info.className = "movie-info";

            const heading = document.createElement("h3");
            heading.textContent = movie.Title;

            const year = document.createElement("p");
            year.textContent = `Release Year: ${movie.Year}`;

            const type = document.createElement("p");
            type.textContent = `Type: ${movie.Type}`;

            const detailsButton = document.createElement("button");
            detailsButton.textContent = "View Details";

            const details = document.createElement("div");

            detailsButton.addEventListener("click", async () => {
                detailsButton.disabled = true;
                details.textContent = "Loading details...";

                try {
                    const fullMovie = await getMovieDetails(movie.imdbID);

                    details.textContent =
                        `IMDb Rating: ${fullMovie.imdbRating || "N/A"} | ` +
                        `Runtime: ${fullMovie.Runtime || "N/A"} | ` +
                        `Genre: ${fullMovie.Genre || "N/A"}`;
                } catch (error) {
                    details.textContent = error.message;
                } finally {
                    detailsButton.disabled = false;
                }
            });

            info.append(heading, year, type, detailsButton, details);
            card.append(poster, info);
            movieResult.appendChild(card);
        });

    } catch (error) {
        movieMessage.textContent = error.message;
    } finally {
        movieForm.querySelector("button").disabled = false;
    }
});
