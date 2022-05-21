import "./App.css";
import FetchManager from "./fetchManager";
import RouteCalculator from "./shortestRoute/routeCalculator";

const App = ({ fetchManager }: { fetchManager: FetchManager; }): JSX.Element => {
    return (
        <div className="App">
            <RouteCalculator fetchManager={fetchManager}/>
        </div>
    );
};

export default App;
