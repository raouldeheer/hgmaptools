import React, { FC, memo } from "react";
import { useApiFetch } from "../../api";
import { CustomForm } from "../formUtils";
import { airATs, RouteResult } from "../routeCalculator";
import airfields from "./json/airfields.json";

interface Props {
    setAnswer: React.Dispatch<React.SetStateAction<RouteResult | null>>
    setATType: React.Dispatch<React.SetStateAction<string | null>>
}

const ATA: FC<Props> = ({
    setAnswer,
    setATType,
}) => {
    const apiFetch = useApiFetch();
    const onSubmit = async (data: any) => {
        setATType(data.unit);
        setAnswer(
            await apiFetch<RouteResult>(
                `/api/planeroute?bftitle1=${data.bftitle1}&bftitle2=${data.bftitle2
                }&distance=${airATs.get(data.unit)?.transportradius}`,
            ),
        );
    };

    return <CustomForm
        selectBoxes={[
            ["starting airfield", "bftitle1", airfields],
            ["destination airfield", "bftitle2", airfields],
            [
                "assault team type",
                "unit",
                Array.from(airATs.keys()),
            ],
        ]}
        onSubmit={onSubmit}
    />;
};

export default memo(ATA);
