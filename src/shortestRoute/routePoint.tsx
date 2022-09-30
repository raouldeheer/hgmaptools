import { ListItem, ListItemText, ListItemIcon } from "@mui/material";
import LocationCityIcon from '@mui/icons-material/LocationCity';
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
        apiFetch<{ bftitle: string; }>(`/api/battlefield/${id}.json`).then(
            data => {
                if (data?.bftitle) setName(data.bftitle);
            },
        );
    }, [id, apiFetch]);

    return <ListItem>
        <ListItemIcon>
            <LocationCityIcon />
        </ListItemIcon>
        <ListItemText primary={name} />
    </ListItem>;
};

export default RoutePoint;
