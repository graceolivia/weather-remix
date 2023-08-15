import { json  } from "@remix-run/node";
import type { V2_MetaFunction, LoaderFunction  } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: V2_MetaFunction = () => [{ title: "Weather" }];

export let loader: LoaderFunction = async ({request})  => {
  const apiKey = process.env.WEATHER_API;
  const url = new URL(request.url);
  const userInput = url.searchParams.get("user_input");

  let response1 = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=1&appid=${apiKey}`)
  let data1 = await response1.json();
  let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${data1[0].lat}&lon=${data1[0].lon}&appid=${apiKey}&units=imperial`);
  let data = await response.json();
  console.log(data);
  return json(data);

};


export default function Index(props: any) {

  let data = useLoaderData();

  let weatherDescription = data.weather && data.weather[0] ? data.weather[0].description : "N/A";
  let temperature = data.main ? data.main.temp : "N/A";
  let location = data.name || "N/A";
  let icon = data.weather && data.weather[0] ? data.weather[0].icon : null;
  let iconUrl = icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : null;
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center bg-stone-500">
      <div className="relative sm:pb-16 sm:pt-8 bg-stone-200 rounded">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

            Where do you live?
            <div>
              <form action="/" method="get">
              <input name="user_input" id="user_input"
                     className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                     placeholder="Put your city here" />
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Get Weather</button>
              </form>
            </div>

          <div className="relative m-4 p-4 sm:pb-16 sm:pt-8 bg-stone-400 rounded">
            <h1>Weather in {location}</h1>
            {iconUrl && <img src={iconUrl} alt="Weather Icon" />}
            <p>Description: {weatherDescription}</p>
            <p>Temperature: {temperature} F</p>
          </div>

        </div>
      </div>
    </main>
  );
}
