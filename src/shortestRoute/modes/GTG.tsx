import React, { FC, memo } from "react";
import { useApiFetch } from "../../api";
import { CustomForm } from "../formUtils";
import { groundATs, RouteResult } from "../routeCalculator";
import battlefields from "./json/battlefields.json";

interface Props {
    setAnswer: React.Dispatch<React.SetStateAction<RouteResult | null>>
    setATType: React.Dispatch<React.SetStateAction<string | null>>
}

const GTG: FC<Props> = ({
    setAnswer,
    setATType,
}) => {
    const apiFetch = useApiFetch();
    const onSubmit = async (data: any) => {
        setATType(data.unit);
        setAnswer(
            await apiFetch<RouteResult>(
                `/api/battlefieldroute?bftitle1=${data.bftitle1}&bftitle2=${data.bftitle2}`,
            ),
        );
    };

    return <CustomForm
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
    />;
};

export default memo(GTG);
