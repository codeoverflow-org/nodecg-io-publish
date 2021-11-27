/// <reference types="nodecg-types/types/browser" />
import { __awaiter } from "tslib";
import { updateMonacoLayout } from "./serviceInstance";
import { setPassword, isPasswordSet } from "./crypto";
// HTML elements
const spanLoaded = document.getElementById("spanLoaded");
const inputPassword = document.getElementById("inputPassword");
const divAuth = document.getElementById("divAuth");
const divMain = document.getElementById("divMain");
const spanPasswordNotice = document.getElementById("spanPasswordNotice");
const pFirstStartup = document.getElementById("pFirstStartup");
// Add key listener to password input
inputPassword === null || inputPassword === void 0 ? void 0 : inputPassword.addEventListener("keyup", function (event) {
    if (event.keyCode === 13 || event.key === "Enter") {
        event.preventDefault();
        loadFramework();
    }
});
// Handler for when the socket.io client re-connects which is usually a nodecg restart.
nodecg.socket.on("connect", () => {
    // Give nodecg 200ms to fully connect so everything is usable.
    setTimeout(() => {
        // If a password has been entered previously try to directly login using it.
        if (inputPassword.value !== "") {
            loadFramework();
        }
        else {
            updateLoadedStatus();
            updateFirstStartupLabel();
        }
    }, 200);
});
document.addEventListener("DOMContentLoaded", () => {
    // Render loaded status for initial load
    updateLoadedStatus();
    updateFirstStartupLabel();
});
export function isLoaded() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, _reject) => {
            nodecg.sendMessage("isLoaded", (_err, res) => resolve(res));
            setTimeout(() => resolve(false), 5000); // Fallback in case connection gets lost.
        });
    });
}
function updateLoadedStatus() {
    return __awaiter(this, void 0, void 0, function* () {
        const loaded = yield isLoaded();
        if (loaded) {
            spanLoaded.innerText = "Loaded";
        }
        else {
            spanLoaded.innerText = "Not loaded";
        }
        const loggedIn = loaded && isPasswordSet();
        if (loggedIn) {
            divAuth === null || divAuth === void 0 ? void 0 : divAuth.classList.add("hidden");
            divMain === null || divMain === void 0 ? void 0 : divMain.classList.remove("hidden");
            updateMonacoLayout();
        }
        else {
            divAuth === null || divAuth === void 0 ? void 0 : divAuth.classList.remove("hidden");
            divMain === null || divMain === void 0 ? void 0 : divMain.classList.add("hidden");
        }
    });
}
export function loadFramework() {
    return __awaiter(this, void 0, void 0, function* () {
        const password = inputPassword.value;
        if (yield setPassword(password)) {
            spanPasswordNotice.innerText = "";
        }
        else {
            spanPasswordNotice.innerText = "The provided password isn't correct!";
            inputPassword.value = "";
        }
        updateLoadedStatus();
    });
}
function updateFirstStartupLabel() {
    return __awaiter(this, void 0, void 0, function* () {
        const isFirstStartup = yield nodecg.sendMessage("isFirstStartup");
        if (isFirstStartup) {
            pFirstStartup === null || pFirstStartup === void 0 ? void 0 : pFirstStartup.classList.remove("hidden");
        }
        else {
            pFirstStartup === null || pFirstStartup === void 0 ? void 0 : pFirstStartup.classList.add("hidden");
        }
    });
}
//# sourceMappingURL=authentication.js.map