import { Compass, ShieldCheck, Sparkles, Timer } from "lucide-react";

const highlights = [
  {
    title: "Smart Destination Matching",
    description:
      "Find places based on your city, interests, and trip style using data-driven recommendations.",
    icon: Compass,
  },
  {
    title: "Budget-First Planning",
    description:
      "Get an instant breakdown for accommodation, food, transport, and activities before you travel.",
    icon: Timer,
  },
  {
    title: "Secure Account Experience",
    description:
      "Firebase authentication helps protect your identity and keeps your itinerary history personalized.",
    icon: ShieldCheck,
  },
  {
    title: "Trip Productivity Tools",
    description:
      "Build, edit, and revisit itineraries in one place to make planning smoother and faster.",
    icon: Sparkles,
  },
];

const ProfessionalHighlights = () => {
  return (
    <section className='my-16 px-4'>
      <div className='text-center mb-10'>
        <h2 className='text-3xl md:text-4xl font-bold'>
          Why travelers choose us
        </h2>
        <p className='text-base-content/70 mt-3 max-w-3xl mx-auto'>
          A focused travel platform for realistic trip planning—from discovery
          to budget and itinerary execution.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
        {highlights.map(({ title, description, icon: Icon }) => (
          <article
            key={title}
            className='card bg-base-100 shadow-md border border-base-200'>
            <div className='card-body'>
              <Icon className='text-primary' size={30} />
              <h3 className='card-title text-lg'>{title}</h3>
              <p className='text-sm text-base-content/70'>{description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProfessionalHighlights;
