import * as schemaContainer from './schemaContainer';
import * as schemaType from '../schemas/schemaTypes';

export function databaseSchemaVersions() {
    const schemas = [
        { schema: schemaContainer.SCHEMA_CONTAINER, schemaVersion: 0 },
        // { schema: schemaContainer.SCHEMA_CONTAINER, schemaVersion: 1 },
        {
            schema: schemaContainer.SCHEMA_CONTAINER, schemaVersion: 1, migration: (oldRealm, newRealm) => {
                // only apply this change if upgrading to schemaVersion 1
                if (oldRealm.schemaVersion < 1) {
                    const oldObjects = oldRealm.objects(schemaType.LOGIN_SCHEMA);
                    const newObjects = newRealm.objects(schemaType.LOGIN_SCHEMA);
                    for (let i = 0; i < oldObjects.length; i++) {
                        newObjects[i].customerId = null;
                        newObjects[i].isUserLicenseAgreed = false;
                    }
                }
            }
        },
        {
            schema: schemaContainer.SCHEMA_CONTAINER, schemaVersion: 3, migration: (oldRealm, newRealm) => {

            }
        },
        {
            schema: schemaContainer.SCHEMA_CONTAINER, schemaVersion: 4, migration: (oldRealm, newRealm) => {
                if (oldRealm.schemaVersion < 4) {
                    const oldObjects = oldRealm.objects(schemaType.LOGIN_SCHEMA);
                    const newObjects = newRealm.objects(schemaType.LOGIN_SCHEMA);
                    for (let i = 0; i < oldObjects.length; i++) {
                        newObjects[i].customerId = null;
                        newObjects[i].isUserLicenseAgreed = false;
                    }
                }
            }
        },
        {
            schema: schemaContainer.SCHEMA_CONTAINER, schemaVersion: 5, migration: (oldRealm, newRealm) => {
                if (oldRealm.schemaVersion < 5) {
                    const oldObjects = oldRealm.objects(schemaType.LOGIN_SCHEMA);
                    const newObjects = newRealm.objects(schemaType.LOGIN_SCHEMA);
                    for (let i = 0; i < oldObjects.length; i++) {
                        newObjects[i].customerId = null;
                        newObjects[i].isUserLicenseAgreed = false;
                    }
                }
            }
        },
        {
            schema: schemaContainer.SCHEMA_CONTAINER, schemaVersion: 6, migration: (oldRealm, newRealm) => {
                if (oldRealm.schemaVersion < 6) {
                    const oldObjects = oldRealm.objects(schemaType.LOGIN_SCHEMA);
                    const newObjects = newRealm.objects(schemaType.LOGIN_SCHEMA);
                    for (let i = 0; i < oldObjects.length; i++) {
                        newObjects[i].customerId = null;
                        newObjects[i].isUserLicenseAgreed = false;
                    }
                }
            }
        },
        {
            schema: schemaContainer.SCHEMA_CONTAINER, schemaVersion: 7, migration: (oldRealm, newRealm) => {
                if (oldRealm.schemaVersion < 7) {
                    const oldObjects = oldRealm.objects(schemaType.LOGIN_SCHEMA);
                    const newObjects = newRealm.objects(schemaType.LOGIN_SCHEMA);
                    for (let i = 0; i < oldObjects.length; i++) {
                        newObjects[i].customerId = null;
                        newObjects[i].isUserLicenseAgreed = false;
                    }
                }
            }
        },
        {
            schema: schemaContainer.SCHEMA_CONTAINER, schemaVersion: 8, migration: (oldRealm, newRealm) => {
                if (oldRealm.schemaVersion < 8) {
                    const oldObjects = oldRealm.objects(schemaType.LOGIN_SCHEMA);
                    const newObjects = newRealm.objects(schemaType.LOGIN_SCHEMA);
                    for (let i = 0; i < oldObjects.length; i++) {
                        newObjects[i].customerId = null;
                        newObjects[i].isUserLicenseAgreed = false;
                    }
                }
            }
        },
        {
            schema: schemaContainer.SCHEMA_CONTAINER, schemaVersion: 9, migration: (oldRealm, newRealm) => {
                if (oldRealm.schemaVersion < 9) {
                    const oldObjects = oldRealm.objects(schemaType.LOGIN_SCHEMA);
                    const newObjects = newRealm.objects(schemaType.LOGIN_SCHEMA);
                    for (let i = 0; i < oldObjects.length; i++) {
                        newObjects[i].customerId = null;
                        newObjects[i].isUserLicenseAgreed = false;
                    }
                }
            }
        },
        {
            schema: schemaContainer.SCHEMA_CONTAINER, schemaVersion: 10, migration: (oldRealm, newRealm) => {
                if (oldRealm.schemaVersion < 10) {
                    const oldObjects = oldRealm.objects(schemaType.LOGIN_SCHEMA);
                    const newObjects = newRealm.objects(schemaType.LOGIN_SCHEMA);
                    for (let i = 0; i < oldObjects.length; i++) {
                        newObjects[i].customerId = null;
                        newObjects[i].isUserLicenseAgreed = false;
                    }
                }
            }
        },
        {
            schema: schemaContainer.SCHEMA_CONTAINER, schemaVersion: 11, migration: (oldRealm, newRealm) => {
                if (oldRealm.schemaVersion < 11) {
                    const oldObjects = oldRealm.objects(schemaType.LOGIN_SCHEMA);
                    const newObjects = newRealm.objects(schemaType.LOGIN_SCHEMA);
                    for (let i = 0; i < oldObjects.length; i++) {
                        newObjects[i].customerId = null;
                        newObjects[i].isUserLicenseAgreed = false;
                    }
                }
            }
        },
        {
            schema: schemaContainer.SCHEMA_CONTAINER, schemaVersion: 12, migration: (oldRealm, newRealm) => {
                if (oldRealm.schemaVersion < 12) {
                    const oldObjects = oldRealm.objects(schemaType.LOGIN_SCHEMA);
                    const newObjects = newRealm.objects(schemaType.LOGIN_SCHEMA);
                    for (let i = 0; i < oldObjects.length; i++) {
                        newObjects[i].customerId = null;
                        newObjects[i].isUserLicenseAgreed = false;
                    }
                }
            }
        },
        {
            schema: schemaContainer.SCHEMA_CONTAINER, schemaVersion: 13, migration: (oldRealm, newRealm) => {
                if (oldRealm.schemaVersion < 13) {
                    const oldObjects = oldRealm.objects(schemaType.LOGIN_SCHEMA);
                    const newObjects = newRealm.objects(schemaType.LOGIN_SCHEMA);
                    for (let i = 0; i < oldObjects.length; i++) {
                        newObjects[i].customerId = null;
                        newObjects[i].isUserLicenseAgreed = false;
                    }
                }
            }
        },
        {
            schema: schemaContainer.SCHEMA_CONTAINER, schemaVersion: 14, migration: (oldRealm, newRealm) => {
                if (oldRealm.schemaVersion < 14) {
                    const oldObjects = oldRealm.objects(schemaType.LOGIN_SCHEMA);
                    const newObjects = newRealm.objects(schemaType.LOGIN_SCHEMA);
                    for (let i = 0; i < oldObjects.length; i++) {
                        newObjects[i].customerId = null;
                        newObjects[i].isUserLicenseAgreed = false;
                    }
                }
            }
        },
        {
            schema: schemaContainer.SCHEMA_CONTAINER, schemaVersion: 15, migration: (oldRealm, newRealm) => {
                if (oldRealm.schemaVersion < 15) {
                    const oldObjects = oldRealm.objects(schemaType.LOGIN_SCHEMA);
                    const newObjects = newRealm.objects(schemaType.LOGIN_SCHEMA);
                    for (let i = 0; i < oldObjects.length; i++) {
                        newObjects[i].customerId = null;
                        newObjects[i].isUserLicenseAgreed = false;
                    }
                }
            }
        },
        {
            schema: schemaContainer.SCHEMA_CONTAINER, schemaVersion: 16, migration: (oldRealm, newRealm) => {
                if (oldRealm.schemaVersion < 15) {
                    const oldObjects = oldRealm.objects(schemaType.LOGIN_SCHEMA);
                    const newObjects = newRealm.objects(schemaType.LOGIN_SCHEMA);
                    for (let i = 0; i < oldObjects.length; i++) {
                        newObjects[i].customerId = null;
                        newObjects[i].isUserLicenseAgreed = false;
                    }
                }
            }
        }
    ];
    return schemas;
}



function migrationDB_28_09_2018() {
    // the first schema to update to is the current schema version
    // since the first schema in our array is at
    let nextSchemaIndex = Realm.schemaVersion(Realm.defaultPath);
    while (nextSchemaIndex < schemas.length) {
        const migratedRealm = new Realm(schemas[nextSchemaIndex++]);
        try {
            migratedRealm.close();
        } catch (e) {
            console.log("migratedRealm close Error", e);
        }
    }
}