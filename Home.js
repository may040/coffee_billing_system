import React from "react"
import OverallLeaderboard from "../components/statistics/OverallLeaderboard"
import CurrentLeaderboard from "../components/statistics/CurrentLeaderboard"
import BeveragesBoughtTable from "../components/statistics/BeveragesBoughtTable"

/**
 * Home React component
 * 
 * @author Mathias Wetzer
 * @returns {JSX.Element} The rendered Home page
 */
const Home = () => {
    return (
        <div className="flex items-start justify-center h-screen">
            <div className="flex flex-col items-center justify-center backdrop-brightness-90 mt-8 p-4">
                <h3>Welcome to the KaffeePi Management platform!</h3>
                
                <div className="m-10">
                    <h3 className="px-4 self-start text-center text-xl font-bold">Current Billing Period Leaderboard</h3>
                    <CurrentLeaderboard />
                </div>

                <div className="m-10">
                    <h3 className="px-4 self-start text-center text-xl font-bold">Overall Leaderboard</h3>
                    <OverallLeaderboard />  
                </div>

                <div className="m-10">
                    <h3 className="px-4 self-start text-center text-xl font-bold">Bought Beverages</h3>
                    <BeveragesBoughtTable />
                </div>
            </div>
        </div>
    )
}

export default Home;