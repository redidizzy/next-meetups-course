import MeetupDetail from "../../components/meetups/MeetupDetail"

import { MongoClient, ObjectId } from "mongodb"

import Head from "next/head"

function MeetupDetails({ meetup }) {
  return (
    <>
      <Head>
        <title>{meetup.title}</title>
      </Head>
      <MeetupDetail
        image={meetup.image}
        title={meetup.title}
        address={meetup.address}
        description={meetup.description}
      />
    </>
  )
}

export async function getStaticPaths() {
  const client = new MongoClient(
    "mongodb://admin:admin@cluster0-shard-00-00.wa08y.mongodb.net:27017,cluster0-shard-00-01.wa08y.mongodb.net:27017,cluster0-shard-00-02.wa08y.mongodb.net:27017/meetups?ssl=true&replicaSet=atlas-p31clz-shard-0&authSource=admin&retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  await client.connect()
  const db = client.db()
  const meetupsCollection = db.collection("meetups")
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray()
  console.log(
    meetups.map((meetup) => ({
      params: { meetupdId: meetup._id.toString() },
    }))
  )

  await client.close()

  return {
    fallback: "blocking",
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  }
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId
  const client = new MongoClient(
    "mongodb://admin:admin@cluster0-shard-00-00.wa08y.mongodb.net:27017,cluster0-shard-00-01.wa08y.mongodb.net:27017,cluster0-shard-00-02.wa08y.mongodb.net:27017/meetups?ssl=true&replicaSet=atlas-p31clz-shard-0&authSource=admin&retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  await client.connect()
  const db = client.db()
  const meetupsCollection = db.collection("meetups")
  const meetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) })

  return {
    props: {
      meetup: {
        ...meetup,
        id: meetup._id.toString(),
        _id: null,
      },
    },
    revalidate: 1,
  }
}

export default MeetupDetails
