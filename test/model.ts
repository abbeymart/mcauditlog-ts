/**
 * @Author: abbeymart | Abi Akindele | @Created: 2020-07-16
 * @Company: Copyright 2020 Abi Akindele  | mConnect.biz
 * @License: All Rights Reserved | LICENSE.md
 * @Description: mc-central-ts: audit-log model (Audit => audits)
 */

import { DbConnectType } from "@mconnect/mcdb";
import { DataTypes, Model } from "sequelize";

export async function auditModel(dbc: DbConnectType) {
    class Audit extends Model {
    }

    Audit.init({
        id              : {
            type        : DataTypes.UUID,
            primaryKey  : true,
            allowNull   : false,
            defaultValue: DataTypes.UUIDV4,
            validate    : {
                isUUID: 4
            },
        },
        collName        : {
            type     : DataTypes.STRING,
            allowNull: false
        },
        collDocuments   : {
            type: DataTypes.JSONB,
        },
        newCollDocuments: {
            type: DataTypes.JSONB,
        },
        logType         : {
            type     : DataTypes.STRING,
            allowNull: false,
        },
        logBy           : {
            type    : DataTypes.UUID,
            validate: {
                isUUID: 4
            },
        },
        logAt           : {
            type        : DataTypes.DATE,
            allowNull   : false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        sequelize  : dbc,
        tableName  : "audits",
        modelName  : "Audit",
        timestamps : false,
        underscored: true,
    });

    // Sync the table
    await Audit.sync({alter: true});

    return Audit;
}
