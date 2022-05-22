import { useGTMDispatch } from "@elgorditosalsero/react-gtm-hook";
import { useEffect } from "react";
import "./App.css";
import RouteCalculator from "./shortestRoute/routeCalculator";

const App = ({
    apiFetch,
}: {
    apiFetch: <T>(endpoint: string) => Promise<T | null>;
}): JSX.Element => {
    const sendDataToGTM = useGTMDispatch();

    useEffect(() => {
        sendDataToGTM({ event: "pageLoaded", value: "loaded" });
    }, [sendDataToGTM]);

    return (
        <div className="App">
            <RouteCalculator apiFetch={apiFetch} />
        </div>
    );
};

export default App;
