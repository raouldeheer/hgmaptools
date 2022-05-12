import { useState } from "react";
import { useForm } from "react-hook-form";

const formStyle: React.CSSProperties = {
    background: "#FFFFFF",
    padding: "45px",
    textAlign: "center",
    width: "fit-content",
};

const inputStyle: React.CSSProperties = {
    fontFamily: "sans-serif",
    outline: 0,
    background: "#f2f2f2",
    border: 0,
    margin: "15px 0 0",
    padding: "15px",
    boxSizing: "border-box",
    fontSize: "14px",
};

const submitStyle: React.CSSProperties = {
    marginTop: "15px",
    fontFamily: "sans-serif",
    textTransform: "uppercase",
    outline: 0,
    width: "100%",
    background: "#4CAF50",
    border: 0,
    padding: "15px",
    color: "#FFFFFF",
    fontSize: "14px",
    transition: "all 0.3 ease",
    cursor: "pointer",
};

const TitleStyle = {
    margin: "0 0 15px",
};

const messageStyle = {
    margin: "0 0 15px",
    color: "#b3b3b3",
    fontSize: "12px",
};

const RouteCalculator = (): JSX.Element => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [answer, setAnswer] = useState(null);

    const onSubmit = (data: any) => {
        setAnswer(data);
        // TODO do submit.
    };

    return <form style={formStyle} onSubmit={handleSubmit(onSubmit)}>
        <h1 style={TitleStyle}>City route</h1>

        <label htmlFor="City1">Choose starting city:</label><br />
        <select id="City1" {...register("City1")}>
            <option value="volvo">Volvo</option>
            {
                // TODO add all city names 
            }
        </select><br />
        {errors.City1 && <><span style={messageStyle}>City1 is required</span><br /></>}
        
        <label htmlFor="City2">Choose starting city:</label><br />
        <select id="City2" {...register("City2")}>
            <option value="volvo">Volvo</option>
            {
                // TODO add all city names 
            }
        </select><br />
        {errors.City2 && <><span style={messageStyle}>City2 is required</span><br /></>}

        <input style={submitStyle} type="submit" />

        {answer ? <>
            <p>{answer["City1"]}</p>
            <p>{answer["City2"]}</p>
            <p>{JSON.stringify(answer)}</p>
        </> : null}
    </form>;
};

export default RouteCalculator;
