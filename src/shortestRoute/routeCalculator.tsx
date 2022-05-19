import { useState } from "react";
import { useForm } from "react-hook-form";
import battlefields from "./battlefields.json";
import airfields from "./airfields.json";
import RoutePoint from "./routePoint";
import "./routeCalculator.css";
import RouteMap from "./routeMap";
import commandnodetemplate from "hagcp-assets/json/commandnodetemplate.json";

const commandnodetemplateNameToSpeed = new Map<string, number>(commandnodetemplate.map(e => ([e.name, e.speed])));
const planes = new Map<string, { speed: number, transportradius: number; }>(commandnodetemplate
    .filter(e => e.transportradius > 0)
    .map(e => ([e.name, { speed: e.speed, transportradius: e.transportradius }])));

export interface RouteResult {
    path: string[];
    distance: number;
}

const RouteCalculator = (): JSX.Element => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [answer, setAnswer] = useState<RouteResult | null>(null);
    const [ATType, setATType] = useState<string | null>(null);
    const [formType, setFormType] = useState("Ground");

    const onSubmit = async (data: any) => {
        setATType(data.unit);
        const result = await fetch(`https://hgwarmap.dphs.nl/api/battlefieldroute?bftitle1=${data.bftitle1}&bftitle2=${data.bftitle2}`)
            .then(response => response.json() as unknown as RouteResult | null);
        setAnswer(result);
    };

    const onSubmitFly = async (data: any) => {
        setATType(data.unit);
        const result = await fetch(`https://hgwarmap.dphs.nl/api/battlefieldroute?bftitle1=${data.bftitle1}&bftitle2=${data.bftitle2}`)
            .then(response => response.json() as unknown as RouteResult | null);
        setAnswer(result);
    };

    const onChange = (e: { target: { value: string; }; }) => {
        setFormType(e.target.value);
        console.log(e.target.value);
    };

    return <div className="total">
        <div className="Calculator">
            <div className="form">
                <select className="input" name="select" onChange={onChange}>
                    <option>Ground</option>
                    <option>Air</option>
                </select>
                {formType === "Ground" ? <form onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="title">City route</h1>

                    <label htmlFor="bftitle1">Choose starting city:</label><br />
                    <select className="input" id="bftitle1" {...register("bftitle1")}>
                        {battlefields.map(title => <option key={title + "1"} value={title}>{title}</option>)}
                    </select><br />
                    {errors.bftitle1 && <><span className="message">Starting city is required</span><br /></>}

                    <label htmlFor="bftitle2">Choose destination city:</label><br />
                    <select className="input" id="bftitle2" {...register("bftitle2")}>
                        {battlefields.map(title => <option key={title + "2"} value={title}>{title}</option>)}
                    </select><br />
                    {errors.bftitle2 && <><span className="message">Destination city is required</span><br /></>}

                    <label htmlFor="unit">Choose assault team type:</label><br />
                    <select className="input" id="unit" {...register("unit")}>
                        {Array.from(commandnodetemplateNameToSpeed.keys()).map(title => <option key={title} value={title}>{title}</option>)}
                    </select><br />
                    {errors.unit && <><span className="message">Assault team is required</span><br /></>}

                    <input className="submit" type="submit" />
                </form> : null}
                {formType === "Air" ? <form onSubmit={handleSubmit(onSubmitFly)}>
                    <h1 className="title">City route</h1>

                    <label htmlFor="bftitle1">Choose starting airfield:</label><br />
                    <select className="input" id="bftitle1" {...register("bftitle1")}>
                        {airfields.map(title => <option key={title + "1"} value={title}>{title}</option>)}
                    </select><br />
                    {errors.bftitle1 && <><span className="message">Starting airfield is required</span><br /></>}

                    <label htmlFor="bftitle2">Choose destination airfield:</label><br />
                    <select className="input" id="bftitle2" {...register("bftitle2")}>
                        {airfields.map(title => <option key={title + "2"} value={title}>{title}</option>)}
                    </select><br />
                    {errors.bftitle2 && <><span className="message">Destination airfield is required</span><br /></>}

                    <label htmlFor="unit">Choose assault team type:</label><br />
                    <select className="input" id="unit" {...register("unit")}>
                        {Array.from(planes.keys()).map(title => <option key={title} value={title}>{title}</option>)}
                    </select><br />
                    {errors.unit && <><span className="message">Assault team is required</span><br /></>}

                    <input className="submit" type="submit" />
                </form> : null}
            </div>
            {answer ? <div className="pathlist">
                <h2>Route</h2>
                <p>Distance: {answer.distance.toFixed(2)}</p>
                {ATType ? <>
                    <p>Traveltime grey: {secondsToTimeString(answer.distance / commandnodetemplateNameToSpeed.get(ATType)! * 1.0)}</p>
                    <p>Traveltime green: {secondsToTimeString(answer.distance / commandnodetemplateNameToSpeed.get(ATType)! * (1 / 1.5))}</p>
                </> : null}
                <p>Path:</p>
                <ul>{answer.path.map(v => <RoutePoint key={v} id={v} />)}</ul>
            </div> : null}
        </div>
        <div className="Map">
            <RouteMap answer={answer} />
        </div>


    </div>;
};

export default RouteCalculator;

function secondsToTimeString(sec: number) {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec - (hours * 3600)) / 60);
    const seconds = sec - (hours * 3600) - (minutes * 60);

    const hoursStr = `${hours > 0 ? hours.toString() + " Hours " : ""}`;
    const minutesStr = `${minutes > 0 ? minutes.toString() + " minutes " : ""}`;
    const secondsStr = `${seconds > 0 ? seconds.toFixed(2) + " seconds " : ""}`;
    return hoursStr + minutesStr + secondsStr;
}
