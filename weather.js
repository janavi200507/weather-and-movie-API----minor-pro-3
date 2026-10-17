
const WEATHER_API_KEY = "704460777b112ef1269c262107e89f10";

export async function getWeather(city) {
    if (!WEATHER_API_KEY) {
        throw new Error("Weather API key is missing.");
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("City not found. Enter a valid city name.");
        }

        if (response.status === 401) {
            throw new Error("Invalid API key or key not activated yet.");
        }

        throw new Error(data.message || "Unable to fetch weather.");
    }

    const {
        name,
        main: { temp, feels_like, humidity },
        weather,
        wind: { speed }
    } = data;

    return {
        name,
        temp,
        feels_like,
        humidity,
        description: weather[0].description,
        icon: weather[0].icon,
        speed
    };
}
