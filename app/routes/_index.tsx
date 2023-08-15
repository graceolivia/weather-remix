import { json, redirect } from "@remix-run/node";
import type { V2_MetaFunction, LoaderFunction  } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: V2_MetaFunction = () => [{ title: "Remix Notes" }];

// Action to get coordinates based on city name
export let action: LoaderFunction = async ({request}) => {
  let formData = new URLSearchParams(await request.text());
  let city = formData.get("city");

  let geoApiKey = "YOUR_GEO_API_KEY";
  let geoResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${geoApiKey}`);
  let geoData = await geoResponse.json();

  if (geoData.status !== "OK") {
    return redirect("/?error=Failed to fetch location data");
  }

  let { lat, lng } = geoData.results[0].geometry.location;

  // Redirect to the same page with lat and lng as query parameters
  return redirect(`/?lat=${lat}&lng=${lng}`);
};


export let loader: LoaderFunction = async ({request}) => {
  let url = new URL(request.url);
  let lat = url.searchParams.get("lat");
  let lng = url.searchParams.get("lng");

  if (!lat || !lng) {
    return json({});
  }

  const apiKey = process.env.WEATHER_API;
  let weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}`);
  let weatherData = await weatherResponse.json();

  return json(weatherData);
};

export default function Index(props: any) {

  let data = useLoaderData();

  let weatherDescription = data.weather && data.weather[0] ? data.weather[0].description : "N/A";
  let temperature = data.main ? data.main.temp : "N/A";
  let location = data.name || "N/A";


  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

          Where do you live?
          <form method="post">
            <input type="text" name="city" placeholder="Put your city here"
                   className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                   placeholder="Enter city name" />
            <button type="submit">Get Weather</button>
          </form>


          {location !== "N/A" && (
            <div>
              <h1>Weather in {location}</h1>
              <p>Description: {weatherDescription}</p>
              <p>Temperature: {temperature}K</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
