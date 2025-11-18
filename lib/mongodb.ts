import { MongoClient } from "mongodb";

let client;
let clientPromise: Promise<MongoClient>;
const uri = process.env.MONGO_URI as string;
if (!uri) {
    throw new Error("MongoDB URI is missing");
}

const globalForMongo = global as unknown as {
    _mongoClientPromise?: Promise<MongoClient>;
};

if (process.env.NODE_ENV === "development") {
    if (!globalForMongo._mongoClientPromise) {
        client = new MongoClient(uri);
        globalForMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalForMongo._mongoClientPromise;
} else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

export default clientPromise;
