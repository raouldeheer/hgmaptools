import { render, screen } from "@testing-library/react";
import App from "./App";
import FetchManager from "./fetchManager";

test("renders learn react link", () => {
    const fetchManager = new FetchManager();
    render(<App fetchManager={fetchManager} />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});
