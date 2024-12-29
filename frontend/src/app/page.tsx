import Footer from "@/components/Footer";
import Hero from "@/components/LandingPage/Hero";


import TravelBlogCard from "@/components/LandingPage/TravelBlogCard";
import {useSession} from "next-auth/react";


export default function HomePage() {


    return (
    <div >
        <Hero />
        <TravelBlogCard
            imageFirst={false}
            imageUrl={"/images/palms.jpg"}
            title="Your Ultimate Travel Planning App"
            description="Effortlessly manage every aspect of your group journey—optimize routes, find travel companions, and plan every step of the trip in one place. Whether you're traveling solo or as a group, our app helps you maximize your time, minimize hassle, and ensure a smooth experience for everyone."
        />
        <TravelBlogCard
            imageFirst={true}
            imageUrl={"/images/friends.jpg"}
            title="Find Travel Buddies and Plan Together"
            description="Discover others traveling to the same destinations or within your travel window. Connect with travelers, collaborate on plans, and make your journey more social, all while keeping the group unified and coordinated throughout."
        />
        <TravelBlogCard
            imageFirst={false}
            imageUrl={"/images/plan.jpg"}
            title="Optimize Your Travel Itinerary"
            description="Make the most of your trip by optimizing the order of places, activities, and routes. Our tool helps you coordinate every detail, ensuring a seamless experience for the whole group with minimal effort and maximum enjoyment."
        />
        <Footer />
    </div>
    )
}