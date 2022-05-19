import { useEffect, useState } from "react";
import { Circle } from "react-konva";
import { Battlefield, totalHeight, totalWidth } from "./routeMap";

const MapPoint = ({ imageRef, id }: { imageRef: React.RefObject<HTMLImageElement>, id: string; }): JSX.Element => {
    const [data, setData] = useState<Battlefield | null>(null);

    useEffect(() => {
        fetch(`https://hgwarmap.dphs.nl/api/battlefield/${id}.json`)
            .then(data => data.json())
            .then(data => {
                if (data) setData(data);
            });
    }, [id]);

    return <>
        {data ? <Circle
            key={id}
            x={data.posx * ((imageRef.current?.width || 0) / totalWidth)}
            y={data.posy * ((imageRef.current?.height || 0) / totalHeight)}
            radius={30 * ((imageRef.current?.width || 0) / totalWidth)}
            fill="Black"
        /> : null}
    </>;
};

export default MapPoint;
