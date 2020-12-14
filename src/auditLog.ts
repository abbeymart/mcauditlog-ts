/**
 * @Author: abbeymart | Abi Akindele | @Created: 2020-07-15
 * @Company: Copyright 2020 Abi Akindele  | mConnect.biz
 * @License: All Rights Reserved | LICENSE.md
 * @Description: mc-central-ts: audit-log entry point | transactions log
 */

// Import required module/function(s)
import { getResMessage, ResponseMessage } from "@mconnect/mcresponse";

//types
interface OptionsType {
    auditTable?: string;
    collName?: string;
    collDocuments?: any;
    newCollDocuments?: any;
    loginParams?: any;
    logoutParams?: any;
}

class AuditLog {
    private auditTable: string;
    private auditModel: any;

    constructor(auditModel: any, options?: OptionsType) {
        this.auditModel = auditModel;
        // not used (placeholder) - TBD
        this.auditTable = options && options.auditTable ? options.auditTable : "audits";
    }

    async createLog(collName: string, collDocuments: any, userId: string): Promise<ResponseMessage> {
        // Check/validate the attributes / parameters
        let errorMessage = "";
        if (!collName) {
            errorMessage = errorMessage ?
                errorMessage + " | Table or Collection name is required." :
                "Table or Collection name is required.";
        }
        if (!userId) {
            errorMessage = errorMessage ? errorMessage + " | userId is required." :
                "userId is required.";
        }
        if (!collDocuments) {
            errorMessage = errorMessage ?
                errorMessage + " | Created record(s) information is required." :
                "Created record(s) information is required.";
        }
        if (errorMessage) {
            return getResMessage("logError", {
                message: errorMessage,
            });
        }

        try {
            // insert audit record
            const result = await this.auditModel.build({
                collName     : collName,
                collDocuments: collDocuments,
                logType      : "create",
                logBy        : userId,
                logAt        : new Date(),
            });

            await result.save();

            if (result) {
                return getResMessage("success", {
                    value: result,
                });
            } else {
                console.log("create-result: ", result);
                return getResMessage("insertError", {
                    value  : result,
                    message: "no response from the server",
                });
            }
        } catch (error) {
            console.error("Error saving create-audit record(s): ", error);
            return getResMessage("insertError", {
                message: "Error saving create-audit record(s): " + error.message,
            });
        }
    }

    async updateLog(collName: string, collDocuments: any, newCollDocuments: any, userId: string): Promise<ResponseMessage> {
        // Check/validate the attributes / parameters
        let errorMessage = "";
        if (!collName) {
            errorMessage = errorMessage ?
                errorMessage + " | Table or Collection name is required." :
                "Table or Collection name is required.";
        }
        if (!userId) {
            errorMessage = errorMessage ? errorMessage + " | userId is required." :
                "userId is required.";
        }
        if (!collDocuments) {
            errorMessage = errorMessage ?
                errorMessage + " | Current record(s) information is required." :
                "Current record(s) information is required.";
        }
        if (!newCollDocuments) {
            errorMessage = errorMessage ? errorMessage + " | Updated record(s) information is required." :
                "Updated record(s) information is required.";
        }
        if (errorMessage) {
            return getResMessage("logError", {
                message: errorMessage,
            });
        }

        try {
            // insert audit record
            const result = await this.auditModel.create({
                collName        : collName,
                collDocuments   : collDocuments,
                newCollDocuments: newCollDocuments,
                logType         : "update",
                logBy           : userId,
                logAt           : new Date(),
            });

            if (result) {
                return getResMessage("success", {
                    value: result,
                });
            } else {
                return getResMessage("insertError");
            }
        } catch (error) {
            console.error("Error saving update-audit record(s): ", error);
            return getResMessage("insertError", {
                message: "Error saving update-audit record(s): " + error.message,
            });
        }
    }

    async readLog(collName: string, collDocuments: any, userId: string = ""): Promise<ResponseMessage> {
        // validate params/values
        let errorMessage = "";
        if (!collName) {
            errorMessage = errorMessage ?
                errorMessage + " | Table or Collection name is required." :
                "Table or Collection name is required.";
        }
        if (!collDocuments) {
            errorMessage = errorMessage ?
                errorMessage + " | Search keywords or Read record(s) information is required." :
                "Search keywords or Read record(s) information is required.";
        }
        if (errorMessage) {
            return getResMessage("logError", {
                message: errorMessage,
            });
        }

        try {
            // insert audit record
            const result = await this.auditModel.create({
                collName     : collName,
                collDocuments: collDocuments,
                logType      : "read",
                logBy        : userId,
                logAt        : new Date(),
            });

            if (result) {
                return getResMessage("success", {
                    value: result,
                });
            } else {
                return getResMessage("insertError");
            }
        } catch (error) {
            console.error("Error inserting read/search-audit record(s): ", error);
            return getResMessage("insertError", {
                message: "Error inserting read/search-audit record(s):" + error.message,
            });
        }
    }

    async deleteLog(collName: string, collDocuments: any, userId: string): Promise<ResponseMessage> {
        // Check/validate the attributes / parameters
        let errorMessage = "";
        if (!collName) {
            errorMessage = errorMessage ?
                errorMessage + " | Table or Collection name is required." :
                "Table or Collection name is required.";
        }
        if (!userId) {
            errorMessage = errorMessage ? errorMessage + " | userId is required." :
                "userId is required.";
        }
        if (!collDocuments) {
            errorMessage = errorMessage ?
                errorMessage + " | Deleted record(s) information is required." :
                "Deleted record(s) information is required.";
        }
        if (errorMessage) {
            return getResMessage("logError", {
                message: errorMessage,
            });
        }

        try {
            // insert audit record
            const result = await this.auditModel.create({
                collName     : collName,
                collDocuments: collDocuments,
                logType      : "remove",
                logBy        : userId,
                logAt        : new Date(),
            });

            if (result) {
                return getResMessage("success", {
                    value: result,
                });
            } else {
                return getResMessage("insertError");
            }
        } catch (error) {
            console.error("Error saving delete-audit record(s): ", error);
            return getResMessage("insertError", {
                message: "Error inserting delete-audit record(s):" + error.message,
            });
        }
    }

    async loginLog(loginParams: any, userId: string = "", collName = "users"): Promise<ResponseMessage> {
        // validate params/values
        let errorMessage = "";
        if (!loginParams) {
            errorMessage = errorMessage ? errorMessage + " | Login information is required." :
                "Login information is required."
        }
        if (errorMessage) {
            return getResMessage("logError", {
                message: errorMessage,
            });
        }

        try {
            // insert audit record
            const result = await this.auditModel.create({
                collName     : collName,
                collDocuments: loginParams,
                logType      : "login",
                logAt        : new Date(),
            });

            if (result) {
                return getResMessage("success", {
                    value: result,
                });
            } else {
                return getResMessage("insertError");
            }
        } catch (error) {
            console.error("Error inserting login-audit record(s): ", error);
            return getResMessage("insertError", {
                message: "Error inserting login-audit record(s):" + error.message,
            });
        }
    }

    async logoutLog(logoutParams: any, userId: string = "", collName = "users"): Promise<ResponseMessage> {
        // validate params/values
        let errorMessage = "";
        if (!userId) {
            errorMessage = errorMessage ? errorMessage + " | userId is required." :
                "userId is required.";
        }
        if (!logoutParams) {
            errorMessage = errorMessage ? errorMessage + " | Logout information is required." :
                "Logout information is required.";
        }
        if (errorMessage) {
            return getResMessage("logError", {
                message: errorMessage,
            });
        }

        try {
            // insert audit record
            const result = await this.auditModel.create({
                collName     : collName,
                collDocuments: logoutParams,
                logType      : "logout",
                logBy        : userId,
                logAt        : new Date(),
            });

            if (result) {
                return getResMessage("success", {
                    value: result,
                });
            } else {
                return getResMessage("insertError");
            }
        } catch (error) {
            console.error("Error inserting logout-audit record(s): ", error);
            return getResMessage("insertError", {
                value: error,
            });
        }
    }

    async auditLog(logType: string, userId: string = "", options?: OptionsType) {
        // Check/validate the attributes / parameters
        let collName = "",
            collDocuments = null,
            newCollDocuments = null,
            loginParams = null,
            logoutParams = null,
            errorMessage = "",
            queryParams = {};

        logType = logType.toLowerCase();

        switch (logType) {
            case "create":
                collName = options && options.collName ? options.collName : "";
                collDocuments = options && options.collDocuments ? options.collDocuments : null;
                // validate params/values
                if (!collName) {
                    errorMessage = errorMessage ?
                        errorMessage + " | Table or Collection name is required." :
                        "Table or Collection name is required.";
                }
                if (!userId) {
                    errorMessage = errorMessage ? errorMessage + " | userId is required." :
                        "userId is required.";
                }
                if (!collDocuments) {
                    errorMessage = errorMessage ?
                        errorMessage + " | Created record(s) information is required." :
                        "Created record(s) information is required.";
                }
                if (errorMessage) {
                    return getResMessage("logError", {
                        message: errorMessage,
                    });
                }
                queryParams = {
                    collName     : collName,
                    collDocuments: collDocuments,
                    logType      : logType,
                    logBy        : userId,
                };
                break;
            case "update":
                collName = options && options.collName ? options.collName : "";
                collDocuments = options && options.collDocuments ? options.collDocuments : null;
                newCollDocuments = options && options.newCollDocuments ? options.newCollDocuments : null; // object or array

                // validate params/values
                if (!collName) {
                    errorMessage = errorMessage ?
                        errorMessage + " | Table or Collection name is required." :
                        "Table or Collection name is required.";
                }
                if (!userId) {
                    errorMessage = errorMessage ? errorMessage + " | userId is required." :
                        "userId is required.";
                }
                if (!collDocuments) {
                    errorMessage = errorMessage ?
                        errorMessage + " | Current record(s) information is required." :
                        "Current record(s) information is required.";
                }
                if (!newCollDocuments) {
                    errorMessage = errorMessage ? errorMessage + " | Updated record(s) information is required." :
                        "Updated record(s) information is required.";
                }
                if (errorMessage) {
                    return getResMessage("logError", {
                        message: errorMessage,
                    });
                }

                queryParams = {
                    collName        : collName,
                    collDocuments   : collDocuments,
                    newCollDocuments: newCollDocuments,
                    logType         : logType,
                    logBy           : userId,
                };
                break;
            case "remove":
            case "delete":
                collName = options && options.collName ? options.collName : "";
                collDocuments = options && options.collDocuments ? options.collDocuments : null;

                // Check/validate the attributes / parameters
                if (!collName) {
                    errorMessage = errorMessage ?
                        errorMessage + " | Table or Collection name is required." :
                        "Table or Collection name is required.";
                }
                if (!userId) {
                    errorMessage = errorMessage ? errorMessage + " | userId is required." :
                        "userId is required.";
                }
                if (!collDocuments) {
                    errorMessage = errorMessage ?
                        errorMessage + " | Deleted record(s) information is required." :
                        "Deleted record(s) information is required.";
                }
                if (errorMessage) {
                    return getResMessage("logError", {
                        message: errorMessage,
                    });
                }

                queryParams = {
                    collName     : collName,
                    collDocuments: collDocuments,
                    logType      : logType,
                    logBy        : userId,
                };
                break;
            case "read":
                collName = options && options.collName ? options.collName : "";
                collDocuments = options && options.collDocuments ? options.collDocuments : null;

                // validate params/values
                if (!collName) {
                    errorMessage = errorMessage ?
                        errorMessage + " | Table or Collection name is required." :
                        "Table or Collection name is required.";
                }
                if (!collDocuments) {
                    errorMessage = errorMessage ?
                        errorMessage + " | Search keywords or Read record(s) information is required." :
                        "Search keywords or Read record(s) information is required.";
                }
                if (errorMessage) {
                    return getResMessage("insertError", {
                        message: errorMessage,
                    });
                }

                queryParams = {
                    collName     : collName,
                    collDocuments: collDocuments,
                    logType      : logType,
                    logBy        : userId,
                };
                break;
            case "login":
                loginParams = options && options.loginParams ? options.loginParams : null;

                // validate params/values
                if (!collName) {
                    collName = "users";
                }
                if (!loginParams) {
                    errorMessage = errorMessage ? errorMessage + " | Login information is required." :
                        "Login information is required."
                }
                if (errorMessage) {
                    return getResMessage("logError", {
                        message: errorMessage,
                    });
                }

                queryParams = {
                    collName     : collName,
                    collDocuments: loginParams,
                    logType      : logType,
                    logBy        : userId,
                };
                break;
            case "logout":
                logoutParams = options && options.logoutParams ? options.logoutParams : null;

                // validate params/values
                if (!collName) {
                    collName = "users";
                }
                if (!userId) {
                    errorMessage = errorMessage ? errorMessage + " | userId is required." :
                        "userId is required.";
                }
                if (!logoutParams) {
                    errorMessage = errorMessage ? errorMessage + " | Logout information is required." :
                        "Logout information is required.";
                }
                if (errorMessage) {
                    return getResMessage("logError", {
                        message: errorMessage,
                    });
                }
                queryParams = {
                    collName     : collName,
                    collDocuments: logoutParams,
                    logType      : logType,
                    logBy        : userId,
                };
                break;
            default:
                return getResMessage("insertError", {
                    message: "Unknown log type and/or incomplete log information",
                });
        }

        try {
            // insert audit record
            const result = await this.auditModel.create({...queryParams, ...{logAt: new Date()}});

            if (result) {
                return getResMessage("success", {
                    value: result,
                });
            } else {
                return getResMessage("insertError");
            }
        } catch (error) {
            console.error("Error saving audit-log record(s): ", error);
            return getResMessage("insertError", {
                message: "Error inserting audit-log record(s):" + error.message,
            });
        }
    }
}

function newAuditLog(auditModel: any, options?: OptionsType) {
    return new AuditLog(auditModel, options);
}

export { AuditLog, newAuditLog };
