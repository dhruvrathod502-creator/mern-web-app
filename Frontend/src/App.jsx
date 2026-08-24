import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { setLoading, setUser } from "./redux/authSlice";

import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";
import Friends from "./pages/Friends.jsx";
import Profile from "./pages/Profile.jsx";
import Navbar from "./components/Navbar.jsx";
import PostPage from "./pages/PostPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import FriendsPage from "./pages/FriendsPage.jsx";
import PhotosPage from "./pages/PhotosPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "friends",
        element: <Friends />,
      },
    ],
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/signup",
    element: <Signup />,
  },

  {
    path: "/profile/:id",
    element: (
      <ProtectedRoute>
        <Navbar />
        <Profile />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "post",
        element: <PostPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "friends",
        element: <FriendsPage />,
      },
      {
        path: "photos",
        element: <PhotosPage />,
      },
    ],
  },
]);

const App = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          "http://localhost:9000/api/v1/auth/me",
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          dispatch(setUser(res.data.user));
        } else {
          dispatch(setUser(null));
        }
      } catch (error) {
        console.log(
          "Auth check failed:",
          error.response?.data?.message
        );

        dispatch(setUser(null));
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkAuth();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return <RouterProvider router={router} />;
};

export default App;