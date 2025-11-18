import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "shortener";
const COLLECTION_NAME = "urls";

export async function POST(req: NextRequest) {
    try {
        const { alias, url } = await req.json();

        if (!alias || !url) {
            return NextResponse.json(
                { error: "You must input an Alias AND a URL." },
                { status: 400 }
            );
        }

        try {
            new URL(url);
        } catch {
            return NextResponse.json(
                { error: "Invalid URL." },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const existing = await db
            .collection(COLLECTION_NAME)
            .findOne({ alias });

        if (existing) {
            return NextResponse.json(
                { error: "Alias already used." },
                { status: 409 }
            );
        }

        await db.collection(COLLECTION_NAME).insertOne({ alias, url });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (err: unknown) {
        console.error("Error in /api/create:", err);
        return NextResponse.json(
            { error: "Internal error occured." },
            { status: 500 }
        );
    }
}
