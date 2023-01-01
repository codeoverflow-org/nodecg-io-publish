/// <reference types="node" />
import { Logger } from "nodecg-io-core";
/**
 * Represents an android device that is connected via ADB.
 */
export declare class Android {
    private logger;
    private readonly device;
    private server;
    private hostPort;
    private devicePort;
    private connected;
    private nextId;
    private pending;
    private disconnectHandlers;
    readonly packageManager: PackageManager;
    readonly contactManager: ContactManager;
    readonly fileManager: FileManager;
    constructor(logger: Logger, device: string);
    /**
     * Connects to the device. This is called by nodecg-io-android and should not be called by a bundle.
     */
    connect(): Promise<void>;
    /**
     * Disconnects from the device. This is called by nodecg-io-android and should not be called by a bundle.
     */
    disconnect(): Promise<void>;
    /**
     * Pings the device. This will throw an error if the connection is lost.
     */
    ping(): Promise<void>;
    /**
     * Check fors some permissions to be granted. This will make no attempt to get
     * access to the permissions and the activity won't get launched. If a permission
     * is not granted, the promise is rejected.
     */
    ensurePermissions(...permissions: Array<Permission>): Promise<void>;
    /**
     * Requests some runtime permissions. This should be called once on bundle
     * startup as it requires starting the activity.
     */
    requestPermissions(...permissions: Array<BasicPermission>): Promise<void>;
    /**
     * Requests a special permissions. This should be called once on bundle
     * startup as it requires starting the activity. Special permissions must
     * be explicitly enabled in the settings one after another.
     */
    requestSpecial(permission: SpecialPermission): Promise<void>;
    /**
     * Captures a screenshot and returns it as a buffer.
     */
    screenshot(): Promise<Buffer>;
    /**
     * Activates the display.
     */
    wakeUp(): Promise<void>;
    /**
     * Shows a toast (little notification that pops up at the bottom of the screen for a short while)
     */
    toast(text: string): Promise<void>;
    /**
     * Gets a volume stream for a given channel.
     */
    volume(channel: VolumeChannel): VolumeStream;
    /**
     * Gets a sensor of the given type. If the required permissions are not granted
     * or the sensor is not present, the promise is rejected.
     */
    getSensor(id: "gps"): Promise<GpsSensor>;
    getSensor(id: "motion"): Promise<MotionSensor>;
    getSensor(id: "magnetic"): Promise<MagneticSensor>;
    getSensor(id: "light"): Promise<LightSensor>;
    /**
     * Sends a notification to the status bar of the device.
     * @param title The title of the notification
     * @param text The text to display
     * @param properties Additional properties for the notification
     * @param callback Optionally a callback function that is called when the user taps on the notification
     */
    notify(title: string, text: string, properties: NotificationProperties, callback?: () => void): Promise<void>;
    /**
     * Gets the TelephonyManager for this device. If this device is not capable of telephony features,
     * the promise is rejected.
     */
    getTelephonyManager(): Promise<TelephonyManager>;
    /**
     * Gets the WifiManager for this device. If this device is not capable of wifi features,
     * the promise is rejected.
     */
    getWifiManager(): Promise<WifiManager>;
    equals(other: Android): boolean;
    addDisconnectHandler(handler: () => Promise<unknown>): void;
    removeDisconnectHandler(handler: () => Promise<unknown>): void;
    rawRequest(action: string, data: Record<string, unknown>, callback?: (evt: unknown) => void): Promise<any>;
    rawAdb(command: string[]): Promise<string>;
    rawAdbBinary(command: string[]): Promise<Buffer>;
    rawAdbExitCode(command: string[]): Promise<number>;
}
/**
 * A runtime permission that has to be requested via requestPermissions() before using any
 * function that requires it.
 */
export type BasicPermission = "gps" | "phone" | "read_sms" | "send_sms" | "contacts";
/**
 * Special permissions are considered more dangerous than runtime permissions. They must be
 * requested one after another via requestSpecial().
 */
export type SpecialPermission = "statistics";
/**
 * A permission that needs to be granted at runtime.
 */
export type Permission = BasicPermission | SpecialPermission;
/**
 * An id of a sensor that might be present on a device
 */
export type SensorId = "gps" | "motion" | "magnetic" | "light";
/**
 * Used to control a volume channel on the device.
 */
export declare class VolumeStream {
    private readonly android;
    readonly channel: VolumeChannel;
    constructor(android: Android, channel: VolumeChannel);
    /**
     * Gets the volume of the channel in range from 0 to getMaxVolume()
     */
    getVolume(): Promise<number>;
    /**
     * Gets the maximum volume of this channel
     */
    getMaxVolume(): Promise<number>;
    /**
     * Sets the volume for this channel
     * @param volume The new volume
     * @param flags The flags to use when setting the volume
     */
    setVolume(volume: number, flags: VolumeFlag[]): Promise<void>;
    /**
     * Changes the volume. Can also be used to mute and unmute the channel.
     * @param adjustment The operation to perform
     * @param flags The flags to use when setting the volume
     */
    adjustVolume(adjustment: VolumeAdjustment, flags: AdjustmentVolumeFlag[]): Promise<void>;
    equals(other: VolumeStream): boolean;
}
/**
 * A volume channel that can be used to get a VolumeStream
 */
export type VolumeChannel = "ring" | "accessibility" | "alarm" | "dtmf" | "music" | "notification" | "system" | "voice_call";
/**
 * An operation for adjustVolume().
 *
 * `same`: Does nothing to the volume. Can be used to show the volume UI when used with the `show_ui` flag.
 * `raise`: Raises the volume like when the volume up button was pressed
 * `lower`: Lowers the volume like when the volume down button was pressed
 * `mute`: Mutes the channel
 * `unmute`: Unmutes the channel
 * `toggle_mute`: Toggles the mute state of the channel
 */
export type VolumeAdjustment = "same" | "raise" | "lower" | "mute" | "unmute" | "toggle_mute";
/**
 * Flags to use when setting a volume
 *
 * `show_ui`: Make the volume UI show up
 * `play_sound`: Play a note after changing the volume
 * `silent`: Supresses any vibration and sound
 * `vibrate`: Causes a vibration when activating vibrate ringer mode
 */
export type VolumeFlag = "show_ui" | "play_sound" | "silent" | "vibrate";
/**
 * Flags to use when adjusting a volume
 *
 * See VolumeFlag.
 * `ringer_modes`: When the volume is at 0 and is lowered, with this flag set, vibrate and then mute is activated.
 */
export type AdjustmentVolumeFlag = VolumeFlag | "ringer_modes";
/**
 * Additional properties for a notification on the device
 */
export interface NotificationProperties {
    /**
     * How important the notification is. Like when playing a game not every notification shows up.
     */
    importance?: "default" | "min" | "low" | "high" | "max";
    /**
     * The mode of the notification.
     *
     * `public`: The notification can be fully seen on the lockscreen
     * `private`: The notification can be seen but is collapsed on the lockscreen (Default)
     * `secret`: The notification is hidden on the lockscreen
     */
    mode?: "public" | "private" | "secret";
    /**
     * Whether this notification should ignore 'Do not Disturb'
     */
    bypass_dnd?: boolean;
    /**
     * An icon for the notification encoded with base64. Default is the code overflow logo
     */
    icon?: string;
    /**
     * Whether this notification should be dismissed when the user presses it. (Default: true)
     */
    auto_hide?: boolean;
}
/**
 * The package manager is used to query information about installed packages
 */
export declare class PackageManager {
    private readonly android;
    constructor(android: Android);
    /**
     * Gets all package identifiers installed.
     */
    getInstalledPackages(): Promise<string[]>;
    /**
     * Gets a package by identifier. If the package is not installed, the promise is rejected.
     */
    getPackage(id: string): Promise<Package>;
    equals(other: PackageManager): boolean;
}
/**
 * An installed package.
 */
export declare class Package {
    private readonly android;
    readonly id: string;
    constructor(android: Android, id: string);
    /**
     * Gets all activities defined by this package.
     */
    getActivities(): Promise<Activity[]>;
    /**
     * Gets one activity by id.
     */
    getActivity(activity: string): Promise<Activity>;
    /**
     * Gets the installed version of this package.
     */
    getVersion(): Promise<string>;
    /**
     * Gets usage statistics for this package for a given period of time.
     * Required the special `statistics` permission.
     */
    getUsageStats(time: UsageStatsTime): Promise<UsageStats | undefined>;
    equals(other: Package): boolean;
}
/**
 * An activity. (The thing of a package that is launched when pressing an icon on the home screen.)
 */
export declare class Activity {
    private readonly android;
    private readonly pkg;
    readonly id: string;
    constructor(android: Android, pkg: Package, id: string);
    /**
     * Starts the activity.
     */
    start(): Promise<void>;
    equals(other: Activity): boolean;
}
/**
 * Allows access to the GPS sensor of the device. Requires the `gps` permission.
 */
export declare class GpsSensor {
    private readonly android;
    constructor(android: Android);
    /**
     * Checks whether GPS is activated.
     */
    isActive(): Promise<boolean>;
    /**
     * Gets the last known position or undefined if there's no last known position. The promise id rejected if
     * GPS is turned off. Use isActive() to check before.
     */
    getLastKnownLocation(): Promise<LocationInfo | undefined>;
    /**
     * Subscribes for location updates. If GPS is turned off, you will get no updates. Always cancel the
     * returned subscription if you don't need more updates.
     *
     * @param listener The function to be called when the location updates.
     * @param time The minimum time (in milliseconds) between two location updates sent. Set this as high as possible.
     * @param distance The minimum distance (in meters) between two location updates
     */
    subscribeLocations(listener: (l: Location) => void, time?: number, distance?: number): Promise<Subscription>;
    equals(other: GpsSensor): boolean;
}
export type LocationInfo = {
    /**
     * The latitude in degrees
     */
    latitude: number;
    /**
     * The longitude in degrees
     */
    longitude: number;
    /**
     * The altitude in meters above the WGS 84 reference ellipsoid
     */
    altitude?: number;
    /**
     * The speed in meters per second
     */
    speed?: number;
    /**
     * The bearing in degrees
     * Bearing is the horizontal direction of travel of this device, and is not related to the
     * device orientation.
     */
    bearing?: number;
    /**
     * The accuracy for latitude and longitude in meters
     */
    accuracyHorizontal?: number;
    /**
     * The accuracy of the altitude in meters
     */
    accuracyVertical?: number;
    /**
     * The speed accuracy in meters per second
     */
    accuracySpeed?: number;
    /**
     * The bearing accuracy in degrees
     */
    accuracyBearing?: number;
};
/**
 * A subscription is returned when the device keeps sending data. Cancel the subscription to
 * stop delivery of said data.
 */
export declare class Subscription {
    private readonly android;
    private readonly id;
    constructor(android: Android, id: string);
    /**
     * Cancels the subscription
     */
    cancel(): Promise<void>;
    static fromResult(android: Android, result: {
        subscription_id: string;
    }): Subscription;
    equals(other: Subscription): boolean;
}
/**
 * This class unifies all the motion sensors on the device.
 */
export declare class MotionSensor {
    private readonly android;
    constructor(android: Android);
    /**
     * Gets the current motion of the device.
     */
    motion(): Promise<Motion>;
    /**
     * Subscribes for motion sensor updates.
     * @param part The physical sensor to subscribe to
     * @param listener A listener function
     * @param time The time in milliseconds between two sensor updates
     */
    subscribeMotion(part: "accelerometer", listener: (m: AccelerometerResult) => void, time?: number): Promise<Subscription>;
    subscribeMotion(part: "accelerometer_uncalibrated", listener: (m: AccelerometerUncalibratedResult) => void, time?: number): Promise<Subscription>;
    subscribeMotion(part: "gravity", listener: (m: GravityResult) => void, time?: number): Promise<Subscription>;
    subscribeMotion(part: "gyroscope", listener: (m: GyroscopeResult) => void, time?: number): Promise<Subscription>;
    subscribeMotion(part: "gyroscope_uncalibrated", listener: (m: GyroscopeUncalibratedResult) => void, time?: number): Promise<Subscription>;
    subscribeMotion(part: "linear_acceleration", listener: (m: LinearAccelerationResult) => void, time?: number): Promise<Subscription>;
    subscribeMotion(part: "rotation_vector", listener: (m: RotationVectorResult) => void, time?: number): Promise<Subscription>;
    equals(other: MotionSensor): boolean;
}
/**
 * A single sensor that is used to get the whole motion
 */
export type MotionSensorPart = "accelerometer" | "accelerometer_uncalibrated" | "gravity" | "gyroscope" | "gyroscope_uncalibrated" | "linear_acceleration" | "rotation_vector";
export type AccelerometerResult = {
    /**
     * Acceleration force along the x axis (including gravity) in meters per second squared
     */
    x: number;
    /**
     * Acceleration force along the y axis (including gravity) in meters per second squared
     */
    y: number;
    /**
     * Acceleration force along the z axis (including gravity) in meters per second squared
     */
    z: number;
};
export type AccelerometerUncalibratedResult = {
    /**
     * Measured Acceleration force along the x axis (without bias compensation) in meters per second squared
     */
    rawX: number;
    /**
     * Measured Acceleration force along the y axis (without bias compensation) in meters per second squared
     */
    rawY: number;
    /**
     * Measured Acceleration force along the z axis (without bias compensation) in meters per second squared
     */
    rawZ: number;
    /**
     * Measured Acceleration force along the x axis (with bias compensation) in meters per second squared
     */
    bcX: number;
    /**
     * Measured Acceleration force along the y axis (with bias compensation) in meters per second squared
     */
    bcY: number;
    /**
     * Measured Acceleration force along the z axis (with bias compensation) in meters per second squared
     */
    bcZ: number;
};
export type GravityResult = {
    /**
     * Force of gravity along the x axis in meters per second squared
     */
    gravityX: number;
    /**
     * Force of gravity along the y axis in meters per second squared
     */
    gravityY: number;
    /**
     * Force of gravity along the z axis in meters per second squared
     */
    gravityZ: number;
};
export type GyroscopeResult = {
    /**
     * Rotation around the x axis in radians / second
     */
    rotX: number;
    /**
     * Rotation around the y axis in radians / second
     */
    rotY: number;
    /**
     * Rotation around the z axis in radians / second
     */
    rotZ: number;
};
export type GyroscopeUncalibratedResult = {
    /**
     * Rotation around the x axis (without drift compensation) in radians / second
     */
    rawRotX: number;
    /**
     * Rotation around the y axis (without drift compensation) in radians / second
     */
    rawRotY: number;
    /**
     * Rotation around the z axis (without drift compensation) in radians / second
     */
    rawRotZ: number;
    /**
     * Estimated drift around the x axis in radians / second
     */
    driftX: number;
    /**
     * Estimated drift around the y axis in radians / second
     */
    driftY: number;
    /**
     * Estimated drift around the z axis in radians / second
     */
    driftZ: number;
};
export type LinearAccelerationResult = {
    /**
     * Acceleration force along the x axis (without gravity) in meters per second squared
     */
    ngX: number;
    /**
     * Acceleration force along the y axis (without gravity) in meters per second squared
     */
    ngY: number;
    /**
     * Acceleration force along the z axis (without gravity) in meters per second squared
     */
    ngZ: number;
};
export type RotationVectorResult = {
    /**
     * Rotation vector component along the x axis (x * sin(θ/2)).
     */
    rotVecX: number;
    /**
     * Rotation vector component along the y axis (y * sin(θ/2)).
     */
    rotVecY: number;
    /**
     * Rotation vector component along the z axis (z * sin(θ/2)).
     */
    rotVecZ: number;
    rotScalar?: number;
};
export type Motion = AccelerometerResult & AccelerometerUncalibratedResult & GravityResult & GyroscopeResult & GyroscopeUncalibratedResult & LinearAccelerationResult & RotationVectorResult;
/**
 * A sensor for magnetic field data.
 */
export declare class MagneticSensor {
    private readonly android;
    constructor(android: Android);
    /**
     * Gets the magnetic field.
     */
    magneticField(): Promise<MagneticField>;
    equals(other: MagneticSensor): boolean;
}
/**
 * The result of a magnetic field sensor
 */
export type MagneticField = {
    /**
     * The ambient magnetic field on x axis in micro-Tesla
     */
    x: number;
    /**
     * The ambient magnetic field on y axis in micro-Tesla
     */
    y: number;
    /**
     * The ambient magnetic field on z axis in micro-Tesla
     */
    z: number;
};
/**
 * A light sensor
 */
export declare class LightSensor {
    private readonly android;
    constructor(android: Android);
    /**
     * Gets the ambient light in lux.
     */
    ambientLight(): Promise<number>;
    equals(other: LightSensor): boolean;
}
/**
 * Manager for telephony features
 */
export declare class TelephonyManager {
    private readonly android;
    readonly smsManager: SmsManager;
    constructor(android: Android);
    /**
     * Gets a list of all Telephonies for this device. Requires the `phone` permission
     */
    getTelephonies(): Promise<Array<Telephony>>;
    /**
     * Enables or disables Airplane Mode
     */
    setAirplane(enabled: boolean): Promise<void>;
    equals(other: TelephonyManager): boolean;
}
/**
 * A mobile subscription on the device. I could not find concrete information on what is considered
 * a mobile subscription but but it's probably just one per UICC.
 */
export declare class Telephony implements SmsResolvable {
    private readonly android;
    private readonly manager;
    readonly id: number;
    readonly sms_provider = "telephony";
    readonly sms_resolve_data: Record<string, unknown>;
    constructor(android: Android, manager: TelephonyManager, id: number);
    /**
     * Gets the properties for this Telephony
     */
    properties(): Promise<TelephonyProperties>;
    /**
     * Request a connection to this Telephony. This will turn off airplane mode if it's enabled.
     * IMPORTANT: This will throw an error if running on Android 10 or lower.
     * Please note that this requires user interaction and WILL launch the activity.
     */
    requestConnection(connected_listener?: () => void): Promise<void>;
    equals(other: Telephony): boolean;
}
/**
 * Properties for a Telephony object.
 */
export type TelephonyProperties = {
    /**
     * The slot index (starting at 0) where the SIM of that telephony is located. Might be undefined
     * for eUICCs or if not known.
     */
    simSlot?: number;
    /**
     * The name of that telephony
     */
    name: string;
    /**
     * The mobile country code for the telephony
     */
    countryCode?: string;
    /**
     * The mobile network code for the telephony
     */
    networkCode?: string;
    /**
     * The ISO country code for the telephony
     */
    countryISO?: string;
    /**
     * Whether the telephony is embedded (eUICC)
     */
    embedded: boolean;
    /**
     * The telephone number for this telephony. This is not always present and is cached by default.
     * It's not guaranteed to be correct.
     */
    number?: string;
    /**
     * The manufacturer code of the telephony
     */
    manufacturerCode?: string;
};
/**
 * Manager to read and send SMS and MS
 */
export declare class SmsManager {
    private readonly android;
    constructor(android: Android);
    /**
     * Gets all SMS matching the given category and filter. This requires the `read_sms` permission.
     */
    getSMS(category: SmsCategory, filter?: SmsResolvable): Promise<Array<Sms>>;
    /**
     * Gets all MMS matching the given category and filter. This requires the `read_sms` permission.
     */
    getMMS(category: SmsCategory, filter?: SmsResolvable): Promise<Array<Mms>>;
    /**
     * Sends an SMS. If the text is too long to fit into a simple SMS, A multipart SMS is sent. This
     * required `phone` and `send_sms` permissions.
     *
     * @param telephony The telephony object to use.
     * @param address The adress to send the SMS to.
     * @param text The text of the sms.
     * @param sent This function will get called as soon as the SMS was sent or failed to send. If
     *             it got split up into a multipart SMS you may receive this event multiple times,
     *             once for each part.
     * @param delivered This function will get called as soon as the SMS was delivered. If it got split
     *                  up into a multipart SMS you may receive this event multiple times, once for each
     *                  part.
     */
    sendSMS(telephony: Telephony, address: SmsReceiver, text: string, sent?: (result: SmsResult) => void, delivered?: () => void): Promise<void>;
    private getMessages;
    equals(other: SmsManager): boolean;
}
/**
 * A category / state of a sms message
 */
export type SmsCategory = "all" | "inbox" | "outbox" | "sent" | "draft";
/**
 * Something that can be used to filter SMS.
 */
export interface SmsResolvable {
    readonly sms_provider: string;
    readonly sms_resolve_data: Record<string, unknown>;
}
/**
 * A type of message (sms or mms)
 */
export type MessageType = "sms" | "mms";
/**
 * Common parts of a message that ies either sms or mms.
 */
export declare abstract class AbstractMessage {
    protected readonly android: Android;
    protected readonly id: number;
    private readonly thread_id;
    private readonly telephony_id;
    protected constructor(android: Android, msg: Record<string, any>);
    /**
     * The type of this message.
     */
    abstract readonly messageType: MessageType;
    /**
     * The subject of the message
     */
    readonly subject?: string;
    /**
     * The text body of the message
     */
    readonly text?: string;
    /**
     * Date and time when the message was received. undefined if not received yet.
     */
    readonly received?: Date;
    /**
     * Date and time when the message was received. undefined if not sent yet. (For example in drafts)
     */
    readonly sent?: Date;
    /**
     * Whether the message was read by the user. This seems to be always false for incoming messages.
     */
    readonly read: boolean;
    /**
     * Whether the message was seen by the user. This seems to be always false for incoming messages.
     */
    readonly seen: boolean;
    /**
     * Gets the thread for this message. A thread is identified by the phone numbers participating in it.
     */
    getThread(): Promise<MessageThread | undefined>;
    /**
     * Gets the telephony object that was used to send or receive the message. This is an optional value.
     * This requires the `phone` permission
     */
    getTelephony(): Promise<Telephony | undefined>;
}
/**
 * A SMS message
 */
export declare class Sms extends AbstractMessage {
    private readonly sender_id;
    constructor(android: Android, msg: Record<string, any>);
    readonly messageType: MessageType;
    /**
     * The name of the chat (person or group) in which the message was sent. Try to not use this value
     * but get this via the MessageThread as this might be missing and is not available for Mms. On some
     * devices you'll also only get this with the `contacts` permission.
     */
    readonly address?: string;
    /**
     * Sms always has a text. It's never undefined.
     */
    readonly text: string;
    /**
     * Gets the phone number who sent this sms. This is not always available. Try to get this via the
     * MessageThread instead.
     */
    getSender(): Promise<Recipient | undefined>;
}
/**
 * A MMS message
 */
export declare class Mms extends AbstractMessage {
    constructor(android: Android, msg: Record<string, any>);
    readonly messageType: MessageType;
    /**
     * Whether this is a text-only mms.
     */
    readonly textOnly: boolean;
    /**
     * The content type for the message
     */
    readonly contentType: string;
    /**
     * The content location for the message
     */
    readonly contentLocation?: string;
    /**
     * The expiry for the message.
     */
    readonly expiry?: Date;
}
/**
 * A thread is identified by the phone number participating in it. A thread may
 * contain SMS and MMS messages.
 */
export declare class MessageThread implements SmsResolvable {
    protected readonly android: Android;
    protected readonly id: number;
    readonly sms_provider = "thread";
    readonly sms_resolve_data: Record<string, unknown>;
    constructor(android: Android, msg: Record<string, any>);
    /**
     * How many messages exist in that thread in total.
     */
    readonly messageCount: number;
    /**
     * Whether all messages in this thread have been read.
     */
    readonly allRead: number;
    /**
     * A snippet from the last message in this thread.
     */
    readonly snippet?: string;
    /**
     * Whether this is a broadcast thread.
     */
    readonly broadcast: boolean;
    /**
     * Whether this thread is archived.
     */
    readonly archived: boolean;
    /**
     * Gets all participants of this thread.
     */
    getRecipients(): Promise<Array<Recipient>>;
}
/**
 * Represents a phone number. In some cases there's no phone number given but
 * a name. (Often when the mobile provider sends sms)
 */
export declare class Recipient {
    private readonly android;
    private readonly id;
    /**
     * The phone number or name of this Recipient.
     */
    readonly address: string;
    constructor(android: Android, msg: Record<string, any>);
    /**
     * Get the contact for this recipient. Multiple recipients may map to the same
     * contact as a contact can hold multiple phone numbers. Requires the `contacts`
     * permission. If the same phone number is stored in multiple contacts, the first
     * match is returned. However this is guaranteed to always return the same contact
     * even if more than one exists unless the contact database gets changed between calls.
     */
    toContact(): Promise<Contact | undefined>;
    equals(other: Recipient): boolean;
}
/**
 * Anything that can be used to send a sms or mms message to.
 */
export type SmsReceiver = string | Recipient | Contact;
/**
 * A successful result when sending a message
 */
export type SmsResultSuccess = "success";
/**
 * An errored result when sending a message
 */
export type SmsResultFailure = "error_generic_failure" | "error_radio_off" | "error_null_pdu" | "error_no_service" | "error_limit_exceeded" | "error_fdn_check_failure" | "error_short_code_not_allowed" | "error_short_code_never_allowed" | "radio_not_available" | "network_reject" | "invalid_arguments" | "invalid_state" | "no_memory" | "invalid_sms_format" | "system_error" | "modem_error" | "network_error" | "encoding_error" | "invalid_smsc_address" | "operation_not_allowed" | "internal_error" | "no_resources" | "cancelled" | "request_not_supported" | "no_bluetooth_service" | "invalid_bluetooth_address" | "bluetooth_disconnected" | "unexpected_event_stop_sending" | "sms_blocked_during_emergency" | "sms_send_retry_failed" | "remote_exception" | "no_default_sms_app" | "ril_radio_not_available" | "ril_sms_send_fail_retry" | "ril_network_reject" | "ril_invalid_state" | "ril_invalid_arguments" | "ril_no_memory" | "ril_request_rate_limited" | "ril_invalid_sms_format" | "ril_system_err" | "ril_encoding_err" | "ril_invalid_smsc_address" | "ril_modem_err" | "ril_network_err" | "ril_internal_err" | "ril_request_not_supported" | "ril_invalid_modem_state" | "ril_network_not_ready" | "ril_operation_not_allowed" | "ril_no_resources" | "ril_cancelled" | "ril_sim_absent";
export type SmsResultUnknown = "unknown";
/**
 * A result when sending a message
 */
export type SmsResult = SmsResultSuccess | SmsResultFailure | SmsResultUnknown;
/**
 * Manager for contacts on the device.
 */
export declare class ContactManager {
    static readonly PHONE: ContactDataAccount;
    private readonly android;
    constructor(android: Android);
    /**
     * Looks up a contact. If the same data is stored in multiple contacts, the first
     * match is returned. However this is guaranteed to always return the same contact
     * even if more than one exists unless the contact database gets changed between calls.
     * To find out what columns are searched for which ContactDataId, see the documentation
     * there.
     * This require the `contacts` permission.
     */
    findContact(dataId: ContactDataId, value: string): Promise<Contact | undefined>;
    /**
     * Looks up a contact. This will return all contacts, that have the given data stored.
     * They're not guaranteed to be returned in the same order between requests. To find out
     * what columns are searched for which ContactDataId, see the documentation there.
     * This require the `contacts` permission.
     */
    findContacts(dataId: ContactDataId, value: string): Promise<Array<Contact>>;
    /**
     * Gets all contacts on the phone. Requires the `contacts` permission.
     */
    getAllContacts(): Promise<Array<Contact>>;
    equals(other: ContactManager): boolean;
}
/**
 * One contact
 */
export declare class Contact {
    private readonly android;
    private readonly id;
    readonly displayName: string;
    constructor(android: Android, id: number, displayName: string);
    /**
     * Gets the status of the contact. I don't really know what this is used for.
     */
    getStatus(): Promise<ContactStatus>;
    /**
     * Gets detailed name info about this contact.
     */
    getName(): Promise<ContactNameInfo>;
    /**
     * Gets some data associated with this contact.
     * @param dataId The type of requested data.
     * @param account The ContactDataAccount to use. See documentation of ContactDataAccount for more info.
     *                In the special case where dataId = "name", account is ignored.
     */
    getData(dataId: "name", account?: undefined): Promise<ContactNameInfo | undefined>;
    getData(dataId: "phone", account?: ContactDataAccount): Promise<Array<ContactDataPhone>>;
    getData(dataId: "email", account?: ContactDataAccount): Promise<Array<ContactDataEmail>>;
    getData(dataId: "event", account?: ContactDataAccount): Promise<Array<ContactDataEvent>>;
    getData(dataId: "nickname", account?: ContactDataAccount): Promise<Array<ContactDataNickname>>;
    getData(dataId: "notes", account?: ContactDataAccount): Promise<ContactNotes | undefined>;
    getData(dataId: "address", account?: ContactDataAccount): Promise<Array<ContactDataAddress>>;
    equals(other: Contact): boolean;
}
export type ContactPresence = "offline" | "invisible" | "away" | "idle" | "do_not_disturb" | "available";
export type ContactStatus = {
    /**
     * The status message of that contact
     */
    status?: string;
    /**
     * The time when the status message was set.
     */
    statusTime?: Date;
    /**
     * The presence of the contact.
     */
    presence: ContactPresence;
};
/**
 * An account for contact data. The default ist ContactManager#PHONE. Other apps may add their own.
 * For example WhatsApp adds `['com.whatsapp', 'WhatsApp']` for WhatsApp data.
 * The first string is the account type, the second string is the account name.
 */
export type ContactDataAccount = [string, string];
/**
 * A type of data that may be stored in a contact. When used to find contacts from database, the
 * following columns are searched:
 * 'name': display_name, given_name and family_name
 * 'phone': entered_number and number
 * 'email': address and display_name
 * 'event': date
 * 'nickname': name
 * 'notes': This data set ist not searchable. Searching for 'notes' will never find a contact
 * 'address': address, street, post_box, post_code, city
 */
export type ContactDataId = "name" | "phone" | "email" | "event" | "nickname" | "notes" | "address";
/**
 * Asian is used when it can nut be determined whether `chinese`, `japanese` or `korean` is correct.
 */
export type ContactNameStyle = "unset" | "western" | "asian" | "chinese" | "japanese" | "korean";
/**
 * Name information for a contact
 */
export type ContactNameInfo = {
    /**
     * The name that should be used to display the contact.
     */
    display_name: string;
    /**
     * The given name for the contact.
     */
    given_name?: string;
    /**
     * The family name for the contact.
     */
    family_name?: string;
    /**
     * The contact's honorific prefix, e.g. "Sir"
     */
    prefix?: string;
    /**
     * The contact's middle name
     */
    middle_name?: string;
    /**
     * The contact's honorific suffix, e.g. "Jr"
     */
    suffix?: string;
    /**
     * The style used for combining given/middle/family name into a full name.
     */
    style: ContactNameStyle;
};
/**
 * A type of a phone number
 */
export type PhoneNumberType = "home" | "mobile" | "work" | "fax_work" | "fax_home" | "pager" | "other" | "callback" | "car" | "company_main" | "isdn" | "main" | "other_fax" | "radio" | "telex" | "tty_tdd" | "work_mobile" | "work_pager" | "assistant" | "mms";
/**
 * Represents one phone number
 */
export type ContactDataPhone = {
    /**
     * The phone number as the user entered it.
     */
    entered_number: string;
    /**
     * The phone number normalised. This should be used instead of entered_number in most cases.
     */
    number: string;
    /**
     * The type of the phone number.
     */
    type: PhoneNumberType;
    /**
     * A label for the type. Can be used to differentiate fields with 'other' type.
     */
    type_label?: string;
};
/**
 * A type of email address
 */
export type EmailType = "home" | "mobile" | "work" | "other";
/**
 * Represents one email address
 */
export type ContactDataEmail = {
    /**
     * The email address.
     */
    address: string;
    /**
     * The display name for this email address.
     */
    display_name: string;
    /**
     * The type of the email address.
     */
    type: EmailType;
    /**
     * A label for the type. Can be used to differentiate fields with 'other' type.
     */
    type_label?: string;
};
/**
 * A type of contact related event
 */
export type EventType = "birthday" | "anniversary" | "other";
/**
 * Represents one special event for a contact
 */
export type ContactDataEvent = {
    /**
     * The date of the event as the user entered it. This is not sored as a timestamp in the database
     * and you can expect any type of text here. So be careful when trying to get a Date object from this.
     */
    date: string;
    /**
     * The type of the event.
     */
    type: EventType;
    /**
     * A label for the type. Can be used to differentiate fields with 'other' type.
     */
    type_label?: string;
};
/**
 * A type of contact nickname
 */
export type NicknameType = "default" | "other" | "maiden_name" | "short_name" | "initials";
/**
 * Represents one nickname for a contact
 */
export type ContactDataNickname = {
    /**
     * The nickname of the contact
     */
    name: string;
    /**
     * The type of the nickname.
     */
    type: NicknameType;
    /**
     * A label for the type. Can be used to differentiate fields with 'other' type.
     */
    type_label?: string;
};
/**
 * The notes for a contact.
 */
export type ContactNotes = {
    /**
     * The text in the notes
     */
    text: string;
};
/**
 * A type of address
 */
export type AddressType = "home" | "work" | "other";
/**
 * Represents one address for a contact
 */
export type ContactDataAddress = {
    /**
     * The address in one string as he user entered it.
     */
    address: string;
    /**
     * The street, house number and floor number. On some device this may also just
     * contain the same value as `address` and all the other address related fields
     * are missing.
     */
    street?: string;
    /**
     * A post box for this address.
     */
    post_box?: string;
    /**
     * The neighbourhood of the address. This is used to differentiate multiple
     * streets with the same name in the same city.
     */
    neighbourhood?: string;
    /**
     * The city, village, town or borough for the address.
     */
    city?: string;
    /**
     * A state, province, county (in Ireland), Land (in Germany), departement (in France) etc.
     */
    region?: string;
    /**
     * Postal code. Usually country-wide, but sometimes specific to the city
     */
    post_code?: string;
    /**
     * The name or code of the country.
     */
    country?: string;
    /**
     * The type of the address.
     */
    type: AddressType;
    /**
     * A label for the type. Can be used to differentiate fields with 'other' type.
     */
    type_label?: string;
};
/**
 * Manager for wifi related features
 */
export declare class WifiManager {
    private readonly android;
    constructor(android: Android);
    /**
     * Retrieves information about what features this device supports.
     */
    getInfo(): Promise<WifiInformation>;
    /**
     * Retrieves information about the current state of the device.
     * WifiState in itself has not may fields. Wrap it in a check for WifiState#connected to get access to
     * fields only available when connected.
     * Because it's technically possible to get location data from the available wlan networks, some of the
     * fields in WifiState may hold meaningless values if the `gps` permission is not granted.
     */
    getState(): Promise<WifiState>;
    /**
     * Retrieves information about currently available WLAN networks.
     * Because it's technically possible to get location data from the available wlan networks, some of the
     * fields in WifiScanResult may hold meaningless values if the `gps` permission is not granted.
     * For the same reason this will always throw an error if location services are disabled.
     * Note that this method may take a very long time.
     */
    scanNetworks(): Promise<Array<WifiScanResult>>;
    /**
     * Enables or disables WLAN
     */
    setEnabled(enabled: boolean): Promise<void>;
    /**
     * Request a connection to a WLAN network. This willl turn on wifi if it's disabled.
     * IMPORTANT: This is not meant to make the phone connect to an already saved network. This can be used to
     * create a connection to a new network where the user then does not need to enter a passphrase. The
     * connection is temporary. That means when it is lost, the user can not just reconnect but you need to call
     * this again.
     * IMPORTANT II: This will throw an error if running on Android 9 or lower.
     * Please note that this requires user interaction and WILL launch the activity.
     */
    requestConnection(request: WifiConnectionRequest, connected_listener?: () => void): Promise<void>;
    equals(other: WifiManager): boolean;
}
/**
 * Information about the wifi device.
 */
export type WifiInformation = {
    /**
     * Whether this device supports the 5GHz Band
     */
    has5GHz: boolean;
    /**
     * Whether this device supports the 6GHz Band
     */
    has6GHz: boolean;
    /**
     * Whether this device supports Wi-Fi Direct
     */
    p2p: boolean;
    /**
     * Whether this device can act as station and access point at the same time (connecting to a
     * network and creating a hotspot)
     */
    sta_ap_concurrency: boolean;
    /**
     * Whether Tunnel Directed Link Setup is supported
     */
    tdls: boolean;
    /**
     * Whether Easy Connect (DPP) is supported.
     */
    easy_connect: boolean;
    /**
     * Whether Enhanced Open (OWE) is supported.
     */
    enhanced_open: boolean;
    /**
     * Whether WAPI is supported.
     */
    wapi: boolean;
    /**
     * Whether WPA3-Personal SAE is supported.
     */
    wpa3sae: boolean;
    /**
     * Whether WPA3-Enterprise Suite-B-192 is supported.
     */
    wpa3sb192: boolean;
    /**
     * Whether wifi standard IEEE 802.11a/b/g is supported.
     * This will be false for all devices running on Android 10 or lower even if it is supported.
     */
    ieee80211abg: boolean;
    /**
     * Whether wifi standard IEEE 802.11n is supported.
     * This will be false for all devices running on Android 10 or lower even if it is supported.
     */
    ieee80211n: boolean;
    /**
     * Whether wifi standard IEEE 802.11ac is supported.
     * This will be false for all devices running on Android 10 or lower even if it is supported.
     */
    ieee80211ac: boolean;
    /**
     * Whether wifi standard IEEE 802.11ax is supported.
     * This will be false for all devices running on Android 10 or lower even if it is supported.
     */
    ieee80211ax: boolean;
};
/**
 * A wifi standard. This is supported only on Android 11+
 */
export type WifiStandard = "ieee80211abg" | "ieee80211n" | "ieee80211ac" | "ieee80211ax" | "unknown";
/**
 * A state for the wifi device
 */
export type WifiDeviceState = "disabled" | "disabling" | "enabled" | "enabling" | "unknown";
/**
 * Channel width for wifi scan result. 80Mhz+ means the channel is using 160Mhz but as 80Mhz + 80MHz
 */
export type WifiChannelWidth = "20MHz" | "40Mhz" | "80Mhz" | "160Mhz" | "80MHz+" | "unknown";
export type WifiScanResultBase = {
    /**
     * The SSID of the connected network.
     */
    ssid: string;
    /**
     * The BSSID of the connected network.
     */
    bssid: string;
    /**
     * The wifi standard used for the connection. This will always be 'unknown' when running on Android 10 or lower.
     */
    standard: WifiStandard;
    /**
     * The frequency on which this network currently runs in MHz
     */
    frequency: number;
    /**
     * The current received signal strength indication in dBm
     */
    rssi: number;
    /**
     * The rssi aligned to a scale from 0 to 1.
     * Avoid using this as it's not very meaningful.
     */
    signal_level: number;
    /**
     * Whether this is a passpoint network
     */
    passpoint: boolean;
};
export type WifiScanResultExtra = {
    /**
     * Whether this network support rtt (802.11mc)
     */
    rtt: boolean;
    /**
     * The bandwidth of the used channel.
     */
    channel_width: WifiChannelWidth;
};
/**
 * A result entry for a wifi scan
 */
export type WifiScanResult = WifiScanResultBase & WifiScanResultExtra;
export type WifiStateCommon = {
    /**
     * The state of the wifi device
     */
    device_state: WifiDeviceState;
    /**
     * Whether the device is connected
     */
    connected: boolean;
};
export type WifiStateConnectedExtra = {
    connected: true;
    /**
     * Whether the SSID of the connected network is hidden.
     */
    hidden_ssid: boolean;
    /**
     * The ip address of this device in the network.
     */
    ip: string;
    /**
     * The current link speed in MB/s
     */
    link_speed?: number;
    /**
     * The maximum supported RX link speed for this connection in MB/s
     */
    max_rx?: number;
    /**
     * The maximum supported TX link speed for this connection in MB/s
     */
    max_tx?: number;
    /**
     * The MAC-Address used for this connection. THIS ADDRESS IS NOT NECESSARILY
     * THE ADDRESS OF THE DEVICE AS ANDROID ALLOWS USING RANDOM MAC ADDRESSES.
     */
    mac_address: number;
    /**
     * The Fully Qualified Domain Name of the passpoint network. If this is not
     * a passpoint network, the value is undefined.
     */
    passpoint_fqdn?: string;
};
export type WifiStateDisconnectedExtra = {
    connected: false;
};
export type WifiStateConnected = WifiStateCommon & WifiStateConnectedExtra & WifiScanResultBase;
export type WifiStateDisconnected = WifiStateCommon & WifiStateDisconnectedExtra;
/**
 * Connection state of the wifi device
 */
export type WifiState = WifiStateConnected | WifiStateDisconnected;
/**
 * A wifi encryption method that requires no passphrase
 */
export type WifiEncryptionSimple = {
    /**
     * The type: Either none or enhanced_open (OWE).
     */
    type: "none" | "enhanced_open";
};
/**
 * A wifi encryption method that requires a passphrase
 */
export type WifiEncryptionPassphrase = {
    /**
     * The type: Either WPA2 or WPA3. If you need support for WPA try WPA2. On some device it will work.
     * WPA2/3 Enterprise is not supported for this.
     */
    type: "wpa2" | "wpa3";
    /**
     * The passphrase to use.
     */
    passphrase: string;
};
/**
 * A type of encryption to be used for a wifi connect request.
 */
export type WifiEncryption = WifiEncryptionSimple | WifiEncryptionPassphrase;
/**
 * Base type for a wifi connection request. Must be joined with either WifiConnectionRequestSSID
 * or WifiConnectionRequestBSSID or both to get a valid request.
 */
export type WifiConnectionRequestBase = {
    encryption?: WifiEncryption;
};
/**
 * Specifies a SSID for a WLAN network to connect to.
 */
export type WifiConnectionRequestSSID = {
    /**
     * The SSID of the WLAN network to connect to.
     */
    ssid: string;
};
/**
 * Specifies a BSSID for a WLAN network to connect to.
 */
export type WifiConnectionRequestBSSID = {
    /**
     * The BSSID of the WLAN network to connect to.
     */
    bssid: string;
    /**
     * A mask for the BSSID. If this is given, any network with a BSSID b for that `b & bssid_mask == bssid` is true.
     */
    bssid_mask?: string;
};
/**
 * Specifies a WLAN network to connect to.
 */
export type WifiConnectionRequest = WifiConnectionRequestBase & (WifiConnectionRequestSSID | WifiConnectionRequestBSSID | (WifiConnectionRequestSSID & WifiConnectionRequestBSSID));
/**
 * A period of time to get usage statistics.
 */
export type UsageStatsTime = {
    /**
     * The start of the period of time. Set to undefined to make it an open start.
     */
    start: Date | undefined;
    /**
     * The end of the period of time. Set to undefined to make it an open end.
     */
    end: Date | undefined;
};
/**
 * Usage statistics for a package
 */
export type UsageStats = {
    /**
     * The package for the statistic
     */
    package: Package;
    /**
     * The date when the statistics entry started. This may be different to the date you gave as a start date.
     */
    start: Date;
    /**
     * The date when the statistics entry started. This may be different to the date you gave as a start date.
     */
    end: Date;
    /**
     * The last time any activity of this package was used
     */
    lastTimeUsed: Date;
    /**
     * The last time any activity of this package was visible on the screen
     */
    lastTimeVisible: Date;
    /**
     * The total time the package's activity was used in milliseconds
     */
    totalTimeUsed: number;
    /**
     * The total time the package's activity was visible on the screen in milliseconds
     */
    totalTimeVisible: number;
};
/**
 * Can be used to access files on the device. This mostly depends on parsing the output of
 * shell commands because that gives access to more parts of the file system on a non-rooted
 * device. It seems to be stable between versions and devices. Let's hope...
 *
 * Important: This only works with absolute paths. Using non-absolute paths can lead to
 * unpredictable results.
 */
export declare class FileManager {
    private readonly android;
    readonly path: PathManager;
    constructor(android: Android);
    /**
     * Gets the file names of all entries in a directory. Using non-directory paths may
     * produce unpredictable results.
     */
    list(path: string): Promise<Array<string>>;
    /**
     * Gets some information about a file.
     */
    file(path: string): Promise<string>;
    /**
     * Downloads a file from the device. On some platforms, this gets incredibly slow when used on
     * files larger than 6MB.
     */
    download(device: string, local: string): Promise<void>;
    /**
     * Uploads a file to the device. On some platforms, this gets incredibly slow when used on
     * files larger than 6MB.
     */
    upload(local: string, device: string): Promise<void>;
}
/**
 * See FileManager
 */
export declare class PathManager {
    private readonly android;
    constructor(android: Android);
    /**
     * Normalizes a path. For example this will turn `/a/b/../c` into `/a/c`.
     * This method may but doesn't need to resolve symbolic links.
     */
    normalize(path: string): Promise<string>;
    /**
     * Gets whether a path exists.
     */
    exists(path: string): Promise<boolean>;
    /**
     * Gets whether a path is a regular file.
     */
    isfile(path: string): Promise<boolean>;
    /**
     * Gets whether a path is a directory.
     */
    isdir(path: string): Promise<boolean>;
    /**
     * Gets whether a path is a symbolic link.
     */
    islink(path: string): Promise<boolean>;
    /**
     * Gets whether a path is readable by you.
     */
    readable(path: string): Promise<boolean>;
    /**
     * Gets whether a path is writable by you.
     */
    writable(path: string): Promise<boolean>;
    /**
     * Gets the link target if a path is a symbolic link or a path that points to the same file if not.
     */
    target(path: string): Promise<string>;
}
//# sourceMappingURL=android.d.ts.map