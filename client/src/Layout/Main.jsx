import { Outlet, useNavigation } from "react-router-dom";
import Navbar from "../Pages/Shared/Navbar";
import Footer from "../Pages/Footer/Footer";
import RouteLoader from "../components/RouteLoader";
const Main = () => {
  const navigation = useNavigation();
  const isNavigating = navigation.state !== "idle";

  return (
    <div className='min-h-screen'>
      {isNavigating && <RouteLoader />}
      <Navbar></Navbar>
      <main className='min-h-[70vh]'>
        <Outlet></Outlet>
      </main>
      <Footer />
    </div>
  );
};

export default Main;
