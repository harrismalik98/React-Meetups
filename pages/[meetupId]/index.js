import dotenv from "dotenv";
dotenv.config();
import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../../components/meetups/MeetupDetail";
import Head from "next/head";

const MeetupDetails = (props) => {
    
    return(
        <>
          <Head>
            <title>{props.meetupData.title}</title>
            <meta name='description' content={props.meetupData.description}/>
          </Head>
          <MeetupDetail 
            image = {props.meetupData.image}
            title = {props.meetupData.title}
            address = {props.meetupData.address}
            description = {props.meetupData.description}
        />
        </>
        
    );
}



// If we are using getStaticPaths and our page is dynamic like this then we should use getStaticPaths
// Pages other than params m1,m2 get 404 Error.
export const getStaticPaths = async () => {

    const client = await MongoClient.connect(process.env.MONGODB_URL);
    const db = client.db();
    const meetupsCollection = db.collection("meetups");
    const meetups = await meetupsCollection.find({}, {_id:1}).toArray();

    client.close();

    return {
        fallback: 'blocking',
        paths: meetups.map(meetup => ({
            params: {
                meetupId: meetup._id.toString(),
            }
        }))
    }
}



export const getStaticProps = async(context) => {

    const meetupId = context.params.meetupId;

    const client = await MongoClient.connect(process.env.MONGODB_URL);
    const db = client.db();
    const meetupsCollection = db.collection("meetups");
    const selectedMeetup = await meetupsCollection.findOne({_id: new ObjectId(meetupId)});
    client.close();

    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.data.title,
                address: selectedMeetup.data.address,
                image: selectedMeetup.data.image,
                description: selectedMeetup.data.description,
            }
        }
    }
}

export default MeetupDetails;