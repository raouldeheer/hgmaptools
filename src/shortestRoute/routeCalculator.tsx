import { useState } from "react";
import { useForm } from "react-hook-form";
import battlefields from "./battlefields.json";
import RoutePoint from "./routePoint";
import "./routeCalculator.css";
import RouteMap from "./routeMap";
import commandnodetemplate from "hagcp-assets/json/commandnodetemplate.json";

const commandnodetemplateNameToSpeed = new Map<string, number>();

commandnodetemplate.forEach(element => {
    commandnodetemplateNameToSpeed.set(element.name, element.speed);
});

export interface RouteResult {
    path: string[];
    distance: number;
}

const RouteCalculator = (): JSX.Element => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [answer, setAnswer] = useState<RouteResult | null>(null);
    const [ATType, setATType] = useState<string | null>(null);

    const onSubmit = async (data: any) => {
        setATType(data.unit);
        const result = await fetch(`https://hgwarmap.dphs.nl/api/battlefieldroute?bftitle1=${data.bftitle1}&bftitle2=${data.bftitle2}`)
            .then(response => response.json() as unknown as RouteResult | null);
        setAnswer(result);
    };

    return <div className="total">
        <div className="Calculator">
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
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
                {errors.bftitle2 && <><span className="message">Destination city is required</span><br /></>}

                <input className="submit" type="submit" />
            </form>
            {answer ? <div className="pathlist">
                <h2>Route</h2>
                <p>Distance: {answer.distance.toFixed(2)}</p>
                {ATType ? <>
                    <p>Traveltime grey: {(answer.distance / commandnodetemplateNameToSpeed.get(ATType)! * 1.0).toFixed(2)} Seconds</p>
                    <p>Traveltime green: {(answer.distance / commandnodetemplateNameToSpeed.get(ATType)! * (1 / 1.5)).toFixed(2)} Seconds</p>
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
