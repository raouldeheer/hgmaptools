import {
    FieldValues,
    FieldErrors,
    useForm,
    SubmitHandler,
    Control,
    Controller,
} from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";

const SelectBox = ({
    name,
    label,
    options,
    errors,
    control,
}: {
    name: string;
    label: string;
    options: string[];
    errors: FieldErrors;
    control: Control<FieldValues, any>,
}): JSX.Element => (
    <>
        <Controller
            name={label}
            control={control}
            defaultValue={options[0]}
            rules={{ required: true, validate: v => options.includes(v) }}
            render={({ field: { ref, onChange, ...field } }) => (
                <Autocomplete
                    options={options}
                    onChange={(_, data) => onChange(data)}
                    defaultValue={options[0]}
                    fullWidth
                    renderInput={(params) =>
                        <TextField
                            {...params}
                            {...field}
                            inputRef={ref}
                            label={name}
                        />
                    }
                />
            )}
        />
        {errors[label] && (
            <>
                <span className="message">
                    {name.charAt(0).toUpperCase() + name.slice(1)} is required
                </span>
            </>
        )}
        <br />
    </>
);

export const CustomForm = ({
    selectBoxes,
    onSubmit,
}: {
    selectBoxes: [string, string, string[]][];
    onSubmit: SubmitHandler<FieldValues>;
}): JSX.Element => {
    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm();
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                {selectBoxes.map(box => (
                    <SelectBox
                        key={box[0]}
                        name={box[0]}
                        label={box[1]}
                        options={box[2]}
                        errors={errors}
                        control={control}
                    />
                ))}
                <input className="submit" type="submit" />
            </form>
        </>
    );
};
