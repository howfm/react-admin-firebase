"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREATE_WITHOUT_AUTOMATIC_ID_KEY = exports.firebaseClientInstance = exports.FirebaseDataProvider = void 0;
var firebaseDataProvider_1 = require("./firebaseDataProvider");
exports.FirebaseDataProvider = firebaseDataProvider_1.default;
Object.defineProperty(exports, "CREATE_WITHOUT_AUTOMATIC_ID_KEY", { enumerable: true, get: function () { return firebaseDataProvider_1.CREATE_WITHOUT_AUTOMATIC_ID_KEY; } });
Object.defineProperty(exports, "firebaseClientInstance", { enumerable: true, get: function () { return firebaseDataProvider_1.fb; } });
