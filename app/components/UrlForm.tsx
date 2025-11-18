"use client";

import { useState } from "react";

export default function UrlForm() {
    const [alias, setAlias] = useState("");
    const [url, setUrl] = useState("");
    const [createdUrl, setCreatedUrl] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setCreatedUrl("");

        try {
            const res = await fetch("/api/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ alias, url }),
            });

            // Read body ONCE
            const text = await res.text();

            let data: any;
            try {
                data = JSON.parse(text);
            } catch {
                console.error("Server returned some non json", text);
            }

            if (!res.ok) {
                setError(data.error ?? "Something went wrong.");
                return;
            }

            setCreatedUrl(`${window.location.origin}/${alias}`);
        } catch (err: any) {
            console.error(err);
            setError(err.message ?? "Unexpected error.");
        }
    };


    return (
        <div className="w-full max-w-md">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                    type="text"
                    placeholder="Alias (e.g. test)"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Og URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="border p-2 rounded"
                />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded">
                    Create Short URL
                </button>
            </form>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            {createdUrl && (
                <p className="mt-3 font-semibold">
                    Short URL:{" "}
                    <a href={createdUrl} className="underline text-blue-600">
                        {createdUrl}
                    </a>
                </p>
            )}
        </div>
    );
}
