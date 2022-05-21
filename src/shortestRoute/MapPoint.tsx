import { useEffect, useState } from "react";
import { Circle } from "react-konva";
import { Battlefield, totalHeight, totalWidth } from "./routeMap";

const MapPoint = ({
    imageRef,
    id,
    apiFetch,
}: {
    imageRef: React.RefObject<HTMLImageElement>;
    id: string;
    apiFetch: <T>(endpoint: string) => Promise<T | null>;
}): JSX.Element => {
    const [data, setData] = useState<Battlefield | null>(null);

    useEffect(() => {
        apiFetch<Battlefield>(`/api/battlefield/${id}.json`).then(data => {
            if (data) setData(data);
        });
    }, [id, apiFetch]);

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
