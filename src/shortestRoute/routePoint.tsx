import { useEffect, useState } from "react";
import { useApiFetch } from "../api";

const RoutePoint = ({
    id,
}: {
    id: string;
}): JSX.Element => {
    const apiFetch = useApiFetch();
    const [name, setName] = useState("");

    useEffect(() => {
        apiFetch<{ bftitle: string }>(`/api/battlefield/${id}.json`).then(
            data => {
                if (data?.bftitle) setName(data.bftitle);
            },
        );
    }, [id, apiFetch]);

    return <li>{name}</li>;
};

export default RoutePoint;
