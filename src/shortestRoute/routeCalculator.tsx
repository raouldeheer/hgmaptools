import { useState } from "react";
import battlefields from "./battlefields.json";
import airfields from "./airfields.json";
import "./routeCalculator.css";
import RouteMap from "./routeMap";
import commandnodetemplate from "hagcp-assets/json/commandnodetemplate.json";
import { CustomForm } from "./formUtils";
import { Answer } from "./answerUtils";

export type ATData = {
    speed: number;
    transportradius: number;
};

const DevCommandnodes = ["hq", "commander", "infantry", "reserve"];
const commandnodes = new Map<string, ATData>(
    commandnodetemplate
        .filter(e => !DevCommandnodes.includes(e.name))
        .map(e => [
            e.name,
            { speed: e.speed, transportradius: e.transportradius },
        ]),
);

export const groundATs = new Map<string, ATData>(
    Array.from(commandnodes.entries())
        .filter(e => e[1].transportradius < 0)
        .map(e => [
            e[0],
            { speed: e[1].speed, transportradius: e[1].transportradius },
        ]),
);

export const airATs = new Map<string, ATData>(
    Array.from(commandnodes.entries())
        .filter(e => e[1].transportradius > 0)
        .map(e => [
            e[0],
            { speed: e[1].speed, transportradius: e[1].transportradius },
        ]),
);

export interface RouteResult {
    path: string[];
    distance: number;
}

export enum FormTypes {
    Ground = "Ground to ground",
    Air = "Air to air",
    ParaDrop = "Air to ground",
}

const RouteCalculator = (): JSX.Element => {
    const [answer, setAnswer] = useState<RouteResult | null>(null);
    const [ATType, setATType] = useState<string | null>(null);
    const [formType, setFormType] = useState(FormTypes.Ground);

    const onSubmit = async (data: any) => {
        setATType(data.unit);
        const result = await fetch(
            `https://hgwarmap.dphs.nl/api/battlefieldroute?bftitle1=${data.bftitle1}&bftitle2=${data.bftitle2}`,
        ).then(response => response.json() as unknown as RouteResult | null);
        setAnswer(result);
    };

    const onSubmitFly = async (data: any) => {
        setATType(data.unit);
        const result = await fetch(
            `https://hgwarmap.dphs.nl/api/planeroute?bftitle1=${
                data.bftitle1
            }&bftitle2=${data.bftitle2}&distance=${
                airATs.get(data.unit)?.transportradius
            }`,
        ).then(response => response.json() as unknown as RouteResult | null);
        setAnswer(result);
    };

    const onSubmitPara = async (data: any) => {
        setATType(data.unit);
        const result = await fetch(
            `https://hgwarmap.dphs.nl/api/battlefieldseparation?bftitle1=${data.bftitle1}&bftitle2=${data.bftitle2}`,
        ).then(response => response.json() as unknown as RouteResult | null);
        setAnswer(result);
    };

    const onChange = (e: { target: { value: string } }) => {
        setFormType(e.target.value as FormTypes);
    };

    return (
        <div className="total">
            <div className="Calculator">
                <div className="form">
                    <label htmlFor="formSelect">Choose movement type:</label>
                    <br />
                    <select
                        className="input"
                        name="select"
                        id="formSelect"
                        onChange={onChange}
                    >
                        {Object.values(FormTypes).map(type => (
                            <option>{type}</option>
                        ))}
                    </select>
                    {formType === FormTypes.Ground ? (
                        <CustomForm
                            selectBoxes={[
                                ["starting city", "bftitle1", battlefields],
                                [
                                    "destination airfield",
                                    "bftitle2",
                                    battlefields,
                                ],
                                [
                                    "assault team type",
                                    "unit",
                                    Array.from(groundATs.keys()),
                                ],
                            ]}
                            onSubmit={onSubmit}
                        />
                    ) : null}
                    {formType === FormTypes.Air ? (
                        <CustomForm
                            selectBoxes={[
                                ["starting airfield", "bftitle1", airfields],
                                ["destination airfield", "bftitle2", airfields],
                                [
                                    "assault team type",
                                    "unit",
                                    Array.from(airATs.keys()),
                                ],
                            ]}
                            onSubmit={onSubmitFly}
                        />
                    ) : null}
                    {formType === FormTypes.ParaDrop ? (
                        <CustomForm
                            selectBoxes={[
                                ["starting airfield", "bftitle1", airfields],
                                ["destination city", "bftitle2", battlefields],
                                [
                                    "assault team type",
                                    "unit",
                                    Array.from(airATs.keys()),
                                ],
                            ]}
                            onSubmit={onSubmitPara}
                        />
                    ) : null}
                </div>
                {answer ? (
                    <Answer
                        answer={answer}
                        ATType={ATType}
                        commandnodes={commandnodes}
                    />
                ) : null}
            </div>
            <div className="Map">
                <RouteMap answer={answer} />
            </div>
        </div>
    );
};

export default RouteCalculator;
