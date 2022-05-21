import { render, screen } from "@testing-library/react";
import App from "./App";
import { createApiFetch } from "./api";

test("renders learn react link", () => {
    const apiFetch = createApiFetch("https://hgwarmap.dphs.nl");
    render(<App apiFetch={apiFetch} />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});
