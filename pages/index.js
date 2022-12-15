import Head from 'next/head'
import MeetupList from '../components/meetups/MeetupList'
import { MongoClient } from 'mongodb'

const HomePage = (props) => {
    return (
        <>
            <Head>
                <title>React Meetups</title>
                <meta name="description" content="Browse a huge list of highly active React Meetups" />
            </Head>
            <MeetupList meetups={props.meetups} />
        </>
    )
}
// export async function getServerSideProps (context) {
//     const req = context.req
//     const res = context.res
//     // return data from api
//     return {
//         props: {
//             meetups: DUMMY_MEETUPS
//         }
//     }
// }
export async function getStaticProps () {
    // return data from api
    const client = await MongoClient.connect('mongodb+srv://moatadilDweikat:1FdCRvdRq5Pn4V6o@cluster0.ieudq.mongodb.net/meetups?retryWrites=true&w=majority')
    const db = client.db()
    const meetupsCollection = db.collection('meetups')
    const meetups = await meetupsCollection.find().toArray()
    client.close()
    return {
        props: {
            meetups: meetups.map(meetup => ({
                title: meetup.title,
                address: meetup.address,
                image: meetup.image,
                id: meetup._id.toString()
            }))
        },
        revalidate: 1
    }
}
export default HomePage