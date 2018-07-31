import * as express from "express";
import { AddressInfo } from "net";

const app = express();

const routes = {
    html: express.Router(),
    json: express.Router()
};

routes.json.get("/normal", (req, res) => {
    res.send(JSON.stringify({
        list: [
            "http://example.com",
            "https://example.com"
        ]
    }));
});

routes.json.get("/complex/0", (req, res) => {
    res.send(JSON.stringify({
        list: [[
            "http://example.com",
            "https://example.com"
        ]]
    }));
});

routes.json.get("/complex/1", (req, res) => {
    res.send(JSON.stringify({
        list: [
            {
                arr: {
                    set: [
                        "http://example.com",
                        "https://example.com"
                    ]
                }
            }
        ]
    }));
});

for (const key of Object.keys(routes)) {
    app.use("/" + key, routes[key]);
}

export const address = app
    .listen(7000 + parseInt(`${Math.random() * 3000}`, 10))
    .address() as AddressInfo;
