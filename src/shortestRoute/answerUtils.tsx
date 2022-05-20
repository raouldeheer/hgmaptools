import { RouteResult } from "./routeCalculator";
import RoutePoint from "./routePoint";

export const Answer = ({
    answer,
    ATType,
    commandnodetemplateNameToSpeed,
}: {
    answer: RouteResult;
    ATType: string | null;
    commandnodetemplateNameToSpeed: Map<string, number>;
}): JSX.Element => {
    return (
        <div className="pathlist">
            <h2>Route</h2>
            <p>Distance: {answer.distance.toFixed(2)}</p>
            {ATType ? (
                <Traveltime
                    answer={answer}
                    ATType={ATType}
                    commandnodetemplateNameToSpeed={
                        commandnodetemplateNameToSpeed
                    }
                />
            ) : null}
            <p>Path:</p>
            <ul>
                {answer.path.map(v => (
                    <RoutePoint key={v} id={v} />
                ))}
            </ul>
        </div>
    );
};

const Traveltime = ({
    answer,
    ATType,
    commandnodetemplateNameToSpeed,
}: {
    answer: RouteResult;
    ATType: string;
    commandnodetemplateNameToSpeed: Map<string, number>;
}) => {
    const time = answer.distance / commandnodetemplateNameToSpeed.get(ATType)!;

    return (
        <>
            <p>Traveltime:</p>
            <table>
                <thead>
                    <tr>
                        <th>Logistics Expert</th>
                        <th>None</th>
                        <th>Bronze</th>
                        <th>Silver</th>
                        <th>Gold</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                        { name: "Grey line", mult: 1.0 },
                        {
                            name: "Green line",
                            mult: 1 / 1.5,
                        },
                    ].map(({ name, mult }) => (
                        <tr>
                            <td>{name}</td>
                            {[
                                mult,
                                mult * (1 / 1.1),
                                mult * (1 / 1.15),
                                mult * (1 / 1.2),
                            ].map(multiplier => (
                                <td>
                                    {secondsToTimeString(time * multiplier)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

function secondsToTimeString(sec: number) {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec - hours * 3600) / 60);
    const seconds = sec - hours * 3600 - minutes * 60;

    const hoursStr = `${hours > 0 ? hours.toString() + " H " : ""}`;
    const minutesStr = `${minutes > 0 ? minutes.toString() + " M " : ""}`;
    const secondsStr = `${seconds > 0 ? seconds.toFixed(2) + " S" : ""}`;
    return hoursStr + minutesStr + secondsStr;
}
