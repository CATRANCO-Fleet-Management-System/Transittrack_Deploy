import { useState, useEffect } from "react";
import mqtt from "mqtt";

interface BusData {
  number: string;
  name: string;
  status: string;
  latitude: number;
  longitude: number;
  time: string;
  speed: number;
}

export const useMqtt = (selectedBus: string | null, setPathData: (path: [number, number][]) => void) => {
  const [busData, setBusData] = useState<BusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const client = mqtt.connect("wss://mqtt.flespi.io", {
      username: process.env.NEXT_PUBLIC_FLESPI_TOKEN || "",
    });

    client.on("connect", () => {
      console.log("Connected to Flespi MQTT broker");
      client.subscribe("flespi/message/gw/devices/#", (err) => {
        if (err) {
          console.error("Failed to subscribe to MQTT topic", err);
        } else {
          setLoading(false);
        }
      });
    });

    client.on("message", (topic, message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        const deviceId = parsedMessage["device.id"];
        const latitude = parsedMessage["position.latitude"];
        const longitude = parsedMessage["position.longitude"];
        const speed = parsedMessage["position.speed"];
        const time = new Date(parsedMessage["timestamp"] * 1000).toISOString();

        if (selectedBus === deviceId.toString()) {
          setPathData((prevPath) => [...prevPath, [latitude, longitude]]);
        }

        setBusData((prevData) => {
          const updatedData = prevData.map((bus) =>
            bus.number === deviceId.toString()
              ? { ...bus, latitude, longitude, speed, time }
              : bus
          );

          if (!updatedData.some((bus) => bus.number === deviceId.toString())) {
            updatedData.push({
              number: deviceId.toString(),
              name: `Bus ${deviceId}`,
              status: `Speed: ${speed} km/h`,
              latitude,
              longitude,
              time,
              speed,
            });
          }

          return updatedData;
        });
      } catch (err) {
        console.error("Error processing MQTT message", err);
      }
    });

    client.on("error", (err) => {
      console.error("MQTT error", err);
      setError("Failed to connect to MQTT broker.");
    });

    return () => {
      client.end();
    };
  }, [selectedBus]);

  return { busData, loading, error };
};
