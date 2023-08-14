import { json  } from "@remix-run/node";
import type { V2_MetaFunction, LoaderFunction  } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: V2_MetaFunction = () => [{ title: "Remix Notes" }];

export let loader: LoaderFunction = async () => {
  const apiKey = process.env.WEATHER_API;
  let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=40.8139&lon=73.9624&appid=${apiKey}`);
  let data = await response.json();
  console.log(data);
  return json(data);

};


export default function Index(props: any) {

  let data = useLoaderData();
  console.log("AHHHH");
  console.log(props);

  let weatherDescription = data.weather && data.weather[0] ? data.weather[0].description : "N/A";
  let temperature = data.main ? data.main.temp : "N/A";
  let location = data.name || "N/A";
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

            Where do you live?
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input type="email" name="email" id="email"
                     className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                     placeholder="Put your city here" />
            </div>

          <div>
            <h1>Weather in {location}</h1>
            <p>Description: {weatherDescription}</p>
            <p>Temperature: {temperature}K</p>
          </div>

        </div>
      </div>
    </main>
  );
}
