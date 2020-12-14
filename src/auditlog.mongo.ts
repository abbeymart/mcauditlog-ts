/**
 * @Author: abbeymart | Abi Akindele | @Created: 2020-07-15
 * @Company: Copyright 2020 Abi Akindele  | mConnect.biz
 * @License: All Rights Reserved | LICENSE.md
 * @Description: mc-central-ts: audit-log (mongodb) entry point | translog
 */

// Import required module/function(s)
import { MongoDbConnectType, checkDb } from "../../mc-db/src";
import { getResMessage, ResponseMessage } from "@mconnect/mcresponse";

//types
export interface AuditLogOptionsType {
    auditColl?: string;
    collName?: string;
    collDocuments?: any;
    newCollDocuments?: any;
    recordParams?: any;
    newRecordParams?: any;
}

// export enum AuditLogTypes {
//     CREATE,
//     UPDATE,
//     DELETE,
//     READ,
//     LOGIN,
//     LOGOUT
// }

class AuditLogMongo {
    private readonly dbConnect: MongoDbConnectType;
    private readonly auditColl: string;

    constructor(auditDb: MongoDbConnectType, options?: AuditLogOptionsType) {
        this.dbConnect = auditDb;
        this.auditColl = options && options.auditColl ? options.auditColl : "audits";
    }

    async createLog(collName: string, collDocuments: any, userId: string): Promise<ResponseMessage> {
        const dbCheck = checkDb(this.dbConnect);
        if (dbCheck.code !== "success") {
            return dbCheck;
        }

        // Check/validate the attributes / parameters
        let errorMessage = "";
        if (!collName) {
            errorMessage = errorMessage ? errorMessage + " | Table or Collection name is required." :
                "Table or Collection name is required.";
        }
        if (!userId) {
            errorMessage = errorMessage ? errorMessage + " | userId is required." :
                "userId is required.";
        }
        if (!collDocuments) {
            errorMessage = errorMessage ? errorMessage + " | Created record(s) information is required." :
                "Created record(s) information is required.";
        }
        if (errorMessage) {
            console.log("error-message: ", errorMessage);
            return getResMessage("logError", {
                message: errorMessage,
            });
        }

        try {
            // insert audit record
            const coll = this.dbConnect.collection(this.auditColl);
            const result = await coll.insertOne({
                collName     : collName,
                collDocuments: collDocuments,
                logType      : "create",
                logBy        : userId,
                logAt      : new Date(),
            });

            if (result) {
                return getResMessage("success", {
                    value: result,
                });
            } else {
                return getResMessage("insertError", {
                    value  : result || "no-result",
                    message: "no response from the server",
                });
            }
        } catch (error) {
            console.log("Error saving create-audit record(s): ", error);
            return getResMessage("logError", {
                value  : error.message,
                message: "Error saving create-audit record(s): " + error.message,
            });
        }
    }

    async updateLog(collName: string, collDocuments: any, newCollDocuments: any, userId: string): Promise<ResponseMessage> {
        const dbCheck = checkDb(this.dbConnect);
        if (!dbCheck) {
            return dbCheck;
        }

        // Check/validate the attributes / parameters
        let errorMessage = "";
        if (!collName) {
            errorMessage = errorMessage ? errorMessage + " | Table or Collection name is required." :
                "Table or Collection name is required.";
        }
        if (!userId) {
            errorMessage = errorMessage ? errorMessage + " | userId is required." :
                "userId is required.";
        }
        if (!collDocuments) {
            errorMessage = errorMessage ? errorMessage + " | Current record(s) information is required." :
                "Current record(s) information is required.";
        }
        if (!newCollDocuments) {
            errorMessage = errorMessage ? errorMessage + " | Updated record(s) information is required." :
                "Updated record(s) information is required.";
        }
        if (errorMessage) {
            return getResMessage("insertError", {
                message: errorMessage,
            });
        }

        try {
            // insert audit record
            const coll = this.dbConnect.collection(this.auditColl);
            const result = await coll.insertOne({
                collName        : collName,
                collDocuments   : collDocuments,
                newCollDocuments: newCollDocuments,
                logType         : "update",
                logBy           : userId,
                logAt         : new Date(),
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
        const dbCheck = checkDb(this.dbConnect);
        if (!dbCheck) {
            return dbCheck;
        }

        // validate params/values
        let errorMessage = "";
        if (!collName) {
            errorMessage = errorMessage ? errorMessage + " | Table or Collection name is required." :
                "Table or Collection name is required.";
        }
        if (!collDocuments) {
            errorMessage = errorMessage ? errorMessage + " | Search keywords or Read record(s) information is required." :
                "Search keywords or Read record(s) information is required.";
        }
        if (errorMessage) {
            return getResMessage("insertError", {
                message: errorMessage,
            });
        }

        try {
            // insert audit record
            const coll = this.dbConnect.collection(this.auditColl);
            const result = await coll.insertOne({
                collName     : collName,
                collDocuments: collDocuments,
                logType      : "read",
                logBy        : userId,
                logAt      : new Date(),
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
        const dbCheck = checkDb(this.dbConnect);
        if (!dbCheck) {
            return dbCheck;
        }

        // Check/validate the attributes / parameters
        let errorMessage = "";
        if (!collName) {
            errorMessage = errorMessage ? errorMessage + " | Table or Collection name is required." :
                "Table or Collection name is required.";
        }
        if (!userId) {
            errorMessage = errorMessage ? errorMessage + " | userId is required." :
                "userId is required.";
        }
        if (!collDocuments) {
            errorMessage = errorMessage ? errorMessage + " | Deleted record(s) information is required." :
                "Deleted record(s) information is required.";
        }
        if (errorMessage) {
            return getResMessage("insertError", {
                message: errorMessage,
            });
        }

        try {
            // insert audit record
            const coll = this.dbConnect.collection(this.auditColl);
            const result = await coll.insertOne({
                collName     : collName,
                collDocuments: collDocuments,
                logType      : "remove",
                logBy        : userId,
                logAt      : new Date(),
            });

            if (result) {
                return getResMessage("success", {
                    value: result,
                });
            } else {
                return getResMessage("insertError");
            }
        } catch (error) {
            console.log("Error saving delete-audit record(s): ", error);
            return getResMessage("insertError", {
                message: "Error inserting delete-audit record(s):" + error.message,
            });
        }
    }

    async loginLog(collDocuments: any, userId: string = ""): Promise<ResponseMessage> {
        const dbCheck = checkDb(this.dbConnect);
        if (!dbCheck) {
            return dbCheck;
        }
        // validate params/values
        let errorMessage = "";
        if (!collDocuments) {
            errorMessage = errorMessage + " | Login information is required."
        }
        if (errorMessage) {
            return getResMessage("insertError", {
                message: errorMessage,
            });
        }

        try {
            // insert audit record
            const coll = this.dbConnect.collection(this.auditColl);
            const result = await coll.insertOne({
                collDocuments: collDocuments,
                logType      : "login",
                logBy        : userId,
                logAt      : new Date(),
            });

            if (result) {
                return getResMessage("success", {
                    value: result,
                });
            } else {
                return getResMessage("insertError");
            }
        } catch (error) {
            console.log("Error inserting login-audit record(s): ", error);
            return getResMessage("insertError", {
                message: "Error inserting login-audit record(s):" + error.message,
            });
        }
    }

    async logoutLog(collDocuments: any, userId: string = ""): Promise<ResponseMessage> {
        const dbCheck = checkDb(this.dbConnect);
        if (!dbCheck) {
            return dbCheck;
        }

        // validate params/values
        let errorMessage = "";
        if (!userId) {
            errorMessage = errorMessage + " | userId is required."
        }
        if (!collDocuments || collDocuments === "") {
            errorMessage = errorMessage + " | Logout information is required."
        }
        if (errorMessage) {
            return getResMessage("insertError", {
                message: errorMessage,
            });
        }

        try {
            // insert audit record
            const coll = this.dbConnect.collection(this.auditColl);
            const result = await coll.insertOne({
                collDocuments: collDocuments,
                logType      : "logout",
                logBy        : userId,
                logAt      : new Date(),
            });

            if (result) {
                return getResMessage("success", {
                    value: result,
                });
            } else {
                return getResMessage("insertError");
            }
        } catch (error) {
            console.log("Error inserting logout-audit record(s): ", error);
            return getResMessage("insertError", {
                value: error,
            });
        }
    }

    async auditLog(logType: string, userId: string = "", options?: AuditLogOptionsType) {
        const dbCheck = checkDb(this.dbConnect);
        if (!dbCheck) {
            return dbCheck;
        }

        // Check/validate the attributes / parameters
        let collName = "",
            collDocuments = null,
            newCollDocuments = null,
            errorMessage = "",
            queryParams = {};

        logType = logType.toLowerCase();

        switch (logType) {
            case "create":
                collName = options && options.collName ? options.collName : "";
                collDocuments = options && options.collDocuments ? options.collDocuments : null;
                // validate params/values
                if (!collName) {
                    errorMessage = errorMessage ? errorMessage + " | Table or Collection name is required." :
                        "Table or Collection name is required.";
                }
                if (!userId) {
                    errorMessage = errorMessage ? errorMessage + " | userId is required." :
                        "userId is required.";
                }
                if (!collDocuments) {
                    errorMessage = errorMessage ? errorMessage + " | Created record(s) information is required." :
                        "Created record(s) information is required.";
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
            case "update":
                collName = options && options.collName ? options.collName : "";
                collDocuments = options && options.collDocuments ? options.collDocuments : null;
                newCollDocuments = options && options.newCollDocuments ? options.newCollDocuments : null; // object or array

                // validate params/values
                if (!collName) {
                    errorMessage = errorMessage ? errorMessage + " | Table or Collection name is required." :
                        "Table or Collection name is required.";
                }
                if (!userId) {
                    errorMessage = errorMessage ? errorMessage + " | userId is required." :
                        "userId is required.";
                }
                if (!collDocuments) {
                    errorMessage = errorMessage ? errorMessage + " | Current record(s) information is required." :
                        "Current record(s) information is required.";
                }
                if (!newCollDocuments) {
                    errorMessage = errorMessage ? errorMessage + " | Updated record(s) information is required." :
                        "Updated record(s) information is required.";
                }
                if (errorMessage) {
                    return getResMessage("insertError", {
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
                    errorMessage = errorMessage ? errorMessage + " | Table or Collection name is required." :
                        "Table or Collection name is required.";
                }
                if (!userId) {
                    errorMessage = errorMessage ? errorMessage + " | userId is required." :
                        "userId is required.";
                }
                if (!collDocuments) {
                    errorMessage = errorMessage ? errorMessage + " | Deleted record(s) information is required." :
                        "Deleted record(s) information is required.";
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
            case "read":
                collName = options && options.collName ? options.collName : "";
                collDocuments = options && options.collDocuments ? options.collDocuments : null;

                // validate params/values
                if (!collName) {
                    errorMessage = errorMessage ? errorMessage + " | Table or Collection name is required." :
                        "Table or Collection name is required.";
                }
                if (!collDocuments) {
                    errorMessage = errorMessage ? errorMessage + " | Search keywords or Read record(s) information is required." :
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
                collDocuments = options && options.collDocuments ? options.collDocuments : null;

                // validate params/values
                if (!collDocuments) {
                    errorMessage = errorMessage + " | Login information is required."
                }
                if (errorMessage) {
                    return getResMessage("insertError", {
                        message: errorMessage,
                    });
                }

                queryParams = {
                    collDocuments: collDocuments,
                    logType      : logType,
                    logBy        : userId,
                };
                break;
            case "logout":
                collDocuments = options && options.collDocuments ? options.collDocuments : null;

                // validate params/values
                if (!userId) {
                    errorMessage = errorMessage + " | userId is required."
                }
                if (!collDocuments || collDocuments === "") {
                    errorMessage = errorMessage + " | Logout information is required."
                }
                if (errorMessage) {
                    return getResMessage("insertError", {
                        message: errorMessage,
                    });
                }
                queryParams = {
                    collDocuments: collDocuments,
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
            const coll = this.dbConnect.collection(this.auditColl);
            const result = await coll.insertOne({
                ...queryParams,
                ...{logAt: new Date()},
            });

            if (result) {
                return getResMessage("success", {
                    value: result,
                });
            } else {
                return getResMessage("insertError");
            }
        } catch (error) {
            console.log("Error saving audit-log record(s): ", error);
            return getResMessage("insertError", {
                message: "Error inserting audit-log record(s):" + error.message,
            });
        }
    }

}

function newAuditLogMongo(auditDb: MongoDbConnectType, options?: AuditLogOptionsType) {
    return new AuditLogMongo(auditDb, options);
}

export { AuditLogMongo, newAuditLogMongo };
