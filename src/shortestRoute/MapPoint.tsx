import { useEffect, useState } from "react";
import { Circle } from "react-konva";
import FetchManager from "../fetchManager";
import { Battlefield, totalHeight, totalWidth } from "./routeMap";

const MapPoint = ({
    imageRef,
    id,
    fetchManager,
}: {
    imageRef: React.RefObject<HTMLImageElement>;
    id: string;
    fetchManager: FetchManager;
}): JSX.Element => {
    const [data, setData] = useState<Battlefield | null>(null);

    useEffect(() => {
        fetchManager.fetch<Battlefield>(`https://hgwarmap.dphs.nl/api/battlefield/${id}.json`)
            .then(data => {
                if (data) setData(data);
            });
    }, [id, fetchManager]);

    return (
        <>
            {data ? (
                <Circle
                    key={id}
                    x={
                        data.posx *
                        ((imageRef.current?.width || 0) / totalWidth)
                    }
                    y={
                        data.posy *
                        ((imageRef.current?.height || 0) / totalHeight)
                    }
                    radius={30 * ((imageRef.current?.width || 0) / totalWidth)}
                    fill="Black"
                />
            ) : null}
        </>
    );
};

export default MapPoint;
