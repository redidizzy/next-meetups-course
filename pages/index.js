import MeetupList from "../components/meetups/MeetupList"
import { MongoClient } from "mongodb"
import Head from "next/head"

function HomePage(props) {
  return (
    <>
      <Head>
        <title>React meetups</title>
        <meta name="Browse a huge list of highly active react meetups." />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  )
}

export async function getStaticProps() {
  const client = new MongoClient(
    "mongodb://admin:admin@cluster0-shard-00-00.wa08y.mongodb.net:27017,cluster0-shard-00-01.wa08y.mongodb.net:27017,cluster0-shard-00-02.wa08y.mongodb.net:27017/meetups?ssl=true&replicaSet=atlas-p31clz-shard-0&authSource=admin&retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  await client.connect()
  const db = client.db()

  const meetups = await (
    await db.collection("meetups").find().toArray()
  ).map((meetup) => ({
    title: meetup.title,
    address: meetup.address,
    image: meetup.image,
    id: meetup._id.toString(),
  }))
  await client.close()
  return {
    props: {
      meetups,
    },
    revalidate: 1,
  }
}

export default HomePage
