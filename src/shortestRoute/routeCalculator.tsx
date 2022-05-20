import { useState } from "react";
import battlefields from "./battlefields.json";
import airfields from "./airfields.json";
import "./routeCalculator.css";
import RouteMap from "./routeMap";
import commandnodetemplate from "hagcp-assets/json/commandnodetemplate.json";
import { CustomForm } from "./formUtils";
import { Answer } from "./answerUtils";

const commandnodetemplateNameToSpeed = new Map<string, number>(
    commandnodetemplate.map(e => [e.name, e.speed]),
);
const planes = new Map<string, { speed: number; transportradius: number }>(
    commandnodetemplate
        .filter(e => e.transportradius > 0)
        .map(e => [
            e.name,
            { speed: e.speed, transportradius: e.transportradius },
        ]),
);

export interface RouteResult {
    path: string[];
    distance: number;
}

const RouteCalculator = (): JSX.Element => {
    const [answer, setAnswer] = useState<RouteResult | null>(null);
    const [ATType, setATType] = useState<string | null>(null);
    const [formType, setFormType] = useState("Ground");

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
                planes.get(data.unit)?.transportradius
            }`,
        ).then(response => response.json() as unknown as RouteResult | null);
        setAnswer(result);
    };

    const onChange = (e: { target: { value: string } }) => {
        setFormType(e.target.value);
        console.log(e.target.value);
    };

    return (
        <div className="total">
            <div className="Calculator">
                <div className="form">
                    <select className="input" name="select" onChange={onChange}>
                        <option>Ground</option>
                        <option>Air</option>
                    </select>
                    {formType === "Ground" ? (
                        <CustomForm
                            title="City route"
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
                                    Array.from(
                                        commandnodetemplateNameToSpeed.keys(),
                                    ),
                                ],
                            ]}
                            onSubmit={onSubmit}
                        />
                    ) : null}
                    {formType === "Air" ? (
                        <CustomForm
                            title="Air route"
                            selectBoxes={[
                                ["starting airfield", "bftitle1", airfields],
                                ["destination city", "bftitle2", airfields],
                                [
                                    "assault team type",
                                    "unit",
                                    Array.from(planes.keys()),
                                ],
                            ]}
                            onSubmit={onSubmitFly}
                        />
                    ) : null}
                </div>
                {answer ? (
                    <Answer
                        answer={answer}
                        ATType={ATType}
                        commandnodetemplateNameToSpeed={
                            commandnodetemplateNameToSpeed
                        }
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
