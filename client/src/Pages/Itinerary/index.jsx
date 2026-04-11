import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import ItineraryBuilder from "./ItineraryBuilder";
import ItinerariesViewer from "./ItinerariesViewer";

export default function Itinerary() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("builder");

  if (!user) {
    return (
      <div className='container mx-auto p-4 mt-[120px]'>
        <div className='alert alert-warning max-w-2xl mx-auto'>
          <span>Please login first to create and manage itineraries.</span>
        </div>
      </div>
    );
  }

  const fullName = user.displayName || user.email || "Traveler";

  return (
    <div className='container mx-auto p-4 mt-[100px]'>
      <h1 className='text-4xl font-bold mb-8 text-center'>
        Travel Itinerary Planner
      </h1>
      <p className='text-center mb-4'>Welcome, {fullName}!</p>
      <div className='tabs tabs-boxed mb-4 justify-center'>
        <a
          className={`tab ${activeTab === "builder" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("builder")}>
          Create Itinerary
        </a>
        <a
          className={`tab ${activeTab === "viewer" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("viewer")}>
          View Itineraries
        </a>
      </div>
      {activeTab === "builder" ? (
        <ItineraryBuilder userId={user?.uid || user?.email} />
      ) : (
        <ItinerariesViewer userId={user?.uid || user?.email} />
      )}
    </div>
  );
}
