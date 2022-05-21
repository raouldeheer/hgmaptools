import { airATs, ATData, groundATs, RouteResult } from "./routeCalculator";
import RoutePoint from "./routePoint";

export const Answer = ({
    answer,
    ATType,
    commandnodes,
}: {
    answer: RouteResult;
    ATType: string | null;
    commandnodes: Map<string, ATData>;
}): JSX.Element => {
    return (
        <div className="pathlist">
            <h2>Route</h2>
            <p>Distance: {answer.distance.toFixed(2)}</p>
            {ATType ? (
                <>
                    {groundATs.has(ATType) ? (
                        <TraveltimeGround
                            answer={answer}
                            ATType={ATType}
                            commandnodes={commandnodes}
                        />
                    ) : null}
                    {airATs.has(ATType) ? (
                        <p>
                            Traveltime:{" "}
                            {secondsToTimeString(
                                answer.distance /
                                    commandnodes.get(ATType)!.speed /
                                    2,
                            )}
                        </p>
                    ) : null}
                </>
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

const TraveltimeGround = ({
    answer,
    ATType,
    commandnodes,
}: {
    answer: RouteResult;
    ATType: string;
    commandnodes: Map<string, ATData>;
}) => {
    const time = answer.distance / commandnodes.get(ATType)!.speed;

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
    const seconds = Math.floor(sec - hours * 3600 - minutes * 60);

    const hoursStr = `${hours > 0 ? hours.toString() + ":" : ""}`;
    const minutesStr = `${minutes > 0 ? minutes.toString() + ":" : ""}`;
    const secondsStr = `${
        seconds > 0 ? seconds.toString().padStart(2, "0") : ""
    }`;

    let returnStr = "";
    if (hoursStr) returnStr += hoursStr;
    if (minutesStr)
        returnStr += hoursStr ? minutesStr.padStart(2, "0") : minutesStr;
    returnStr += minutesStr ? secondsStr.padStart(2, "0") : secondsStr;
    return returnStr;
}
