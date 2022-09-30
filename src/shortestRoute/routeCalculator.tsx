import { useState } from "react";
import "./routeCalculator.css";
import commandnodetemplate from "hagcp-assets/json/commandnodetemplate.json";
import React from "react";
import { MenuItem, Select } from "@mui/material";

const Answer = React.lazy(() => import('./answerUtils'));
const RouteMap = React.lazy(() => import('./routeMap'));
const GTG = React.lazy(() => import('./modes/GTG'));
const ATA = React.lazy(() => import('./modes/ATA'));
const ATG = React.lazy(() => import('./modes/ATG'));

export type ATData = {
    speed: number;
    transportradius: number;
};

const DevCommandnodes = ["hq", "commander"];
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

const RouteCalculator = (): JSX.Element => {
    const [answer, setAnswer] = useState<RouteResult | null>(null);
    const [ATType, setATType] = useState<string | null>(null);
    const [formType, setFormType] = useState(FormTypes.Ground);

    const onChange = (e: { target: { value: string; }; }) => {
        setFormType(e.target.value as FormTypes);
    };

    return (
        <div className="total">
            <div className="Calculator">
                <div className="form">
                    <h1>Traveltime</h1>
                    <Select
                        value={formType}
                        onChange={onChange}
                        fullWidth
                    >
                        {Object.values(FormTypes).map(type => (
                            <MenuItem value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                    <br />
                    <br />
                    {formType === FormTypes.Ground ? (
                        <GTG
                            setATType={setATType}
                            setAnswer={setAnswer}
                        />
                    ) : null}
                    {formType === FormTypes.Air ? (
                        <ATA
                            setATType={setATType}
                            setAnswer={setAnswer}
                        />
                    ) : null}
                    {formType === FormTypes.ParaDrop ? (
                        <ATG
                            setATType={setATType}
                            setAnswer={setAnswer}
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
