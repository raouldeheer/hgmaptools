import { useEffect, useState } from "react";
import FetchManager from "../fetchManager";

const RoutePoint = ({ id, fetchManager }: { id: string, fetchManager: FetchManager; }): JSX.Element => {
    const [name, setName] = useState("");

    useEffect(() => {
        fetchManager.fetch<{ bftitle: string; }>(`https://hgwarmap.dphs.nl/api/battlefield/${id}.json`)
            .then(data => {
                if (data?.bftitle) setName(data.bftitle);
            });
    }, [id, fetchManager]);

    return <li>{name}</li>;
};

export default RoutePoint;
