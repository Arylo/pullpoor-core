import findUp = require("find-up");
import { dirname } from "path";

export const rootPath = dirname(findUp.sync("package.json"));
