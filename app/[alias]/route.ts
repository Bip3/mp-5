import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "shortener";
const COLLECTION_NAME = "urls";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ alias: string }> }
) {
    const { alias } = await params;
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const entry = await db.collection(COLLECTION_NAME).findOne({ alias });

    if (!entry) {
        return new Response(`Alias not found: ${alias}`, { status: 404 });
    }

    const url = (entry as any).url;
    redirect(url);
}
