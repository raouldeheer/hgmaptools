import { useEffect, useState } from "react";

const RoutePoint = ({ id }: { id: string }): JSX.Element => {
    const [name, setName] = useState("");

    useEffect(() => {
        fetch(`https://hgwarmap.dphs.nl/api/battlefield/${id}.json`)
            .then(data => data.json())
            .then(data => {
                if (data?.bftitle) setName(data.bftitle);
            });
    }, [id]);

    return <li>{name}</li>;
};

export default RoutePoint;
