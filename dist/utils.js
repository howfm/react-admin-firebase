"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortArray = void 0;
var _ = require("lodash");
function sortArray(data, field, dir) {
    data.sort(function (a, b) {
        var rawA = _.get(a, field);
        var rawB = _.get(b, field);
        var isAsc = dir === "asc";
        var isNumberField = Number.isFinite(rawA) && Number.isFinite(rawB);
        if (isNumberField) {
            return basicSort(rawA, rawB, isAsc);
        }
        var isStringField = typeof rawA === "string" && typeof rawB === "string";
        if (isStringField) {
            var aParsed = rawA.toLowerCase();
            var bParsed = rawB.toLowerCase();
            return basicSort(aParsed, bParsed, isAsc);
        }
        var isDateField = rawA instanceof Date && rawB instanceof Date;
        if (isDateField) {
            return basicSort(rawA, rawB, isAsc);
        }
        return basicSort(!!rawA, !!rawB, isAsc);
    });
}
exports.sortArray = sortArray;
function basicSort(aValue, bValue, isAsc) {
    if (aValue > bValue) {
        return isAsc ? 1 : -1;
    }
    if (aValue < bValue) {
        return isAsc ? -1 : 1;
    }
    return 0;
}
