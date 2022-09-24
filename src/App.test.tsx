import { render } from "@testing-library/react";
import App from "./App";
import { apiContext, createApiFetch } from "./api";

test("renders learn react link", () => {
    const apiFetch = createApiFetch("https://hgwarmap.dphs.nl");
    render(
        <apiContext.Provider value={apiFetch}>
            <App />
        </apiContext.Provider>
    );
});
