"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREATE_WITHOUT_AUTOMATIC_ID_KEY = exports.fb = void 0;
var firebase = require("firebase/app");
require("firebase/firestore");
var react_admin_1 = require("react-admin");
var rxjs_1 = require("rxjs");
var utils_1 = require("./utils");
// UTILS
function isEmptyObj(obj) {
    return JSON.stringify(obj) == "{}";
}
/**
 * Filters an array of objects with multiple criteria.
 *
 * @param  {Array}  array: the array to filter
 * @param  {Object} filters: an object with the filter criteria as the property names
 * @return {Array}
 */
function multiFilter(array, filters) {
    var filterKeys = Object.keys(filters);
    // filters all elements passing the criteria
    return array.filter(function (item) {
        // dynamically validate all filter criteria
        return filterKeys.every(function (key) {
            if (!Array.isArray(filters[key])) {
                filters[key] = [filters[key]];
            }
            // ignores an empty filter
            if (!filters[key].length)
                return true;
            return filters[key].includes(item[key]);
        });
    });
}
var FirebaseClient = /** @class */ (function () {
    function FirebaseClient() {
        this.resources = [];
    }
    FirebaseClient.getInstance = function (firebaseConfig) {
        var id = firebaseConfig["projectId"];
        FirebaseClient.instance.app = !firebase.apps.length
            ? firebase.initializeApp(firebaseConfig, id)
            : firebase.app(id);
        FirebaseClient.instance.db = FirebaseClient.instance.app.firestore();
        return FirebaseClient.instance;
    };
    FirebaseClient.prototype.initPath = function (inputPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        if (inputPath == null) {
                            return;
                        }
                        var path = inputPath;
                        var collection = _this.db.collection(path);
                        var observable = _this.getCollectionObservable(collection);
                        var subscription = observable.subscribe(function (querySnapshot) {
                            var newList = querySnapshot.docs.map(function (doc) {
                                var data = doc.data();
                                Object.keys(data).forEach(function (key) {
                                    var value = data[key];
                                    if (value === null || value === undefined)
                                        return;
                                    if (value.toDate && value.toDate instanceof Function) {
                                        data[key] = value.toDate().toISOString();
                                    }
                                });
                                return __assign({ id: doc.id }, data);
                            });
                            _this.setList(newList, path);
                            // The data has been set, so resolve the promise
                            resolve();
                        });
                        var list = [];
                        var r = {
                            collection: collection,
                            list: list,
                            observable: observable,
                            path: path,
                            subscription: subscription,
                        };
                        _this.resources.push(r);
                    })];
            });
        });
    };
    FirebaseClient.prototype.unsubscribe = function () {
        this.resources.forEach(function (r) { return r.subscription.unsubscribe(); });
        this.resources = [];
    };
    FirebaseClient.prototype.apiGetList = function (resourceName, params) {
        return __awaiter(this, void 0, void 0, function () {
            var r, data, _a, field, order, filteredData, pageStart, pageEnd, dataPage, total;
            return __generator(this, function (_b) {
                r = this.tryGetResource(resourceName);
                data = r.list;
                if (params.sort != null) {
                    _a = params.sort, field = _a.field, order = _a.order;
                    if (order === "ASC") {
                        utils_1.sortArray(data, field, "asc");
                    }
                    else {
                        utils_1.sortArray(data, field, "desc");
                    }
                }
                filteredData = this.filterArray(data, params.filter);
                pageStart = (params.pagination.page - 1) * params.pagination.perPage;
                pageEnd = pageStart + params.pagination.perPage;
                dataPage = filteredData.slice(pageStart, pageEnd);
                total = r.list.length;
                return [2 /*return*/, {
                        data: dataPage,
                        total: total,
                    }];
            });
        });
    };
    FirebaseClient.prototype.apiGetOne = function (resourceName, params) {
        return __awaiter(this, void 0, void 0, function () {
            var r, data;
            return __generator(this, function (_a) {
                r = this.tryGetResource(resourceName);
                data = r.list.filter(function (val) { return val.id === params.id; });
                if (data.length < 1) {
                    throw Error("react-admin-firebase: No id found matching: " + params.id);
                }
                return [2 /*return*/, { data: data[0] }];
            });
        });
    };
    FirebaseClient.prototype.apiCreate = function (resourceName, params) {
        return __awaiter(this, void 0, void 0, function () {
            var r, newId, data, doc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        r = this.tryGetResource(resourceName);
                        newId = params.data[exports.CREATE_WITHOUT_AUTOMATIC_ID_KEY];
                        if (!newId) return [3 /*break*/, 2];
                        data = __assign({}, params.data);
                        delete data[exports.CREATE_WITHOUT_AUTOMATIC_ID_KEY];
                        return [4 /*yield*/, r.collection.doc(newId).set(data, { merge: true })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                data: {
                                    id: newId,
                                },
                            }];
                    case 2: return [4 /*yield*/, r.collection.add(params.data)];
                    case 3:
                        doc = _a.sent();
                        return [2 /*return*/, {
                                data: __assign(__assign({}, params.data), { id: doc.id }),
                            }];
                }
            });
        });
    };
    FirebaseClient.prototype.apiUpdate = function (resourceName, params) {
        return __awaiter(this, void 0, void 0, function () {
            var id, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = params.id;
                        delete params.data.id;
                        r = this.tryGetResource(resourceName);
                        return [4 /*yield*/, r.collection.doc(id).update(params.data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                data: __assign(__assign({}, params.data), { id: id }),
                            }];
                }
            });
        });
    };
    FirebaseClient.prototype.apiUpdateMany = function (resourceName, params) {
        return __awaiter(this, void 0, void 0, function () {
            var r, returnData, _i, _a, id;
            return __generator(this, function (_b) {
                delete params.data.id;
                r = this.tryGetResource(resourceName);
                returnData = [];
                for (_i = 0, _a = params.ids; _i < _a.length; _i++) {
                    id = _a[_i];
                    r.collection.doc(id).update(params.data);
                    returnData.push(__assign(__assign({}, params.data), { id: id }));
                }
                return [2 /*return*/, {
                        data: returnData,
                    }];
            });
        });
    };
    FirebaseClient.prototype.apiDelete = function (resourceName, params) {
        return __awaiter(this, void 0, void 0, function () {
            var r;
            return __generator(this, function (_a) {
                r = this.tryGetResource(resourceName);
                r.collection.doc(params.id).delete();
                return [2 /*return*/, {
                        data: params.previousData,
                    }];
            });
        });
    };
    FirebaseClient.prototype.apiDeleteMany = function (resourceName, params) {
        return __awaiter(this, void 0, void 0, function () {
            var r, returnData, batch, _i, _a, id;
            return __generator(this, function (_b) {
                r = this.tryGetResource(resourceName);
                returnData = [];
                batch = this.db.batch();
                for (_i = 0, _a = params.ids; _i < _a.length; _i++) {
                    id = _a[_i];
                    batch.delete(r.collection.doc(id));
                    returnData.push({ id: id });
                }
                batch.commit();
                return [2 /*return*/, { data: returnData }];
            });
        });
    };
    FirebaseClient.prototype.apiGetMany = function (resourceName, params) {
        return __awaiter(this, void 0, void 0, function () {
            var r, ids, matches;
            return __generator(this, function (_a) {
                r = this.tryGetResource(resourceName);
                ids = new Set(params.ids);
                matches = r.list.filter(function (item) { return ids.has(item["id"]); });
                return [2 /*return*/, {
                        data: matches,
                    }];
            });
        });
    };
    FirebaseClient.prototype.apiGetManyReference = function (resourceName, params) {
        return __awaiter(this, void 0, void 0, function () {
            var r, data, targetField, targetValue, matches, _a, field, order, pageStart, pageEnd, dataPage, total;
            return __generator(this, function (_b) {
                r = this.tryGetResource(resourceName);
                data = r.list;
                targetField = params.target;
                targetValue = params.id;
                matches = data.filter(function (val) { return val[targetField] === targetValue; });
                if (params.sort != null) {
                    _a = params.sort, field = _a.field, order = _a.order;
                    if (order === "ASC") {
                        utils_1.sortArray(data, field, "asc");
                    }
                    else {
                        utils_1.sortArray(data, field, "desc");
                    }
                }
                pageStart = (params.pagination.page - 1) * params.pagination.perPage;
                pageEnd = pageStart + params.pagination.perPage;
                dataPage = matches.slice(pageStart, pageEnd);
                total = matches.length;
                return [2 /*return*/, { data: dataPage, total: total }];
            });
        });
    };
    FirebaseClient.prototype.GetResource = function (resourceName) {
        var matches = this.resources.filter(function (val) {
            return val.path === resourceName;
        });
        if (matches.length < 1) {
            throw new Error("react-admin-firebase: Cant find resource with id");
        }
        var match = matches[0];
        return match;
    };
    FirebaseClient.prototype.filterArray = function (data, filterFields) {
        if (isEmptyObj(filterFields))
            return data;
        return multiFilter(data, filterFields);
    };
    FirebaseClient.prototype.setList = function (newList, resourceName) {
        var resource = this.tryGetResource(resourceName);
        resource.list = newList;
    };
    FirebaseClient.prototype.tryGetResource = function (resourceName) {
        var matches = this.resources.filter(function (val) {
            return val.path === resourceName;
        });
        if (matches.length < 1) {
            throw new Error("react-admin-firebase: Cant find resource with id");
        }
        var match = matches[0];
        return match;
    };
    FirebaseClient.prototype.getCollectionObservable = function (collection) {
        var observable = rxjs_1.Observable.create(function (observer) {
            return collection.onSnapshot(observer);
        });
        // LOGGING
        // observable.subscribe((querySnapshot: firebase.firestore.QuerySnapshot) => {
        //   console.log("react-admin-firebase: Observable List Changed:", querySnapshot);
        // });
        return observable;
    };
    FirebaseClient.instance = new FirebaseClient();
    return FirebaseClient;
}());
exports.CREATE_WITHOUT_AUTOMATIC_ID_KEY = "CREATE_WITHOUT_AUTOMATIC_ID_KEY";
function FirebaseProvider(config) {
    exports.fb = FirebaseClient.getInstance(config);
    function providerApi(type, resourceName, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exports.fb.initPath(resourceName)];
                    case 1:
                        _a.sent();
                        switch (type) {
                            case react_admin_1.GET_MANY:
                                return [2 /*return*/, exports.fb.apiGetMany(resourceName, params)];
                            case react_admin_1.GET_MANY_REFERENCE:
                                return [2 /*return*/, exports.fb.apiGetManyReference(resourceName, params)];
                            case react_admin_1.GET_LIST:
                                return [2 /*return*/, exports.fb.apiGetList(resourceName, params)];
                            case react_admin_1.GET_ONE:
                                return [2 /*return*/, exports.fb.apiGetOne(resourceName, params)];
                            case react_admin_1.CREATE:
                                return [2 /*return*/, exports.fb.apiCreate(resourceName, params)];
                            case react_admin_1.UPDATE:
                                return [2 /*return*/, exports.fb.apiUpdate(resourceName, params)];
                            case react_admin_1.UPDATE_MANY:
                                return [2 /*return*/, exports.fb.apiUpdateMany(resourceName, params)];
                            case react_admin_1.DELETE:
                                return [2 /*return*/, exports.fb.apiDelete(resourceName, params)];
                            case react_admin_1.DELETE_MANY:
                                return [2 /*return*/, exports.fb.apiDeleteMany(resourceName, params)];
                            default:
                                return [2 /*return*/, {}];
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    return providerApi;
}
exports.default = FirebaseProvider;
