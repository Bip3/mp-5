import UrlForm from "./components/UrlForm";

export default function Home() {
    return (
        <main className="flex flex-col items-center mt-20">
            <h1 className="text-3xl font-bold mb-5">URL Shortener</h1>
            <UrlForm />
        </main>
    );
}
