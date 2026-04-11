import { PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import PropTypes from 'prop-types';
import { NODE_API_BASE_URL } from "../../config/api";

export default function ItineraryBuilder({ userId }) {
  const [itinerary, setItinerary] = useState({
    userId,
    title: "",
    destinations: [],
  });

  const saveItinerary = async () => {
    try {
      const response = await fetch(`${NODE_API_BASE_URL}/itinerary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itinerary),
      });
      if (response.ok) {
        const data = await response.json();
        setItinerary((prev) => ({ ...prev, _id: data.itinerary._id }));
        Swal.fire({
          title: "Saved!",
          text: "Itinerary saved successfully!",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error saving itinerary:", error);
    }
  };

  const addDestination = () => {
    setItinerary((prev) => ({
      ...prev,
      destinations: [
        ...prev.destinations,
        { id: Date.now().toString(), name: "", date: "", activities: [] },
      ],
    }));
  };

  const addActivity = (destinationId) => {
    setItinerary((prev) => ({
      ...prev,
      destinations: prev.destinations.map((dest) =>
        dest.id === destinationId
          ? {
            ...dest,
            activities: [
              ...dest.activities,
              { id: Date.now().toString(), name: "", time: "" },
            ],
          }
          : dest
      ),
    }));
  };

  const updateDestination = (id, field, value) => {
    setItinerary((prev) => ({
      ...prev,
      destinations: prev.destinations.map((dest) =>
        dest.id === id ? { ...dest, [field]: value } : dest
      ),
    }));
  };

  const updateActivity = (destinationId, activityId, field, value) => {
    setItinerary((prev) => ({
      ...prev,
      destinations: prev.destinations.map((dest) =>
        dest.id === destinationId
          ? {
            ...dest,
            activities: dest.activities.map((act) =>
              act.id === activityId ? { ...act, [field]: value } : act
            ),
          }
          : dest
      ),
    }));
  };

  const removeDestination = (id) => {
    setItinerary((prev) => ({
      ...prev,
      destinations: prev.destinations.filter((dest) => dest.id !== id),
    }));
  };

  const removeActivity = (destinationId, activityId) => {
    setItinerary((prev) => ({
      ...prev,
      destinations: prev.destinations.map((dest) =>
        dest.id === destinationId
          ? {
            ...dest,
            activities: dest.activities.filter(
              (act) => act.id !== activityId
            ),
          }
          : dest
      ),
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create New Itinerary</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Itinerary Title"
          className="input input-bordered w-full"
          value={itinerary.title}
          onChange={(e) =>
            setItinerary((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </div>
      {itinerary.destinations.map((destination) => (
        <div key={destination.id} className="card bg-base-100 shadow-xl mb-4">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <input
                type="text"
                placeholder="Destination"
                className="input input-bordered w-full max-w-xs"
                value={destination.name}
                onChange={(e) =>
                  updateDestination(destination.id, "name", e.target.value)
                }
              />
              <input
                type="date"
                className="input input-bordered"
                value={destination.date}
                onChange={(e) =>
                  updateDestination(destination.id, "date", e.target.value)
                }
              />
              <button
                className="btn btn-square btn-sm"
                onClick={() => removeDestination(destination.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="divider">Activities</div>
            {destination.activities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Activity"
                  className="input input-bordered w-full"
                  value={activity.name}
                  onChange={(e) =>
                    updateActivity(
                      destination.id,
                      activity.id,
                      "name",
                      e.target.value
                    )
                  }
                />
                <input
                  type="time"
                  className="input input-bordered"
                  value={activity.time}
                  onChange={(e) =>
                    updateActivity(
                      destination.id,
                      activity.id,
                      "time",
                      e.target.value
                    )
                  }
                />
                <button
                  className="btn btn-square btn-sm"
                  onClick={() => removeActivity(destination.id, activity.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              className="btn btn-outline btn-sm"
              onClick={() => addActivity(destination.id)}
            >
              <PlusCircle size={16} className="mr-2" /> Add Activity
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-between">
        <button className="btn btn-primary" onClick={addDestination}>
          <PlusCircle size={16} className="mr-2" /> Add Destination
        </button>
        <button className="btn btn-success" onClick={saveItinerary}>
          Save Itinerary
        </button>
      </div>
    </div>
  );
}

ItineraryBuilder.propTypes = {
  userId: PropTypes.object,
}