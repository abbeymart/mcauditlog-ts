/**
 * @Author: abbeymart | Abi Akindele | @Created: 2020-07-15
 * @Company: Copyright 2020 Abi Akindele  | mConnect.biz
 * @License: All Rights Reserved | LICENSE.md
 * @Description: mc-central-ts: audit-log testing (sequelize)
 */

import { mcTest, assertEquals, postTestResult } from "@mconnect/mctest";
import { newAuditLog } from "../src";
import { newDbConnect } from "../../mc-db/src";
import { dbs } from "../../mc-db/test/config/dbConfig";

import { auditModel } from "./model";

// test data
const
    collName = "services",
    userId = "faea411c-e82d-454f-8ee7-574c4e753d06";

const collDocuments: any = {
    name    : "Abi",
    desc    : "Testing only",
    url     : "localhost:9000",
    priority: 1,
    cost    : 1000.00
};
const newCollDocuments: any = {
    name    : "Abi Akindele",
    desc    : "Testing only - updated",
    url     : "localhost:9900",
    priority: 1,
    cost    : 2000.00
};

(async () => {
    // pre-testing setup
    const dbc = newDbConnect(dbs.postgres, "postgres");
    const auditDb = await dbc?.openDb();
    // model
    const Audit = await auditModel(auditDb);
    const auditLog = newAuditLog(Audit, {auditTable: "auditors"});

    // perform audit-log test tasks
    await mcTest({
        name    : "should connect and return an instance object: ",
        testFunc: async () => {
            assertEquals(Object.keys(auditLog).length > 0, true);
        },
    });

    await mcTest({
        name    : "should store create-transaction log and return success: ",
        testFunc: async () => {
            let res = await auditLog.createLog(collName, collDocuments, userId);
            // console.log("create-log-result: ", res);
            assertEquals(res.code, "success");
        },
    });

    await mcTest({
        name    : "should store update-transaction log and return success: ",
        testFunc: async () => {
            let res = await auditLog.updateLog(collName, collDocuments, newCollDocuments, userId);
            assertEquals(res.code, "success");
        },
    });

    await mcTest({
        name    : "should store read-transaction log and return success: ",
        testFunc: async () => {
            const recParams = {keywords: ["lagos", "nigeria", "ghana", "accra"]};
            let res = await auditLog.readLog(collName, recParams, userId);
            assertEquals(res.code, "success");
        },
    });

    await mcTest({
        name    : "should store delete-transaction log and return success: ",
        testFunc: async () => {
            let res = await auditLog.deleteLog(collName, collDocuments, userId);
            assertEquals(res.code, "success");
        },
    });

    await mcTest({
        name    : "should store login-transaction log and return success: ",
        testFunc: async () => {
            let res = await auditLog.loginLog(collDocuments);
            assertEquals(res.code, "success");
        },
    });

    await mcTest({
        name    : "should store logout-transaction log and return success: ",
        testFunc: async () => {
            let res = await auditLog.logoutLog(collDocuments, userId);
            assertEquals(res.code, "success");
        },
    });

    await mcTest({
        name    : "should return paramsError for incomplete/undefined inputs: ",
        testFunc: async () => {
            let res = await auditLog.createLog(collName, collDocuments, "");
            assertEquals(res.code, "logError");
            console.assert(res.message.includes("userId is required"), true);
        },
    });

    await mcTest({
        name    : "generic-audit-log/create: should store transaction log and return success: ",
        testFunc: async () => {
            let res = await auditLog.auditLog("Create", userId, {collName, collDocuments});
            assertEquals(res.code, "success");
        },
    });

    await mcTest({
        name    : "generic-audit-log/update: should store transaction log and return success: ",
        testFunc: async () => {
            let res = await auditLog.auditLog("Update", userId, {collName, collDocuments, newCollDocuments});
            assertEquals(res.code, "success");
        },
    });

    // post testing report
    await postTestResult();

    // close resources / avoid memory leak
    await dbc?.closeDb();
})();
