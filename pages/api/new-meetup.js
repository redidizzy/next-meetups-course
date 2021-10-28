import { MongoClient } from "mongodb"

async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body
    const client = new MongoClient(
      "mongodb://admin:admin@cluster0-shard-00-00.wa08y.mongodb.net:27017,cluster0-shard-00-01.wa08y.mongodb.net:27017,cluster0-shard-00-02.wa08y.mongodb.net:27017/meetups?ssl=true&replicaSet=atlas-p31clz-shard-0&authSource=admin&retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    await client.connect()
    const db = client.db()
    const meetupsCollection = db.collection("meetups")
    const result = await meetupsCollection.insertOne(data)

    console.log(result)

    client.close()

    res.status(201).json({
      message: "Meetup inserted !",
    })
  }
}

export default handler
