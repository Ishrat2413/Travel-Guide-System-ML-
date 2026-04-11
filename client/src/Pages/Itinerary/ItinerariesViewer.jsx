import { Calendar, Clock, MapPin, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { NODE_API_BASE_URL } from "../../config/api";
export default function ItinerariesViewer({ userId }) {
  const [itineraries, setItineraries] = useState([]);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchItineraries();
  }, [userId]);

  const fetchItineraries = async () => {
    try {
      setIsLoadingList(true);
      const response = await fetch(
        `${NODE_API_BASE_URL}/itineraries/${userId}`,
      );
      if (response.ok) {
        const data = await response.json();
        setItineraries(data);
      }
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    } finally {
      setIsLoadingList(false);
    }
  };

  const filteredItineraries = itineraries.filter((itinerary) =>
    itinerary.title?.toLowerCase().includes(searchText.toLowerCase()),
  );

  const fetchItineraryDetails = async (id) => {
    try {
      const response = await fetch(`${NODE_API_BASE_URL}/itinerary/${id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedItinerary(data);
      }
    } catch (error) {
      console.error("Error fetching itinerary details:", error);
    }
  };

  const deleteItinerary = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${NODE_API_BASE_URL}/itinerary/${id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            setItineraries(
              itineraries.filter((itinerary) => itinerary._id !== id),
            );
            if (selectedItinerary && selectedItinerary._id === id) {
              setSelectedItinerary(null);
            }
          }
        } catch (error) {
          console.error("Error deleting itinerary:", error);
        }
      }
    });
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>Your Itineraries</h1>
      <div className='grid md:grid-cols-2 gap-4'>
        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body'>
            <h2 className='card-title mb-4'>Itinerary List</h2>
            <input
              type='text'
              className='input input-bordered mb-4'
              placeholder='Search itineraries by title'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            {isLoadingList ? (
              <div className='flex justify-center py-8'>
                <span className='loading loading-spinner loading-lg text-primary'></span>
              </div>
            ) : filteredItineraries.length ? (
              filteredItineraries.map((itinerary) => (
                <div
                  key={itinerary._id}
                  className='flex items-center justify-center mb-2'>
                  <button
                    className='btn btn-outline btn-block text-left justify-start flex-grow mr-2'
                    onClick={() => fetchItineraryDetails(itinerary._id)}>
                    {itinerary.title}
                  </button>
                  <button
                    className='btn btn-square btn-sm btn-error'
                    onClick={() => deleteItinerary(itinerary._id)}
                    aria-label={`Delete ${itinerary.title}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <p className='text-sm text-base-content/70'>
                No itineraries found.
              </p>
            )}
          </div>
        </div>
        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body'>
            <h2 className='card-title mb-4'>Itinerary Details</h2>
            {selectedItinerary ? (
              <div>
                <h3 className='text-xl font-semibold mb-2'>
                  {selectedItinerary.title}
                </h3>
                {selectedItinerary.destinations.map((destination) => (
                  <div key={destination.id} className='mb-4'>
                    <div className='flex items-center gap-2 mb-2'>
                      <MapPin size={16} />
                      <span className='font-medium'>{destination.name}</span>
                      <span className='text-sm text-gray-500'>
                        <Calendar size={14} className='inline mr-1' />
                        {destination.date}
                      </span>
                    </div>
                    <ul className='list-disc list-inside pl-4'>
                      {destination.activities.map((activity) => (
                        <li key={activity.id} className='mb-1'>
                          <span className='font-medium'>{activity.name}</span>
                          <span className='text-sm text-gray-500 ml-2'>
                            <Clock size={14} className='inline mr-1' />
                            {activity.time}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-gray-500'>
                Select an itinerary to view details
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ItinerariesViewer.propTypes = {
//   userId: PropTypes.object,
// }
ItinerariesViewer.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
