import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from 'mongodb';
import MeetupList from '../components/meetups/MeetupList';
import Head from 'next/head';


const HomePage = (props) => {
    return (
      <>
        <Head>
          <title>React Meetups</title>
          <meta name='description' content='Browse a huge list of highly active React Meetups!'/>
        </Head>
        <MeetupList meetups={props.meetups} />
      </> 
    );
}



// This function will run everytime for a new request on the sserver side. So, don't need to add "revalidate" here.
// export const getServerSideProps = async(context) => {
//   const req = context.req; // Requst & Response object like we get in Node.js and Express.
//   const res = context.res;

//   // fetch data from an API
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   }
// }



export const getStaticProps = async () => {

  const client = await MongoClient.connect(process.env.MONGODB_URL);
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find().toArray();
  client.close();

  // console.log(meetups);

  return {
    props: {
      meetups: meetups.map(meetup => ({
        id: meetup._id.toString(),
        title: meetup.data.title,
        image: meetup.data.image,
        address: meetup.data.address
      }))
    },
    revalidate: 1, // This property will update the pre-render page after every 1 second.
  }
}

export default HomePage;