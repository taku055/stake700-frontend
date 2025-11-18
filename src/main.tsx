import { render } from "preact";
import "./styles/index.css";
import "./styles/globals.scss";
import { App } from "./app.tsx";

render(<App />, document.getElementById("app")!);
