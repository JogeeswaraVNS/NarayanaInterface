import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomeLayout from "./homelayout/HomeLayout";
import HomePage from "./homepage/HomePage";
import PredictComponent from "./predictcomponent/PredictComponent";
import GradCamApp from "./gradcam/GradCamApp";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/predict",
          element: <PredictComponent />,
        },
        {
          path: "/gradcam",
          element: <GradCamApp />,
        },
      ],
    },
  ]);

  return (
    <div className="App ">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
