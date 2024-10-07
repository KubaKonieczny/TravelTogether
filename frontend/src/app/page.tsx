import Footer from "@/components/Footer";
import Hero from "@/components/LandingPage/Hero";


import TravelBlogCard from "@/components/LandingPage/TravelBlogCard";


export default function HomePage() {

    return (
    <div >
        <Hero />
        <TravelBlogCard
            imageFirst={false}
            imageUrl={"/palms.jpg"}
            title="From short breaks to long adventures"
            description="Travel blog featuring travel tips, guides, and photography from around the world. Whether you need guidance for your first trip, or you're a seasoned traveler looking for destination inspiration, you've come to the right place!"
        />
        <TravelBlogCard
            imageFirst={true}
            imageUrl="/palms.jpg"
            title="Discover hidden gems and local cultures"
            description="Explore the unexplored. Our travel guides focus on off-the-beaten-path destinations and immersive local experiences to help you plan the trip of a lifetime."
        />
        <TravelBlogCard
            imageFirst={false}
            imageUrl="/palms.jpg"
            title="Adventure awaits in every corner"
            description="From hiking through mountains to exploring urban jungles, our travel experts provide insight into the most adventurous destinations worldwide."
        />
        <Footer />
    </div>
    )
}