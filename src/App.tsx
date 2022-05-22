import "./App.css";
import RouteCalculator from "./shortestRoute/routeCalculator";

const App = ({
    apiFetch,
}: {
    apiFetch: <T>(endpoint: string) => Promise<T | null>;
}): JSX.Element => {
    return (
        <div className="App">
            <RouteCalculator apiFetch={apiFetch} />
        </div>
    );
};

export default App;
