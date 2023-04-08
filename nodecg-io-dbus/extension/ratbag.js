"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatBagLed = exports.RatBagButton = exports.RatBagResolution = exports.RatBagProfile = exports.RatBagDevice = exports.RatBagManager = void 0;
const dbusClient_1 = require("./dbusClient");
const dbus_next_1 = require("dbus-next");
/**
 * Access to ratbagd.
 */
class RatBagManager extends dbusClient_1.DBusObject {
    constructor(client, proxy) {
        super(client, proxy);
    }
    /**
     * Gets the API version of ratbagd. This is built for API 1. Everything else might not work as intended.
     */
    async api() {
        return (await this.getProperty("org.freedesktop.ratbag1.Manager", "APIVersion")).value;
    }
    /**
     * Gets a list of all currently connected devices.
     */
    async devices() {
        const variant = await this.getProperty("org.freedesktop.ratbag1.Manager", "Devices");
        const paths = variant.value;
        const devices = [];
        for (const path of paths) {
            const proxy = await this.proxy.bus.getProxyObject("org.freedesktop.ratbag1", path);
            devices.push(new RatBagDevice(this.client, proxy));
        }
        return devices;
    }
}
RatBagManager.PROXY = {
    iface: "org.freedesktop.ratbag1",
    path: "/org/freedesktop/ratbag1",
    system: true,
    create(client, proxy) {
        return new RatBagManager(client, proxy);
    },
};
exports.RatBagManager = RatBagManager;
/**
 * A device, ratbagd can control.
 */
class RatBagDevice extends dbusClient_1.DBusObject {
    constructor(client, proxy) {
        super(client, proxy);
        this.device = proxy.getInterface("org.freedesktop.ratbag1.Device");
    }
    /**
     * Gets the device name.
     */
    async name() {
        return (await this.getProperty("org.freedesktop.ratbag1.Device", "Name")).value;
    }
    /**
     * Gets the device model
     */
    async model() {
        let modelString = (await this.getProperty("org.freedesktop.ratbag1.Device", "Model")).value;
        try {
            const busType = modelString.substring(0, modelString.indexOf(":"));
            modelString = modelString.substring(modelString.indexOf(":") + 1);
            if (busType !== "usb" && busType !== "bluetooth") {
                // We don't know about that bus type.
                return { busType: "unknown" };
            }
            const vendorHex = modelString.substring(0, modelString.indexOf(":"));
            modelString = modelString.substring(modelString.indexOf(":") + 1);
            const productHex = modelString.substring(0, modelString.indexOf(":"));
            modelString = modelString.substring(modelString.indexOf(":") + 1);
            const vendorId = parseInt(vendorHex, 16);
            const productId = parseInt(productHex, 16);
            const version = parseInt(modelString);
            if (isNaN(vendorId) || isNaN(productId) || isNaN(version)) {
                return { busType: "unknown" };
            }
            return {
                busType: busType,
                vendorHex: vendorHex,
                vendorId: vendorId,
                productHex: productHex,
                productId: productId,
                version: version,
            };
        }
        catch (err) {
            return { busType: "unknown" };
        }
    }
    /**
     * Gets a list of profiles for that device. If a device does not support multiple profiles,
     * there'll be just one profile in the list that can be used.
     */
    async profiles() {
        const variant = await this.getProperty("org.freedesktop.ratbag1.Device", "Profiles");
        const paths = variant.value;
        const profiles = [];
        for (const path of paths) {
            const proxy = await this.proxy.bus.getProxyObject("org.freedesktop.ratbag1", path);
            profiles.push(new RatBagProfile(this.client, proxy));
        }
        return profiles;
    }
    /**
     * Writes all changes that were made to the device.
     */
    async commit() {
        await this.device.Commit();
    }
    /**
     * Adds a listener for an event, when committing to the device fails.
     */
    on(event, handler) {
        this.device.on(event, handler);
    }
    once(event, handler) {
        this.device.once(event, handler);
    }
    off(event, handler) {
        this.device.off(event, handler);
    }
}
exports.RatBagDevice = RatBagDevice;
/**
 * A profile for a ratbagd device.
 */
class RatBagProfile extends dbusClient_1.DBusObject {
    constructor(client, proxy) {
        super(client, proxy);
        this.profile = proxy.getInterface("org.freedesktop.ratbag1.Profile");
    }
    /**
     * Gets the index of the profile.
     */
    async index() {
        return (await this.getProperty("org.freedesktop.ratbag1.Profile", "Index")).value;
    }
    /**
     * Gets the name of the profile, if the device supports profile naming.
     */
    async name() {
        const name = (await this.getProperty("org.freedesktop.ratbag1.Profile", "Name")).value;
        return name === "" ? undefined : name;
    }
    /**
     * Sets the name of a profile. This must not be called if the device does not support profile naming.
     * Use {@link name()} first, to find out whether you can use this.
     */
    async setName(name) {
        await this.setProperty("org.freedesktop.ratbag1.Profile", "Name", new dbus_next_1.Variant("s", name));
    }
    /**
     * Gets whether the profile is enabled. A disabled profile may have invalid values set, so you should
     * check these values before enabling a profile.
     */
    async enabled() {
        return (await this.getProperty("org.freedesktop.ratbag1.Profile", "Enabled")).value;
    }
    /**
     * Enables this profile.
     */
    async enable() {
        await this.setProperty("org.freedesktop.ratbag1.Profile", "Enabled", new dbus_next_1.Variant("b", true));
    }
    /**
     * Disables this profile.
     */
    async disable() {
        await this.setProperty("org.freedesktop.ratbag1.Profile", "Enabled", new dbus_next_1.Variant("b", false));
    }
    /**
     * Gets whether this profile is currently active. There is always only one active profile.
     */
    async active() {
        return (await this.getProperty("org.freedesktop.ratbag1.Profile", "IsActive")).value;
    }
    /**
     * Activates this profile. The currently active profile will be deactivated.
     */
    async activate() {
        return await this.profile.SetActive();
    }
    /**
     * Gets a list of display resolutions, that can be switched through.
     */
    async resolutions() {
        const variant = await this.getProperty("org.freedesktop.ratbag1.Profile", "Resolutions");
        const paths = variant.value;
        const resolutions = [];
        for (const path of paths) {
            const proxy = await this.proxy.bus.getProxyObject("org.freedesktop.ratbag1", path);
            resolutions.push(new RatBagResolution(this.client, proxy));
        }
        return resolutions;
    }
    /**
     * Gets a list of buttons on the device for this profile.
     */
    async buttons() {
        const variant = await this.getProperty("org.freedesktop.ratbag1.Profile", "Buttons");
        const paths = variant.value;
        const buttons = [];
        for (const path of paths) {
            const proxy = await this.proxy.bus.getProxyObject("org.freedesktop.ratbag1", path);
            buttons.push(new RatBagButton(this.client, proxy));
        }
        return buttons;
    }
    /**
     * Gets a list of leds on the device for this profile.
     */
    async leds() {
        const variant = await this.getProperty("org.freedesktop.ratbag1.Profile", "Leds");
        const paths = variant.value;
        const leds = [];
        for (const path of paths) {
            const proxy = await this.proxy.bus.getProxyObject("org.freedesktop.ratbag1", path);
            leds.push(new RatBagLed(this.client, proxy));
        }
        return leds;
    }
}
exports.RatBagProfile = RatBagProfile;
/**
 * A resolution profile for a device profile.
 */
class RatBagResolution extends dbusClient_1.DBusObject {
    constructor(client, proxy) {
        super(client, proxy);
        this.resolution = proxy.getInterface("org.freedesktop.ratbag1.Resolution");
    }
    /**
     * Gets the index of this resolution profile.
     */
    async index() {
        return (await this.getProperty("org.freedesktop.ratbag1.Resolution", "Index")).value;
    }
    /**
     * Gets whether this resolution profile is the currently active resolution.
     */
    async active() {
        return (await this.getProperty("org.freedesktop.ratbag1.Resolution", "IsActive")).value;
    }
    /**
     * Gets whether this resolution profile is the default.
     */
    async default() {
        return (await this.getProperty("org.freedesktop.ratbag1.Resolution", "IsDefault")).value;
    }
    /**
     * Sets this resolution profile as the currently active resolution.
     */
    async activate() {
        await this.resolution.SetActive();
    }
    /**
     * Sets this resolution profile as default.
     */
    async setDefault() {
        await this.resolution.SetDefault();
    }
    /**
     * Gets the dpi values for this profile.
     */
    async dpi() {
        const dpi = (await this.getProperty("org.freedesktop.ratbag1.Resolution", "Resolution")).value;
        if (typeof dpi === "number") {
            return dpi;
        }
        else {
            return {
                x: dpi[0],
                y: dpi[1],
            };
        }
    }
    /**
     * Sets the dpi for this profile. If {@link dpi()} returns a single value, this must also be set to a single value.
     * If {@link dpi()} returns separate x and y values, this must be set to separate x and y values.
     */
    async setDpi(dpi) {
        const variant = typeof dpi === "number"
            ? new dbus_next_1.Variant("u", dpi)
            : new dbus_next_1.Variant("(uu)", [dpi.x, dpi.y]);
        await this.setProperty("org.freedesktop.ratbag1.Resolution", "Resolution", variant);
    }
    /**
     * Gets a list of numbers that can be used as dpi values.
     */
    async allowedDpiValues() {
        return (await this.getProperty("org.freedesktop.ratbag1.Resolution", "Resolutions")).value;
    }
}
exports.RatBagResolution = RatBagResolution;
/**
 * A button on a device for a specific profile
 */
class RatBagButton extends dbusClient_1.DBusObject {
    constructor(client, proxy) {
        super(client, proxy);
    }
    /**
     * Gets the index of this button.
     */
    async index() {
        return (await this.getProperty("org.freedesktop.ratbag1.Button", "Index")).value;
    }
    /**
     * Gets the action currently bound to this button.
     */
    async mapping() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = (await this.getProperty("org.freedesktop.ratbag1.Button", "Mapping")).value;
        if (raw[0] === 0) {
            return {
                type: "none",
            };
        }
        else if (raw[0] === 1) {
            return {
                type: "button",
                button: raw[1].value,
            };
        }
        else if (raw[0] === 2) {
            const id = Object.keys(RatBagButton.SPECIAL_ACTION_MAP).find((key) => RatBagButton.SPECIAL_ACTION_MAP[key] === raw[1].value);
            return {
                type: "special",
                action: id === undefined ? "unknown" : id,
            };
        }
        else if (raw[0] === 3) {
            const macro = [];
            for (const entry of raw[1].value) {
                macro.push({
                    type: entry[0] === 0 ? "release" : "press",
                    keyCode: entry[1],
                });
            }
            return {
                type: "macro",
                macro: macro,
            };
        }
        else {
            return {
                type: "unknown",
            };
        }
    }
    /**
     * Binds this button to the given action.
     */
    async setMapping(mapping) {
        let id = 1000;
        let variant = new dbus_next_1.Variant("u", 0);
        if (mapping.type === "none") {
            id = 1000;
            variant = new dbus_next_1.Variant("u", 0);
        }
        else if (mapping.type === "button") {
            id = 1;
            variant = new dbus_next_1.Variant("u", mapping.button);
        }
        else if (mapping.type === "special") {
            id = 2;
            const func = RatBagButton.SPECIAL_ACTION_MAP[mapping.action];
            variant = new dbus_next_1.Variant("u", func === undefined ? 0x40000000 : func);
        }
        else if (mapping.type === "macro") {
            id = 3;
            const actions = [];
            for (const action of mapping.macro) {
                actions.push([action.type === "press" ? 1 : 0, action.keyCode]);
            }
            variant = new dbus_next_1.Variant("a(uu)", actions);
        }
        await this.setProperty("org.freedesktop.ratbag1.Button", "Mapping", new dbus_next_1.Variant("(uv)", [id, variant]));
    }
}
RatBagButton.SPECIAL_ACTION_MAP = {
    "unknown": 0x40000000,
    "doubleclick": 0x40000001,
    "wheel left": 0x40000002,
    "wheel right": 0x40000003,
    "wheel up": 0x40000004,
    "wheel down": 0x40000005,
    "ratched mode switch": 0x40000006,
    "resolution cycle up": 0x40000007,
    "resolution cycle down": 0x40000008,
    "resolution up": 0x40000009,
    "resolution down": 0x4000000a,
    "resolution alternate": 0x4000000b,
    "resolution default": 0x4000000c,
    "profile cycle up": 0x4000000d,
    "profile cycle down": 0x4000000e,
    "profile up": 0x4000000f,
    "profile down": 0x40000010,
    "second mode": 0x40000011,
    "battery level": 0x40000012,
};
exports.RatBagButton = RatBagButton;
/**
 * A led on a device for a specific profile
 */
class RatBagLed extends dbusClient_1.DBusObject {
    constructor(client, proxy) {
        super(client, proxy);
    }
    /**
     * Gets the index for this led.
     */
    async index() {
        return (await this.getProperty("org.freedesktop.ratbag1.Led", "Index")).value;
    }
    /**
     * Gets the current mode of the led.
     */
    async mode() {
        const modeId = (await this.getProperty("org.freedesktop.ratbag1.Led", "Mode")).value;
        switch (modeId) {
            case 1:
                return "on";
            case 2:
                return "cycle";
            case 3:
                return "breath";
            default:
                return "off";
        }
    }
    /**
     * Sets the mode of the led.
     */
    async setMode(mode) {
        let modeId = 0;
        if (mode === "on") {
            modeId = 1;
        }
        else if (mode === "cycle") {
            modeId = 2;
        }
        else if (mode === "breath") {
            modeId = 3;
        }
        await this.setProperty("org.freedesktop.ratbag1.Led", "Mode", new dbus_next_1.Variant("u", modeId));
    }
    /**
     * Gets a list of supported led modes.
     */
    async supportedModes() {
        const modeIds = (await this.getProperty("org.freedesktop.ratbag1.Led", "Mode")).value;
        const modes = [];
        for (const modeId of modeIds) {
            switch (modeId) {
                case 0:
                    modes.push("off");
                    break;
                case 1:
                    modes.push("on");
                    break;
                case 2:
                    modes.push("cycle");
                    break;
                case 3:
                    modes.push("breath");
                    break;
            }
        }
        return modes;
    }
    /**
     * Gets the color, the led is currently in.
     */
    async color() {
        const color = (await this.getProperty("org.freedesktop.ratbag1.Led", "Color")).value;
        return {
            color: ((color[0] & 0xff) << 16) | ((color[1] & 0xff) << 8) | (color[2] & 0xff),
            red: color[0] & 0xff,
            green: color[1] & 0xff,
            blue: color[2] & 0xff,
        };
    }
    /**
     * Sets the color for the led.
     */
    async setColor(color) {
        let value;
        if ("color" in color) {
            value = [(color.color >> 16) & 0xff, (color.color >> 8) & 0xff, color.color & 0xff];
        }
        else {
            value = [color.red, color.green, color.blue];
        }
        await this.setProperty("org.freedesktop.ratbag1.Led", "Color", new dbus_next_1.Variant("(uuu)", value));
    }
    /**
     * Gets the current effect duration in milliseconds. What exactly this means depends on the led mode.
     */
    async effectDuration() {
        return (await this.getProperty("org.freedesktop.ratbag1.Led", "EffectDuration")).value;
    }
    /**
     * Sets the current effect duration in milliseconds.
     */
    async setEffectDuration(millis) {
        await this.setProperty("org.freedesktop.ratbag1.Led", "EffectDuration", new dbus_next_1.Variant("u", millis));
    }
    /**
     * Gets the current led brightness [0;255]
     */
    async brightness() {
        return (await this.getProperty("org.freedesktop.ratbag1.Led", "Brightness")).value & 0xff;
    }
    /**
     * Sets the current led brightness [0;255]
     */
    async setBrightness(brightness) {
        await this.setProperty("org.freedesktop.ratbag1.Led", "Brightness", new dbus_next_1.Variant("u", brightness & 0xff));
    }
}
exports.RatBagLed = RatBagLed;
//# sourceMappingURL=ratbag.js.map