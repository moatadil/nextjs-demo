import React from 'react'
import MeetupDetail from '../../components/meetups/MeetupDetail'
import { MongoClient, ObjectId } from 'mongodb'
import Head from 'next/head'

const MeetupDetails = ({ meetupData }) => {
    return (
        <>
            <Head>
                <title>{meetupData.title}</title>
                <meta name="description" content={meetupData.description} />
            </Head>
            <MeetupDetail
                image={meetupData.image}
                title={meetupData.title}
                description={meetupData.description}
                address={meetupData.address}
            />
        </>
    )
}
export async function getStaticPaths () {
    const client = await MongoClient.connect('mongodb+srv://moatadilDweikat:1FdCRvdRq5Pn4V6o@cluster0.ieudq.mongodb.net/meetups?retryWrites=true&w=majority')
    const db = client.db()
    const meetupsCollection = db.collection('meetups')
    const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray()
    client.close()
    return {
        fallback: false,
        paths: meetups.map(meetup => ({ params: { meetupId: meetup._id.toString() } }))
        // [
        //     {
        //         params: { meetupId: '639a48cb7da66e0915d36d87' }
        //     },
        //     {
        //         params: { meetupId: '639a49887da66e0915d36d88' }
        //     },
        // ]
    }
}
export async function getStaticProps (context) {
    const meetupId = context.params.meetupId
    const client = await MongoClient.connect('mongodb+srv://moatadilDweikat:1FdCRvdRq5Pn4V6o@cluster0.ieudq.mongodb.net/meetups?retryWrites=true&w=majority')
    const db = client.db()
    const meetupsCollection = db.collection('meetups')
    const selectedMeetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) })
    client.close()
    return {
        props: {
            meetupData: {
                id: selectedMeetup?._id.toString(),
                title: selectedMeetup.title,
                address: selectedMeetup.address,
                image: selectedMeetup.image,
                description: selectedMeetup.description
            }
        }
    }
}
export default MeetupDetails