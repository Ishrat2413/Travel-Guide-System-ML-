import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home/Home";
import AddFeedback from "../Pages/Home/AddFeedback";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import ErrorPage from "../Pages/Errorpage/Errorpage";
import UserPage from "../Pages/UserPage/UserPage";
import Recommend from "../Pages/Recommend/Recommend";
import Itinerary from "../Pages/Itinerary";
import { NODE_API_BASE_URL } from "../config/api";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home></Home>,
        loader: () => fetch(`${NODE_API_BASE_URL}/feedback`),
      },
      {
        path: "/feedback",
        element: <AddFeedback></AddFeedback>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/userpage",
        element: <UserPage />,
      },
      {
        path: "/recommend",
        element: <Recommend />,
      },
      {
        path: "/itinerary",
        element: <Itinerary></Itinerary>,
      },
    ],
  },
]);
