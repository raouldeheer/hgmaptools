import React, { FC, memo } from "react";
import { CustomForm } from "../formUtils";
import { airATs, RouteResult } from "../routeCalculator";
import battlefields from "./json/battlefields.json";
import airfields from "./json/airfields.json";
import { useApiFetch } from "../../api";

interface Props {
    setAnswer: React.Dispatch<React.SetStateAction<RouteResult | null>>
    setATType: React.Dispatch<React.SetStateAction<string | null>>
}

const ATG: FC<Props> = ({
    setAnswer,
    setATType,
}) => {
    const apiFetch = useApiFetch();
    const onSubmit = async (data: any) => {
        setATType(data.unit);
        setAnswer(
            await apiFetch<RouteResult>(
                `/api/battlefieldseparation?bftitle1=${data.bftitle1}&bftitle2=${data.bftitle2}`,
            ),
        );
    };

    return <CustomForm
        selectBoxes={[
            ["starting airfield", "bftitle1", airfields],
            ["destination city", "bftitle2", battlefields],
            [
                "assault team type",
                "unit",
                Array.from(airATs.keys()),
            ],
        ]}
        onSubmit={onSubmit}
    />;
};

export default memo(ATG);
