// api/new-meetup
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const handler = async(req, res) => {
    if(req.method === "POST")
    {
        const data = req.body;

        const client = await MongoClient.connect(process.env.MONGODB_URL);
        const db = client.db();

        const meetupsCollection = db.collection("meetups");

        const result = await meetupsCollection.insertOne({data});
        console.log(result);

        client.close();

        res.status(201).json({message:"Meetup Created Successfully!"})
    }
}

export default handler;