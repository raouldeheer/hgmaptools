import { useState } from "react";
import battlefields from "./battlefields.json";
import airfields from "./airfields.json";
import "./routeCalculator.css";
import RouteMap from "./routeMap";
import commandnodetemplate from "hagcp-assets/json/commandnodetemplate.json";
import { CustomForm } from "./formUtils";
import { Answer } from "./answerUtils";
import { useGTMDispatch } from "@elgorditosalsero/react-gtm-hook";

export type ATData = {
    speed: number;
    transportradius: number;
};

const DevCommandnodes = ["hq", "commander", "reserve"];
const commandnodes = new Map<string, any>(
    commandnodetemplate
        .filter(e => !DevCommandnodes.includes(e.name))
        .map(e => [e.name, e]),
);

export const groundATs = new Map<string, ATData>(
    Array.from(commandnodes.entries())
        .filter(e => e[1].transportradius < 0 && e[1].convertTo === "0")
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

const RouteCalculator = ({
    apiFetch,
}: {
    apiFetch: <T>(endpoint: string) => Promise<T | null>;
}): JSX.Element => {
    const sendDataToGTM = useGTMDispatch();

    const [answer, setAnswer] = useState<RouteResult | null>(null);
    const [ATType, setATType] = useState<string | null>(null);
    const [formType, setFormType] = useState(FormTypes.Ground);

    const onSubmit = async (data: any) => {
        setATType(data.unit);
        sendDataToGTM({
            event: "onSubmit",
            value: `bftitle1=${data.bftitle1}&bftitle2=${data.bftitle2}`,
        });
        setAnswer(
            await apiFetch<RouteResult>(
                `/api/battlefieldroute?bftitle1=${data.bftitle1}&bftitle2=${data.bftitle2}`,
            ),
        );
    };

    const onSubmitFly = async (data: any) => {
        setATType(data.unit);
        sendDataToGTM({
            event: "onSubmitFly",
            value: `bftitle1=${data.bftitle1}&bftitle2=${
                data.bftitle2
            }&distance=${airATs.get(data.unit)?.transportradius}`,
        });
        setAnswer(
            await apiFetch<RouteResult>(
                `/api/planeroute?bftitle1=${data.bftitle1}&bftitle2=${
                    data.bftitle2
                }&distance=${airATs.get(data.unit)?.transportradius}`,
            ),
        );
    };

    const onSubmitPara = async (data: any) => {
        setATType(data.unit);
        sendDataToGTM({
            event: "onSubmitPara",
            value: `bftitle1=${data.bftitle1}&bftitle2=${data.bftitle2}`,
        });
        setAnswer(
            await apiFetch<RouteResult>(
                `/api/battlefieldseparation?bftitle1=${data.bftitle1}&bftitle2=${data.bftitle2}`,
            ),
        );
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
                            <option key={type}>{type}</option>
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
                        apiFetch={apiFetch}
                    />
                ) : null}
            </div>
            <div className="Map">
                <RouteMap answer={answer} apiFetch={apiFetch} />
            </div>
        </div>
    );
};

export default RouteCalculator;
