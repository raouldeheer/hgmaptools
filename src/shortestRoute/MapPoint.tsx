import { Ref, useEffect, useState } from "react";
import { Circle } from "react-konva";
import { Battlefield, totalHeight, totalWidth } from "./routeMap";



const MapPoint = ({ imageRef, id }: { imageRef: React.RefObject<HTMLImageElement>, id: string; }): JSX.Element => {
    const [data, setData] = useState<Battlefield | null>(null);

    useEffect(() => {
        fetch(`https://hgwarmap.dphs.nl/api/battlefield?id=${id}`)
            .then(data => data.json())
            .then(data => {
                if (data) setData(data);
            });
    }, [id]);


    return <>
        {data ? <Circle
            x={data.posx * ((imageRef.current?.width || 0) / totalWidth)}
            y={data.posy * ((imageRef.current?.height || 0) / totalHeight)}
            radius={30 * ((imageRef.current?.width || 0) / totalWidth)}
            fill="Black"
        /> : null}
    </>;
};

export default MapPoint;
