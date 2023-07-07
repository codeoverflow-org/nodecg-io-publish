import { DBusClient, DBusProxyConfig, DBusObject } from "./dbusClient";
import { ProxyObject } from "dbus-next";
/**
 * Access to ratbagd.
 */
export declare class RatBagManager extends DBusObject {
    static readonly PROXY: DBusProxyConfig<RatBagManager>;
    constructor(client: DBusClient, proxy: ProxyObject);
    /**
     * Gets the API version of ratbagd. This is built for API 1. Everything else might not work as intended.
     */
    api(): Promise<number>;
    /**
     * Gets a list of all currently connected devices.
     */
    devices(): Promise<RatBagDevice[]>;
}
/**
 * A device, ratbagd can control.
 */
export declare class RatBagDevice extends DBusObject {
    private readonly device;
    constructor(client: DBusClient, proxy: ProxyObject);
    /**
     * Gets the device name.
     */
    name(): Promise<string>;
    /**
     * Gets the device model
     */
    model(): Promise<RatBagModel>;
    /**
     * Gets a list of profiles for that device. If a device does not support multiple profiles,
     * there'll be just one profile in the list that can be used.
     */
    profiles(): Promise<RatBagProfile[]>;
    /**
     * Writes all changes that were made to the device.
     */
    commit(): Promise<void>;
    /**
     * Adds a listener for an event, when committing to the device fails.
     */
    on(event: "Resync", handler: () => void): void;
    once(event: "Resync", handler: () => void): void;
    off(event: "Resync", handler: () => void): void;
}
/**
 * A profile for a ratbagd device.
 */
export declare class RatBagProfile extends DBusObject {
    private readonly profile;
    constructor(client: DBusClient, proxy: ProxyObject);
    /**
     * Gets the index of the profile.
     */
    index(): Promise<number>;
    /**
     * Gets the name of the profile, if the device supports profile naming.
     */
    name(): Promise<string | undefined>;
    /**
     * Sets the name of a profile. This must not be called if the device does not support profile naming.
     * Use {@link name()} first, to find out whether you can use this.
     */
    setName(name: string): Promise<void>;
    /**
     * Gets whether the profile is enabled. A disabled profile may have invalid values set, so you should
     * check these values before enabling a profile.
     */
    enabled(): Promise<boolean>;
    /**
     * Enables this profile.
     */
    enable(): Promise<void>;
    /**
     * Disables this profile.
     */
    disable(): Promise<void>;
    /**
     * Gets whether this profile is currently active. There is always only one active profile.
     */
    active(): Promise<boolean>;
    /**
     * Activates this profile. The currently active profile will be deactivated.
     */
    activate(): Promise<void>;
    /**
     * Gets a list of display resolutions, that can be switched through.
     */
    resolutions(): Promise<RatBagResolution[]>;
    /**
     * Gets a list of buttons on the device for this profile.
     */
    buttons(): Promise<RatBagButton[]>;
    /**
     * Gets a list of leds on the device for this profile.
     */
    leds(): Promise<RatBagLed[]>;
}
/**
 * A resolution profile for a device profile.
 */
export declare class RatBagResolution extends DBusObject {
    private readonly resolution;
    constructor(client: DBusClient, proxy: ProxyObject);
    /**
     * Gets the index of this resolution profile.
     */
    index(): Promise<number>;
    /**
     * Gets whether this resolution profile is the currently active resolution.
     */
    active(): Promise<boolean>;
    /**
     * Gets whether this resolution profile is the default.
     */
    default(): Promise<boolean>;
    /**
     * Sets this resolution profile as the currently active resolution.
     */
    activate(): Promise<void>;
    /**
     * Sets this resolution profile as default.
     */
    setDefault(): Promise<void>;
    /**
     * Gets the dpi values for this profile.
     */
    dpi(): Promise<RatBagDpi>;
    /**
     * Sets the dpi for this profile. If {@link dpi()} returns a single value, this must also be set to a single value.
     * If {@link dpi()} returns separate x and y values, this must be set to separate x and y values.
     */
    setDpi(dpi: RatBagDpi): Promise<void>;
    /**
     * Gets a list of numbers that can be used as dpi values.
     */
    allowedDpiValues(): Promise<number[]>;
}
/**
 * A button on a device for a specific profile
 */
export declare class RatBagButton extends DBusObject {
    private static readonly SPECIAL_ACTION_MAP;
    constructor(client: DBusClient, proxy: ProxyObject);
    /**
     * Gets the index of this button.
     */
    index(): Promise<number>;
    /**
     * Gets the action currently bound to this button.
     */
    mapping(): Promise<RatBagMapping>;
    /**
     * Binds this button to the given action.
     */
    setMapping(mapping: RatBagMapping): Promise<void>;
}
/**
 * A led on a device for a specific profile
 */
export declare class RatBagLed extends DBusObject {
    constructor(client: DBusClient, proxy: ProxyObject);
    /**
     * Gets the index for this led.
     */
    index(): Promise<number>;
    /**
     * Gets the current mode of the led.
     */
    mode(): Promise<LedMode>;
    /**
     * Sets the mode of the led.
     */
    setMode(mode: LedMode): Promise<void>;
    /**
     * Gets a list of supported led modes.
     */
    supportedModes(): Promise<LedMode[]>;
    /**
     * Gets the color, the led is currently in.
     */
    color(): Promise<RatBagColorObj & RatBagColorValue>;
    /**
     * Sets the color for the led.
     */
    setColor(color: RatBagColorObj | RatBagColorValue): Promise<void>;
    /**
     * Gets the current effect duration in milliseconds. What exactly this means depends on the led mode.
     */
    effectDuration(): Promise<number>;
    /**
     * Sets the current effect duration in milliseconds.
     */
    setEffectDuration(millis: number): Promise<void>;
    /**
     * Gets the current led brightness [0;255]
     */
    brightness(): Promise<number>;
    /**
     * Sets the current led brightness [0;255]
     */
    setBrightness(brightness: number): Promise<void>;
}
/**
 * A model of a ratbagd device.
 */
export type RatBagModel = RatBagModelUnknown | RatBagModelCommon;
/**
 * An unknown device model.
 */
export type RatBagModelUnknown = {
    busType: "unknown";
};
/**
 * A known device model.
 */
export type RatBagModelCommon = {
    /**
     * How the device id connected.
     */
    busType: "usb" | "bluetooth";
    /**
     * The vendor id of the device as a hex string.
     */
    vendorHex: string;
    /**
     * The vendor id of the device as a number.
     */
    vendorId: number;
    /**
     * The product id of the device as a hex string.
     */
    productHex: string;
    /**
     * The product id of the device as a number.
     */
    productId: number;
    /**
     * The version of the device. This number is only used internally to distinguish multiple
     * devices of the same type.
     */
    version: number;
};
/**
 * A resolution in DPI. This can either be a single value or separate values for x and y depending on the device.
 * When setting a DPI value, it must be exactly the kind of value, the device supports.
 */
export type RatBagDpi = number | {
    x: number;
    y: number;
};
/**
 * A mapping for a button.
 */
export type RatBagMapping = RatBagMappingNone | RatBagMappingUnknown | RatBagMappingButton | RatBagMappingSpecial | RatBagMappingMacro;
/**
 * A button mapping that does nothing.
 */
export type RatBagMappingNone = {
    type: "none";
};
/**
 * An unknown button mapping.
 */
export type RatBagMappingUnknown = {
    type: "unknown";
};
/**
 * A button mapping that maps a physical button to a logical button.
 */
export type RatBagMappingButton = {
    type: "button";
    /**
     * The logical mouse button to map to.
     */
    button: number;
};
/**
 * A mapping that triggers a special action.
 */
export type RatBagMappingSpecial = {
    type: "special";
    /**
     * The action to trigger.
     */
    action: RatBagSpecialAction;
};
/**
 * A mapping that triggers a macro.
 */
export type RatBagMappingMacro = {
    type: "macro";
    macro: RatBagMacroAction[];
};
/**
 * An action in a macro.
 */
export type RatBagMacroAction = {
    type: "press" | "release";
    keyCode: number;
};
/**
 * A color represented by red, green and blue values in range [0;255]
 */
export type RatBagColorObj = {
    red: number;
    green: number;
    blue: number;
};
/**
 * A color represented as 0xRRGGBB
 */
export type RatBagColorValue = {
    color: number;
};
/**
 * A special button action.
 */
export type RatBagSpecialAction = "unknown" | "doubleclick" | "wheel left" | "wheel right" | "wheel up" | "wheel down" | "ratched mode switch" | "resolution cycle up" | "resolution cycle down" | "resolution up" | "resolution down" | "resolution alternate" | "resolution default" | "profile cycle up" | "profile cycle down" | "profile up" | "profile down" | "second mode" | "battery level";
/**
 * A mode for a led.
 */
export type LedMode = "off" | "on" | "cycle" | "breath";
//# sourceMappingURL=ratbag.d.ts.map