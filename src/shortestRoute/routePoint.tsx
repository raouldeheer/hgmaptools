import { useEffect, useState } from "react";

const RoutePoint = ({
    id,
    apiFetch,
}: {
    id: string;
    apiFetch: <T>(endpoint: string) => Promise<T | null>;
}): JSX.Element => {
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
