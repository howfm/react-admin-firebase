"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREATE_WITHOUT_AUTOMATIC_ID_KEY = exports.FirebaseDataProvider = exports.FirebaseRealTimeSaga = void 0;
var firebaseRealtimeSaga_1 = require("./firebaseRealtimeSaga");
exports.FirebaseRealTimeSaga = firebaseRealtimeSaga_1.default;
var firebaseDataProvider_1 = require("./firebaseDataProvider");
exports.FirebaseDataProvider = firebaseDataProvider_1.default;
Object.defineProperty(exports, "CREATE_WITHOUT_AUTOMATIC_ID_KEY", { enumerable: true, get: function () { return firebaseDataProvider_1.CREATE_WITHOUT_AUTOMATIC_ID_KEY; } });
