import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPageComponent from './screens/landing-page/LandingPage.component'
import RoomComponent from './screens/room/Room.component'

function AppRouter() {


    const router = createBrowserRouter([
        {
            path: '/',
            element: <LandingPageComponent />
        },
        {
            path: '/:roomId',
            element: <RoomComponent />
        }
    ])

    return (
        <RouterProvider router={router} />
    )
}

export default AppRouter
