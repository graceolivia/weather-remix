import { json  } from "@remix-run/node";
import type { V2_MetaFunction, LoaderFunction  } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React, { useState } from "react";

export const meta: V2_MetaFunction = () => [{ title: "Remix Notes" }];

export let loader: LoaderFunction = async () => {
  const apiKey = process.env.WEATHER_API;

  let response1 = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=South Bend&limit=5&appid=${apiKey}`)
  let data1 = await response1.json();
  let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${data1[0].lat}&lon=${data1[0].lon}&appid=${apiKey}&units=imperial`);
  let data = await response.json();
  return json(data);

};


export default function Index(props: any) {
  const [inputValue, setInputValue] = useState<string>(""); // State for the input value
  const [submittedValue, setSubmittedValue] = useState<string | null>(null);

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior

    setSubmittedValue(inputValue); // Update the submitted value state
  };


  let data = useLoaderData();

  let weatherDescription = data.weather && data.weather[0] ? data.weather[0].description : "N/A";
  let temperature = data.main ? data.main.temp : "N/A";
  let location = data.name || "N/A";
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

          {submittedValue && <div style={{ color: "pink", fontWeight: "bold" }}>{submittedValue}</div>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter text..."
            />
            <button type="submit">Submit</button>
          </form>

            Where do you live?
            <div>
              <input type="email" name="email" id="email"
                     className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                     placeholder="Put your city here" />
            </div>

          <div>
            <h1>Weather in {location}</h1>
            <p>Description: {weatherDescription}</p>
            <p>Temperature: {temperature} F</p>
          </div>

        </div>
      </div>
    </main>
  );
}
