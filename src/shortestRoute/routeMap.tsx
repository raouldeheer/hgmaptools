import image from "hagcp-assets/images/background.webp";
import { RouteResult } from "./routeCalculator";
import { Layer, Stage } from "react-konva";
import MapPoint from "./MapPoint";
import MapLine from "./MapLine";
import { useRef } from "react";
import FetchManager from "../fetchManager";

export interface Battlefield {
    id: string;
    mapid: string;
    bftitle: string;
    sector: string;
    posx: number;
    posy: number;
    gamemap: string;
}

export const totalWidth = 16384;
export const totalHeight = 11520;

const RouteMap = ({ answer, fetchManager }: { answer: RouteResult | null, fetchManager: FetchManager; }): JSX.Element => {
    const ref = useRef<HTMLImageElement>(null);

    const points = [];
    const lines = [];
    if (answer) {
        for (let prev = null, i = 0; i < answer.path.length; i++) {
            const element = answer.path[i];
            points.push(<MapPoint imageRef={ref} id={element} key={element} fetchManager={fetchManager} />);
            if (prev)
                lines.push(
                    <MapLine
                        imageRef={ref}
                        id1={prev}
                        id2={element}
                        key={prev + element}
                        fetchManager={fetchManager}
                    />,
                );
            prev = element;
        }
    }

    return (
        <div className="routeMap">
            <img ref={ref} src={image} className="image" alt="background map" />
            <Stage
                className="image"
                width={ref.current?.width}
                height={ref.current?.height}
                listening={false}
            >
                <Layer listening={false}>
                    {lines}
                    {points}
                </Layer>
            </Stage>
        </div>
    );
};

export default RouteMap;
