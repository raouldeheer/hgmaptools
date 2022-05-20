import { useEffect, useState } from "react";
import { Line } from "react-konva";
import { Battlefield, totalHeight, totalWidth } from "./routeMap";

const MapLine = ({
    imageRef,
    id1,
    id2,
}: {
    imageRef: React.RefObject<HTMLImageElement>;
    id1: string;
    id2: string;
}): JSX.Element => {
    const [data1, setData1] = useState<Battlefield | null>(null);
    const [data2, setData2] = useState<Battlefield | null>(null);

    useEffect(() => {
        fetch(`https://hgwarmap.dphs.nl/api/battlefield/${id1}.json`)
            .then(data => data.json())
            .then(data => {
                if (data) setData1(data);
            });
        fetch(`https://hgwarmap.dphs.nl/api/battlefield/${id2}.json`)
            .then(data => data.json())
            .then(data => {
                if (data) setData2(data);
            });
    }, [id1, id2]);

    return (
        <>
            {data1 && data2 ? (
                <Line
                    key={id1 + id2}
                    points={[
                        data1.posx *
                            ((imageRef.current?.width || 0) / totalWidth),
                        data1.posy *
                            ((imageRef.current?.height || 0) / totalHeight),
                        data2.posx *
                            ((imageRef.current?.width || 0) / totalWidth),
                        data2.posy *
                            ((imageRef.current?.height || 0) / totalHeight),
                    ]}
                    stroke="Black"
                    strokeWidth={
                        16 * ((imageRef.current?.width || 0) / totalWidth)
                    }
                />
            ) : null}
        </>
    );
};

export default MapLine;
