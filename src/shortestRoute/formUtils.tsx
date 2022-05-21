import {
    FieldValues,
    UseFormRegister,
    FieldErrors,
    useForm,
    SubmitHandler,
} from "react-hook-form";

const SelectBox = ({
    name,
    label,
    options,
    register,
    errors,
}: {
    name: string;
    label: string;
    options: string[];
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
}): JSX.Element => (
    <>
        <label htmlFor={label}>Choose {name}:</label>
        <br />
        <select className="input" id={label} {...register(label)}>
            {options.map(title => (
                <option key={title} value={title}>
                    {title}
                </option>
            ))}
        </select>
        <br />
        {errors[label] && (
            <>
                <span className="message">
                    {name.charAt(0).toUpperCase() + name.slice(1)} is required
                </span>
                <br />
            </>
        )}
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
        register,
        handleSubmit,
        formState: { errors },
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
                        register={register}
                        errors={errors}
                    />
                ))}
                <input className="submit" type="submit" />
            </form>
        </>
    );
};
