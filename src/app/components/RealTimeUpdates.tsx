import React, { useEffect, useState } from "react";
import echo from "../utils/echo";

const RealTimeUpdates = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const channel = echo.channel("flespi-data");

        channel.listen("FlespiDataReceived", (event) => {
            console.log("Received event:", event);
            setEvents((prev) => [...prev, event]);
        });

        return () => {
            channel.stopListening("FlespiDataReceived");
        };
    }, []);

    return (
        <div>
            <h1>Real-Time Updates</h1>
            <ul>
                {events.map((event, index) => (
                    <li key={index}>{JSON.stringify(event)}</li>
                ))}
            </ul>
        </div>
    );
};

export default RealTimeUpdates;
