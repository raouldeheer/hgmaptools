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
                        <Traveltime
                            answer={answer}
                            ATType={ATType}
                            commandnodes={commandnodes}
                            lines={[
                                { name: "Grey line", mult: 1.0 },
                                {
                                    name: "Green line",
                                    mult: 1 / 1.5,
                                },
                            ]}
                        />
                    ) : null}
                    {airATs.has(ATType) ? (
                        <Traveltime
                            answer={answer}
                            ATType={ATType}
                            commandnodes={commandnodes}
                            lines={[{ name: "Air", mult: 2.0 }]}
                        />
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

export default Answer;

const Traveltime = ({
    answer,
    ATType,
    commandnodes,
    lines,
}: {
    answer: RouteResult;
    ATType: string;
    commandnodes: Map<string, ATData>;
    lines: {
        name: string;
        mult: number;
    }[];
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
                    {lines.map(({ name, mult }) => (
                        <tr key={name}>
                            <td key={`name${name}`}>{name}</td>
                            {[
                                mult,
                                mult * (1 / 1.1),
                                mult * (1 / 1.15),
                                mult * (1 / 1.2),
                            ].map(multiplier => (
                                <td key={`name${multiplier}`}>
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
