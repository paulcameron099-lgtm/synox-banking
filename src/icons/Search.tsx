'use client'
import React, {useState} from 'react'
import Image from 'next/image';

interface SearchResult {
    id: string;
    name: string;
    image: string;
    desc: string;
}

export default function Search() {

const [query, setQuery] = useState<string>(""); // stores user input
const [result, setResults] = useState<SearchResult[]>([]); // stores API response
const [loading, setLoading] = useState<boolean>(false) // shows loading state
const [error, setError] = useState<string>("") // stores error msg

const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // prevents form refresh
    if(!query) return; // don't search if query is empty
    setLoading(true);
    setError("");

    try {
        const response = await fetch(`https://api.example.com/search?query=${query}`);
        if(!response.ok) throw new Error("something went wrong");
        const data:SearchResult[] = await response.json(); // ensures data matches our typeScript type
        console.log("API Response:", data);
        setResults(data); // update results with API response
    } catch (error) {
        setError("failed to fetch result")
    } finally {
        setLoading(false); // stop loading
    }
}

  return (
    <div className="flex flex-col items-center p-4">
      <form action="" onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          search
        </button>
      </form>
      {loading && <p>loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="mt-4">
        {result.map((item) => (
          <li key={item.id} className="p-2 border-b">
            <h3>{item.name}</h3>
            {item.desc && <p>{item.desc}</p>}
            {item.image && (
              <Image
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded"
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
