"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathManager = exports.FileManager = exports.WifiManager = exports.Contact = exports.ContactManager = exports.Recipient = exports.MessageThread = exports.Mms = exports.Sms = exports.AbstractMessage = exports.SmsManager = exports.Telephony = exports.TelephonyManager = exports.LightSensor = exports.MagneticSensor = exports.MotionSensor = exports.Subscription = exports.GpsSensor = exports.Activity = exports.Package = exports.PackageManager = exports.VolumeStream = exports.Android = void 0;
const tslib_1 = require("tslib");
const http = tslib_1.__importStar(require("http"));
const child_process_1 = require("child_process");
const stringio_1 = require("@rauschma/stringio");
const get_stream_1 = require("get-stream");
/**
 * Represents an android device that is connected via ADB.
 */
class Android {
    constructor(logger, device) {
        this.logger = logger;
        this.nextId = 0;
        this.pending = new Map();
        this.disconnectHandlers = [];
        this.device = device;
        this.connected = false;
        this.packageManager = new PackageManager(this);
        this.contactManager = new ContactManager(this);
        this.fileManager = new FileManager(this);
    }
    /**
     * Connects to the device. This is called by nodecg-io-android and should not be called by a bundle.
     */
    async connect() {
        if (this.connected) {
            throw new Error("Already connected");
        }
        const packages = await this.rawAdb(["shell", "pm", "list", "packages"]);
        if (!packages.includes("io.github.noeppi_noeppi.nodecg_io_android")) {
            throw new Error("The nodecg-io-android app is not installed on the device.");
        }
        this.server = http.createServer(async (req, res) => {
            var _a;
            if (((_a = req.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === "POST" && "nodecg-io-message-id" in req.headers) {
                const idStr = req.headers["nodecg-io-message-id"];
                if (idStr !== undefined && (typeof idStr === "string" || idStr instanceof String)) {
                    const id = parseInt(idStr);
                    const promise = this.pending.get(id);
                    if (promise !== undefined) {
                        const resolve = promise[0];
                        const reject = promise[1];
                        const event = promise[2];
                        try {
                            const data = JSON.parse(await (0, stringio_1.readableToString)(req, "utf-8"));
                            if (data.event) {
                                if (event !== undefined) {
                                    event(data);
                                }
                            }
                            else {
                                resolve(data);
                            }
                        }
                        catch (err) {
                            reject(err);
                        }
                    }
                }
            }
            res.writeHead(204);
            res.end();
        });
        this.server.listen(0);
        this.hostPort = this.server.address().port;
        const devicePortStr = (await this.rawAdb(["reverse", "tcp:0", `tcp:${this.hostPort}`])).trim();
        this.devicePort = parseInt(devicePortStr);
        this.connected = true;
    }
    /**
     * Disconnects from the device. This is called by nodecg-io-android and should not be called by a bundle.
     */
    async disconnect() {
        if (this.connected) {
            for (const handler of this.disconnectHandlers) {
                try {
                    await handler();
                }
                catch (err) {
                    this.logger.error(`A disconnect handler for nodecg-io-android threw an error: ${err}`);
                }
            }
            await this.rawRequest("cancel_all_subscriptions", {});
            this.connected = false;
            await this.rawAdb(["reverse", "--remove", `tcp:${this.devicePort}`]);
            this.server.close();
        }
    }
    /**
     * Pings the device. This will throw an error if the connection is lost.
     */
    async ping() {
        await this.rawRequest("ping", {});
    }
    /**
     * Check fors some permissions to be granted. This will make no attempt to get
     * access to the permissions and the activity won't get launched. If a permission
     * is not granted, the promise is rejected.
     */
    async ensurePermissions(...permissions) {
        await this.rawRequest("ensure_permissions", {
            permissions: permissions,
        });
    }
    /**
     * Requests some runtime permissions. This should be called once on bundle
     * startup as it requires starting the activity.
     */
    async requestPermissions(...permissions) {
        const result = await this.rawRequest("request_permissions", {
            permissions: permissions,
        });
        if (!result.success) {
            throw new Error(result.errmsg);
        }
    }
    /**
     * Requests a special permissions. This should be called once on bundle
     * startup as it requires starting the activity. Special permissions must
     * be explicitly enabled in the settings one after another.
     */
    async requestSpecial(permission) {
        const result = await this.rawRequest("request_special", {
            permission: permission,
        });
        if (!result.success) {
            throw new Error(result.errmsg);
        }
    }
    /**
     * Captures a screenshot and returns it as a buffer.
     */
    async screenshot() {
        return await this.rawAdbBinary(["shell", "screencap", "-p"]);
    }
    /**
     * Activates the display.
     */
    async wakeUp() {
        await this.rawRequest("wake_up", {});
    }
    /**
     * Shows a toast (little notification that pops up at the bottom of the screen for a short while)
     */
    async toast(text) {
        await this.rawRequest("show_toast", {
            text: text,
        });
    }
    /**
     * Gets a volume stream for a given channel.
     */
    volume(channel) {
        return new VolumeStream(this, channel);
    }
    async getSensor(id) {
        const result = await this.rawRequest("check_availability", {
            type: "sensor",
            value: id,
        });
        if (!result.available) {
            throw new Error(`Sensor of type ${id} is not available on the device.`);
        }
        switch (id) {
            case "gps":
                return new GpsSensor(this);
            case "motion":
                return new MotionSensor(this);
            case "magnetic":
                return new MagneticSensor(this);
            case "light":
                return new LightSensor(this);
        }
    }
    /**
     * Sends a notification to the status bar of the device.
     * @param title The title of the notification
     * @param text The text to display
     * @param properties Additional properties for the notification
     * @param callback Optionally a callback function that is called when the user taps on the notification
     */
    async notify(title, text, properties, callback) {
        await this.rawRequest("notify", {
            title: title,
            text: text,
            properties: properties,
        }, callback);
    }
    /**
     * Gets the TelephonyManager for this device. If this device is not capable of telephony features,
     * the promise is rejected.
     */
    async getTelephonyManager() {
        const result = await this.rawRequest("check_availability", {
            type: "system",
            value: "telephony",
        });
        if (!result.available) {
            throw new Error("The device does not implement telephony features.");
        }
        return new TelephonyManager(this);
    }
    /**
     * Gets the WifiManager for this device. If this device is not capable of wifi features,
     * the promise is rejected.
     */
    async getWifiManager() {
        const result = await this.rawRequest("check_availability", {
            type: "system",
            value: "wifi",
        });
        if (!result.available) {
            throw new Error("The device does not implement wifi features.");
        }
        return new WifiManager(this);
    }
    equals(other) {
        return this === other;
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                                       //
    //   METHODS FROM HERE ONWARDS UNTIL END OF CLASS Android ARE NOT MEANT TO BE CALLED BY BUNDLES.         //
    //   THEY MAY GIVE MORE POSSIBILITIES BUT YOU CAN ALSO BREAK MUCH WITH IT. CALL THEM AT YOUR OWN RISK.   //
    //                                                                                                       //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    addDisconnectHandler(handler) {
        this.disconnectHandlers.push(handler);
    }
    removeDisconnectHandler(handler) {
        const index = this.disconnectHandlers.indexOf(handler);
        if (index >= 0) {
            this.disconnectHandlers.splice(index, 1);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async rawRequest(action, data, callback) {
        const id = this.nextId++;
        const requestData = JSON.stringify(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = new Promise((resolve, reject) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let eventFunc;
            if (callback === undefined) {
                eventFunc = undefined;
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                eventFunc = (evt) => {
                    callback(evt.data);
                };
            }
            this.pending.set(id, [resolve, reject, eventFunc]);
            this.rawAdb([
                "shell",
                "am",
                "broadcast",
                "-a",
                "nodecg-io.actions.ACT",
                "-c",
                "android.intent.category.DEFAULT",
                "-n",
                "io.github.noeppi_noeppi.nodecg_io_android/io.github.noeppi_noeppi.nodecg_io_android.Receiver",
                "-e",
                "action",
                quote(action),
                "-e",
                "data",
                quote(requestData),
                "-e",
                "id",
                `${id}`,
                "-e",
                "port",
                `${this.devicePort}`,
            ]).then();
        });
        const json = await result;
        if (json.success) {
            return json.data;
        }
        else if ("data" in json && "error_msg" in json.data) {
            throw new Error(json.data.error_msg);
        }
        else {
            throw new Error("unknown");
        }
    }
    async rawAdb(command) {
        const childProcess = (0, child_process_1.spawn)("adb", ["-s", this.device].concat(command), {
            stdio: ["ignore", "pipe", process.stderr],
            env: process.env,
        });
        const output = await (0, stringio_1.readableToString)(childProcess.stdout, "utf-8");
        await (0, stringio_1.onExit)(childProcess);
        if (childProcess.exitCode !== null && childProcess.exitCode !== 0) {
            throw new Error("adb exit code: " + childProcess.exitCode);
        }
        return output;
    }
    async rawAdbBinary(command) {
        const childProcess = (0, child_process_1.spawn)("adb", ["-s", this.device].concat(command), {
            stdio: ["ignore", "pipe", process.stderr],
            env: process.env,
        });
        const output = await (0, get_stream_1.buffer)(childProcess.stdout);
        await (0, stringio_1.onExit)(childProcess);
        if (childProcess.exitCode !== null && childProcess.exitCode !== 0) {
            throw new Error("adb exit code: " + childProcess.exitCode);
        }
        return output;
    }
    async rawAdbExitCode(command) {
        const childProcess = (0, child_process_1.spawn)("adb", ["-s", this.device].concat(command), {
            stdio: ["ignore", "pipe", process.stderr],
            env: process.env,
        });
        await (0, stringio_1.onExit)(childProcess);
        if (childProcess.exitCode === null) {
            return 0;
        }
        else {
            return childProcess.exitCode;
        }
    }
}
exports.Android = Android;
/**
 * Used to control a volume channel on the device.
 */
class VolumeStream {
    constructor(android, channel) {
        this.android = android;
        this.channel = channel;
    }
    /**
     * Gets the volume of the channel in range from 0 to getMaxVolume()
     */
    async getVolume() {
        const result = await this.android.rawRequest("get_volume", {
            channel: this.channel,
        });
        return result.volume;
    }
    /**
     * Gets the maximum volume of this channel
     */
    async getMaxVolume() {
        const result = await this.android.rawRequest("get_max_volume", {
            channel: this.channel,
        });
        return result.volume;
    }
    /**
     * Sets the volume for this channel
     * @param volume The new volume
     * @param flags The flags to use when setting the volume
     */
    async setVolume(volume, flags) {
        await this.android.rawRequest("set_volume", {
            channel: this.channel,
            volume: volume,
            flags: flags,
        });
    }
    /**
     * Changes the volume. Can also be used to mute and unmute the channel.
     * @param adjustment The operation to perform
     * @param flags The flags to use when setting the volume
     */
    async adjustVolume(adjustment, flags) {
        await this.android.rawRequest("adjust_volume", {
            channel: this.channel,
            adjustment: adjustment,
            flags: flags,
        });
    }
    equals(other) {
        return this.android.equals(other.android) && this.channel === other.channel;
    }
}
exports.VolumeStream = VolumeStream;
/**
 * The package manager is used to query information about installed packages
 */
class PackageManager {
    constructor(android) {
        this.android = android;
    }
    /**
     * Gets all package identifiers installed.
     */
    async getInstalledPackages() {
        const result = await this.android.rawRequest("get_packages", {});
        return result.packages;
    }
    /**
     * Gets a package by identifier. If the package is not installed, the promise is rejected.
     */
    async getPackage(id) {
        await this.android.rawRequest("get_package", {
            package: id,
        });
        return new Package(this.android, id);
    }
    equals(other) {
        return this.android.equals(other.android);
    }
}
exports.PackageManager = PackageManager;
/**
 * An installed package.
 */
class Package {
    constructor(android, id) {
        this.android = android;
        this.id = id;
    }
    /**
     * Gets all activities defined by this package.
     */
    async getActivities() {
        const result = await this.android.rawRequest("get_activities", {
            package: this.id,
        });
        const activities = [];
        result.activities.forEach((a) => activities.push(new Activity(this.android, this, a)));
        return activities;
    }
    /**
     * Gets one activity by id.
     */
    async getActivity(activity) {
        await this.android.rawRequest("get_activity", {
            package: this.id,
            activity: activity,
        });
        return new Activity(this.android, this, activity);
    }
    /**
     * Gets the installed version of this package.
     */
    async getVersion() {
        const result = await this.android.rawRequest("get_package_version", {
            package: this.id,
        });
        return result.version;
    }
    /**
     * Gets usage statistics for this package for a given period of time.
     * Required the special `statistics` permission.
     */
    async getUsageStats(time) {
        const result = await this.android.rawRequest("get_usage_statistics", {
            package: this.id,
            start_date: time.start === undefined ? undefined : time.start.getDate(),
            end_date: time.end === undefined ? undefined : time.end.getDate(),
        });
        const stats = result.stats;
        if (stats !== undefined) {
            return {
                package: stats.package,
                start: new Date(stats.start),
                end: new Date(stats.end),
                lastTimeUsed: new Date(stats.lastTimeUsed),
                lastTimeVisible: new Date(stats.lastTimeVisible),
                totalTimeUsed: stats.totalTimeUsed,
                totalTimeVisible: stats.totalTimeVisible,
            };
        }
        else {
            return undefined;
        }
    }
    equals(other) {
        return this.android.equals(other.android) && this.id === other.id;
    }
}
exports.Package = Package;
/**
 * An activity. (The thing of a package that is launched when pressing an icon on the home screen.)
 */
class Activity {
    constructor(android, pkg, id) {
        this.android = android;
        this.pkg = pkg;
        this.id = id;
    }
    /**
     * Starts the activity.
     */
    async start() {
        await this.android.rawAdb([
            "shell",
            "am",
            "start",
            "-a",
            "android.intent.action.MAIN",
            "-c",
            "android.intent.category.LAUNCHER",
            "-n",
            quote(this.pkg.id + "/" + this.id),
        ]);
    }
    equals(other) {
        return this.pkg.equals(other.pkg) && this.id === other.id;
    }
}
exports.Activity = Activity;
/**
 * Allows access to the GPS sensor of the device. Requires the `gps` permission.
 */
class GpsSensor {
    constructor(android) {
        this.android = android;
    }
    /**
     * Checks whether GPS is activated.
     */
    async isActive() {
        const result = await this.android.rawRequest("gps_active", {});
        return result.active;
    }
    /**
     * Gets the last known position or undefined if there's no last known position. The promise id rejected if
     * GPS is turned off. Use isActive() to check before.
     */
    async getLastKnownLocation() {
        const result = await this.android.rawRequest("gps_last_known_location", {});
        return result.location;
    }
    /**
     * Subscribes for location updates. If GPS is turned off, you will get no updates. Always cancel the
     * returned subscription if you don't need more updates.
     *
     * @param listener The function to be called when the location updates.
     * @param time The minimum time (in milliseconds) between two location updates sent. Set this as high as possible.
     * @param distance The minimum distance (in meters) between two location updates
     */
    async subscribeLocations(listener, time = 5000, distance = 0) {
        const result = await this.android.rawRequest("gps_subscribe", {
            time: time,
            distance: distance,
        }, listener);
        return Subscription.fromResult(this.android, result);
    }
    equals(other) {
        return this.android.equals(other.android);
    }
}
exports.GpsSensor = GpsSensor;
/**
 * A subscription is returned when the device keeps sending data. Cancel the subscription to
 * stop delivery of said data.
 */
class Subscription {
    constructor(android, id) {
        this.android = android;
        this.id = id;
    }
    /**
     * Cancels the subscription
     */
    async cancel() {
        await this.android.rawRequest("cancel_subscription", {
            subscription_id: this.id,
        });
    }
    static fromResult(android, result) {
        return new Subscription(android, result.subscription_id);
    }
    equals(other) {
        return this.android.equals(other.android) && this.id === other.id;
    }
}
exports.Subscription = Subscription;
/**
 * This class unifies all the motion sensors on the device.
 */
class MotionSensor {
    constructor(android) {
        this.android = android;
    }
    /**
     * Gets the current motion of the device.
     */
    async motion() {
        const result = await this.android.rawRequest("motion_current", {});
        return result.motion;
    }
    async subscribeMotion(part, listener, time) {
        const result = await this.android.rawRequest("motion_subscribe", {
            part: part,
            time: time === undefined ? 100 : time,
        }, listener);
        return Subscription.fromResult(this.android, result);
    }
    equals(other) {
        return this.android.equals(other.android);
    }
}
exports.MotionSensor = MotionSensor;
/**
 * A sensor for magnetic field data.
 */
class MagneticSensor {
    constructor(android) {
        this.android = android;
    }
    /**
     * Gets the magnetic field.
     */
    async magneticField() {
        const result = await this.android.rawRequest("magnetic_field", {});
        return result.magnetic_field;
    }
    equals(other) {
        return this.android.equals(other.android);
    }
}
exports.MagneticSensor = MagneticSensor;
/**
 * A light sensor
 */
class LightSensor {
    constructor(android) {
        this.android = android;
    }
    /**
     * Gets the ambient light in lux.
     */
    async ambientLight() {
        const result = await this.android.rawRequest("ambient_light", {});
        return result.light;
    }
    equals(other) {
        return this.android.equals(other.android);
    }
}
exports.LightSensor = LightSensor;
/**
 * Manager for telephony features
 */
class TelephonyManager {
    constructor(android) {
        this.android = android;
        this.smsManager = new SmsManager(android);
    }
    /**
     * Gets a list of all Telephonies for this device. Requires the `phone` permission
     */
    async getTelephonies() {
        const result = await this.android.rawRequest("get_telephonies", {});
        const ids = result.telephonies;
        return ids.map((id) => new Telephony(this.android, this, id));
    }
    /**
     * Enables or disables Airplane Mode
     */
    async setAirplane(enabled) {
        const result = await this.android.rawAdbExitCode([
            "shell",
            "settings",
            "put",
            "global",
            "airplane_mode_on",
            enabled ? "1" : "0",
        ]);
        if (result !== 0) {
            throw new Error(`Could not change airplane mode state: failed to change settings: ${result}`);
        }
    }
    equals(other) {
        return this.android.equals(other.android);
    }
}
exports.TelephonyManager = TelephonyManager;
/**
 * A mobile subscription on the device. I could not find concrete information on what is considered
 * a mobile subscription but but it's probably just one per UICC.
 */
class Telephony {
    constructor(android, manager, id) {
        this.sms_provider = "telephony";
        this.android = android;
        this.manager = manager;
        this.id = id;
        this.sms_resolve_data = {
            telephony: id,
        };
    }
    /**
     * Gets the properties for this Telephony
     */
    async properties() {
        const result = await this.android.rawRequest("get_telephony_properties", {
            telephony: this.id,
        });
        return result.properties;
    }
    /**
     * Request a connection to this Telephony. This will turn off airplane mode if it's enabled.
     * IMPORTANT: This will throw an error if running on Android 10 or lower.
     * Please note that this requires user interaction and WILL launch the activity.
     */
    async requestConnection(connected_listener) {
        try {
            await this.manager.setAirplane(false);
        }
        catch (err) {
            //
        }
        await this.android.rawRequest("request_telephony_connection", {
            telephony: this.id,
        }, connected_listener);
    }
    equals(other) {
        return this.manager.equals(other.manager) && this.id === other.id;
    }
}
exports.Telephony = Telephony;
/**
 * Manager to read and send SMS and MS
 */
class SmsManager {
    constructor(android) {
        this.android = android;
    }
    /**
     * Gets all SMS matching the given category and filter. This requires the `read_sms` permission.
     */
    async getSMS(category, filter) {
        return await this.getMessages(category, filter, "get_sms", (data) => new Sms(this.android, data));
    }
    /**
     * Gets all MMS matching the given category and filter. This requires the `read_sms` permission.
     */
    async getMMS(category, filter) {
        return await this.getMessages(category, filter, "get_mms", (data) => new Mms(this.android, data));
    }
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
    async sendSMS(telephony, address, text, sent, delivered) {
        let addressStr;
        if (address instanceof Recipient) {
            addressStr = address.address;
        }
        else if (address instanceof Contact) {
            const phone_numbers = await address.getData("phone");
            if (phone_numbers.length <= 0 || phone_numbers[0] === undefined) {
                throw new Error(`Can't use contact as sms receiver: No phone number available for contact ${address.displayName}`);
            }
            addressStr = phone_numbers[0].number;
        }
        else {
            addressStr = address;
        }
        await this.android.rawRequest("send_sms", {
            telephony: telephony.id,
            address: addressStr,
            text: text,
        }, (data) => {
            if (data.type === "sent" && sent !== undefined) {
                sent(data.code);
            }
            else if (data.type === "delivered" && delivered !== undefined) {
                delivered();
            }
        });
    }
    async getMessages(category, filter, method, factory) {
        const provider = filter === undefined ? "everything" : filter.sms_provider;
        const filter_data = filter === undefined ? {} : filter.sms_resolve_data;
        const result = await this.android.rawRequest(method, {
            sms_category: category,
            sms_filter: provider,
            sms_resolve_data: filter_data,
        });
        const sms_array = result.sms;
        return sms_array.map(factory);
    }
    equals(other) {
        return this.android.equals(other.android);
    }
}
exports.SmsManager = SmsManager;
/**
 * Common parts of a message that ies either sms or mms.
 */
class AbstractMessage {
    // eslint-disable-next-line
    constructor(android, msg) {
        this.android = android;
        this.id = msg.id;
        this.thread_id = msg.thread_id;
        this.telephony_id = msg.telephony_id;
        this.subject = msg.subject;
        this.text = msg.text;
        this.received = msg.received === undefined ? undefined : new Date(msg.received);
        this.sent = msg.sent === undefined ? undefined : new Date(msg.sent);
        this.read = msg.read;
        this.seen = msg.seen;
    }
    /**
     * Gets the thread for this message. A thread is identified by the phone numbers participating in it.
     */
    async getThread() {
        const result = await this.android.rawRequest("get_thread_for_message", {
            thread_id: this.thread_id,
        });
        if (result.available) {
            return new MessageThread(this.android, result.thread);
        }
        else {
            return undefined;
        }
    }
    /**
     * Gets the telephony object that was used to send or receive the message. This is an optional value.
     * This requires the `phone` permission
     */
    async getTelephony() {
        const result = await this.android.rawRequest("get_telephony_for_message", {
            telephony_id: this.telephony_id,
        });
        if (result.available) {
            return new Telephony(this.android, await this.android.getTelephonyManager(), this.telephony_id);
        }
        else {
            return undefined;
        }
    }
}
exports.AbstractMessage = AbstractMessage;
/**
 * A SMS message
 */
class Sms extends AbstractMessage {
    // eslint-disable-next-line
    constructor(android, msg) {
        super(android, msg);
        this.messageType = "sms";
        this.address = msg.address;
        this.sender_id = msg.sender_id;
    }
    /**
     * Gets the phone number who sent this sms. This is not always available. Try to get this via the
     * MessageThread instead.
     */
    async getSender() {
        const result = await this.android.rawRequest("get_sms_recipient", {
            sender_id: this.sender_id,
        });
        if (result.available) {
            return new Recipient(this.android, result.recipient);
        }
        else {
            return undefined;
        }
    }
}
exports.Sms = Sms;
/**
 * A MMS message
 */
class Mms extends AbstractMessage {
    // eslint-disable-next-line
    constructor(android, msg) {
        super(android, msg);
        this.messageType = "mms";
        this.textOnly = msg.textOnly;
        this.contentType = msg.contentType;
        this.contentLocation = msg.contentLocation;
        this.expiry = msg.expiry === undefined ? undefined : new Date(msg.expiry);
    }
}
exports.Mms = Mms;
/**
 * A thread is identified by the phone number participating in it. A thread may
 * contain SMS and MMS messages.
 */
class MessageThread {
    // eslint-disable-next-line
    constructor(android, msg) {
        this.sms_provider = "thread";
        this.android = android;
        this.id = msg.id;
        this.sms_resolve_data = {
            thread_id: msg.id,
        };
    }
    /**
     * Gets all participants of this thread.
     */
    async getRecipients() {
        const result = await this.android.rawRequest("get_thread_recipients", {
            id: this.id,
        });
        const recipients = result.recipients;
        return recipients.map((data) => new Recipient(this.android, data));
    }
}
exports.MessageThread = MessageThread;
/**
 * Represents a phone number. In some cases there's no phone number given but
 * a name. (Often when the mobile provider sends sms)
 */
class Recipient {
    // eslint-disable-next-line
    constructor(android, msg) {
        this.android = android;
        this.id = msg.id;
        this.address = msg.address;
    }
    /**
     * Get the contact for this recipient. Multiple recipients may map to the same
     * contact as a contact can hold multiple phone numbers. Requires the `contacts`
     * permission. If the same phone number is stored in multiple contacts, the first
     * match is returned. However this is guaranteed to always return the same contact
     * even if more than one exists unless the contact database gets changed between calls.
     */
    async toContact() {
        return await this.android.contactManager.findContact("phone", this.address);
    }
    equals(other) {
        return this.android.equals(other.android) && this.id === other.id;
    }
}
exports.Recipient = Recipient;
/**
 * Manager for contacts on the device.
 */
class ContactManager {
    constructor(android) {
        this.android = android;
    }
    /**
     * Looks up a contact. If the same data is stored in multiple contacts, the first
     * match is returned. However this is guaranteed to always return the same contact
     * even if more than one exists unless the contact database gets changed between calls.
     * To find out what columns are searched for which ContactDataId, see the documentation
     * there.
     * This require the `contacts` permission.
     */
    async findContact(dataId, value) {
        const result = await this.android.rawRequest("find_contact", {
            dataId: dataId,
            value: value,
        });
        const contactId = result.contact_id;
        if (contactId === undefined) {
            return undefined;
        }
        else {
            return new Contact(this.android, contactId[0], contactId[1]);
        }
    }
    /**
     * Looks up a contact. This will return all contacts, that have the given data stored.
     * They're not guaranteed to be returned in the same order between requests. To find out
     * what columns are searched for which ContactDataId, see the documentation there.
     * This require the `contacts` permission.
     */
    async findContacts(dataId, value) {
        const result = await this.android.rawRequest("find_contacts", {
            dataId: dataId,
            value: value,
        });
        const contactIds = result.contact_ids;
        return contactIds.map((elem) => new Contact(this.android, elem[0], elem[1]));
    }
    /**
     * Gets all contacts on the phone. Requires the `contacts` permission.
     */
    async getAllContacts() {
        const result = await this.android.rawRequest("get_all_contacts", {});
        const contactIds = result.contact_ids;
        return contactIds.map((elem) => new Contact(this.android, elem[0], elem[1]));
    }
    equals(other) {
        return this.android.equals(other.android);
    }
}
ContactManager.PHONE = ["com.android.localphone", "PHONE"];
exports.ContactManager = ContactManager;
/**
 * One contact
 */
class Contact {
    constructor(android, id, displayName) {
        this.android = android;
        this.id = id;
        this.displayName = displayName;
    }
    /**
     * Gets the status of the contact. I don't really know what this is used for.
     */
    async getStatus() {
        const result = await this.android.rawRequest("contact_status", {
            id: this.id,
        });
        return result.status;
    }
    /**
     * Gets detailed name info about this contact.
     */
    async getName() {
        const result = await this.getData("name");
        if (result === undefined) {
            return {
                display_name: "",
                style: "unset",
            };
        }
        else {
            return result;
        }
    }
    async getData(dataId, account) {
        const acc = account === undefined ? ContactManager.PHONE : account;
        const result = await this.android.rawRequest("get_contact_data", {
            id: this.id,
            dataId: dataId,
            contact_account: acc,
        });
        // Return type from nodecg-io-android is always either an array (named data) that is always present but may
        // be empty or a value (also named data) that may be undefined. Type depends on ContactDataId
        return result.data;
    }
    equals(other) {
        return this.android.equals(other.android) && this.id === other.id;
    }
}
exports.Contact = Contact;
/**
 * Manager for wifi related features
 */
class WifiManager {
    constructor(android) {
        this.android = android;
    }
    /**
     * Retrieves information about what features this device supports.
     */
    async getInfo() {
        const result = await this.android.rawRequest("wifi_information", {});
        return result.info;
    }
    /**
     * Retrieves information about the current state of the device.
     * WifiState in itself has not may fields. Wrap it in a check for WifiState#connected to get access to
     * fields only available when connected.
     * Because it's technically possible to get location data from the available wlan networks, some of the
     * fields in WifiState may hold meaningless values if the `gps` permission is not granted.
     */
    async getState() {
        const result = await this.android.rawRequest("wifi_state", {});
        return result.state;
    }
    /**
     * Retrieves information about currently available WLAN networks.
     * Because it's technically possible to get location data from the available wlan networks, some of the
     * fields in WifiScanResult may hold meaningless values if the `gps` permission is not granted.
     * For the same reason this will always throw an error if location services are disabled.
     * Note that this method may take a very long time.
     */
    async scanNetworks() {
        // Because this was restricted to 1 scan every 30 minutes to save battery we need to disable this first.
        // Also we need to disable the background location throttle
        // Query current value:
        const wifiThrottleEnabled = (await this.android.rawAdb(["shell", "settings", "get", "global", "wifi_scan_throttle_enabled"])).trim();
        const locationThrottleMs = (await this.android.rawAdb([
            "shell",
            "settings",
            "get",
            "global",
            "location_background_throttle_interval_ms",
        ])).trim();
        // If we disconnect from the device while still waiting for scan results we need to change the settings back
        const handler = async () => {
            // If the queried settings value is 'null' the setting does not exist so we can't set it. In this case
            // there will have been a fail probably in the call above but we might as well have hit the one scan
            // that is allowed every 30 minutes.
            try {
                // settingValue = 0 means the setting was disabled before so we just leave it disabled.
                if (wifiThrottleEnabled !== "null" && wifiThrottleEnabled !== "0") {
                    await this.android.rawAdb([
                        "shell",
                        "settings",
                        "put",
                        "global",
                        "wifi_scan_throttle_enabled",
                        wifiThrottleEnabled,
                    ]);
                }
            }
            catch (err) {
                // Ignore
            }
            try {
                await this.android.rawAdb([
                    "shell",
                    "settings",
                    "put",
                    "global",
                    "location_background_throttle_interval_ms",
                    locationThrottleMs,
                ]);
            }
            catch (err) {
                // Ignore
            }
        };
        this.android.addDisconnectHandler(handler);
        // Disable wifi scan throttle
        await this.android.rawAdbExitCode(["shell", "settings", "put", "global", "wifi_scan_throttle_enabled", "0"]);
        await this.android.rawAdbExitCode([
            "shell",
            "settings",
            "put",
            "global",
            "location_background_throttle_interval_ms",
            "0",
        ]);
        // Fetch the result from the app.
        try {
            const result = await this.android.rawRequest("scan_wifi", {});
            return result.results;
        }
        finally {
            // Unregister the handler and call it.
            this.android.removeDisconnectHandler(handler);
            await handler();
        }
    }
    /**
     * Enables or disables WLAN
     */
    async setEnabled(enabled) {
        const result = await this.android.rawAdbExitCode(["shell", "svc", "wifi", enabled ? "enable" : "disable"]);
        if (result !== 0) {
            throw new Error(`Could not change wifi state: scv returned exit code ${result}`);
        }
    }
    /**
     * Request a connection to a WLAN network. This willl turn on wifi if it's disabled.
     * IMPORTANT: This is not meant to make the phone connect to an already saved network. This can be used to
     * create a connection to a new network where the user then does not need to enter a passphrase. The
     * connection is temporary. That means when it is lost, the user can not just reconnect but you need to call
     * this again.
     * IMPORTANT II: This will throw an error if running on Android 9 or lower.
     * Please note that this requires user interaction and WILL launch the activity.
     */
    async requestConnection(request, connected_listener) {
        try {
            await this.setEnabled(true);
        }
        catch (err) {
            //
        }
        await this.android.rawRequest("request_wifi_connection", request, connected_listener);
    }
    equals(other) {
        return this.android.equals(other.android);
    }
}
exports.WifiManager = WifiManager;
/**
 * Can be used to access files on the device. This mostly depends on parsing the output of
 * shell commands because that gives access to more parts of the file system on a non-rooted
 * device. It seems to be stable between versions and devices. Let's hope...
 *
 * Important: This only works with absolute paths. Using non-absolute paths can lead to
 * unpredictable results.
 */
class FileManager {
    constructor(android) {
        this.android = android;
        this.path = new PathManager(android);
    }
    /**
     * Gets the file names of all entries in a directory. Using non-directory paths may
     * produce unpredictable results.
     */
    async list(path) {
        return (await this.android.rawAdb(["shell", "ls", "-1", quote(path)]))
            .split("\n")
            .map(unquoteShell)
            .map((e) => e.trim())
            .filter((e) => e !== "")
            .map((e) => (e.endsWith("/") ? e.substring(0, e.length - 1) : e));
    }
    /**
     * Gets some information about a file.
     */
    async file(path) {
        return await this.android.rawAdb(["shell", "-b", path]);
    }
    /**
     * Downloads a file from the device. On some platforms, this gets incredibly slow when used on
     * files larger than 6MB.
     */
    async download(device, local) {
        await this.android.rawAdb(["shell", "pull", quote(device), quote(local)]);
    }
    /**
     * Uploads a file to the device. On some platforms, this gets incredibly slow when used on
     * files larger than 6MB.
     */
    async upload(local, device) {
        await this.android.rawAdb(["shell", "push", quote(local), quote(device)]);
    }
}
exports.FileManager = FileManager;
/**
 * See FileManager
 */
class PathManager {
    constructor(android) {
        this.android = android;
    }
    /**
     * Normalizes a path. For example this will turn `/a/b/../c` into `/a/c`.
     * This method may but doesn't need to resolve symbolic links.
     */
    async normalize(path) {
        return await this.android.rawAdb(["shell", "readlink", "-fm", quote(path)]);
    }
    /**
     * Gets whether a path exists.
     */
    async exists(path) {
        return (await this.android.rawAdbExitCode(["shell", "test", "-e", quote(path)])) === 0;
    }
    /**
     * Gets whether a path is a regular file.
     */
    async isfile(path) {
        return (await this.android.rawAdbExitCode(["shell", "test", "-f", quote(path)])) === 0;
    }
    /**
     * Gets whether a path is a directory.
     */
    async isdir(path) {
        return (await this.android.rawAdbExitCode(["shell", "test", "-d", quote(path)])) === 0;
    }
    /**
     * Gets whether a path is a symbolic link.
     */
    async islink(path) {
        return (await this.android.rawAdbExitCode(["shell", "test", "-L", quote(path)])) === 0;
    }
    /**
     * Gets whether a path is readable by you.
     */
    async readable(path) {
        return (await this.android.rawAdbExitCode(["shell", "test", "-r", quote(path)])) === 0;
    }
    /**
     * Gets whether a path is writable by you.
     */
    async writable(path) {
        return (await this.android.rawAdbExitCode(["shell", "test", "-w", quote(path)])) === 0;
    }
    /**
     * Gets the link target if a path is a symbolic link or a path that points to the same file if not.
     */
    async target(path) {
        return await this.android.rawAdb(["shell", "readlink", "-f", quote(path)]);
    }
}
exports.PathManager = PathManager;
function quote(arg) {
    return '"' + arg.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/'/g, "\\'").replace(/\$/g, "\\$") + '"';
}
function unquoteShell(arg) {
    return arg
        .replace(/\\\$/g, "$")
        .replace(/\\'/g, "'")
        .replace(/\\"/g, '"')
        .replace(/\\ /g, " ")
        .replace(/\\\\/g, "\\");
}
//# sourceMappingURL=android.js.map