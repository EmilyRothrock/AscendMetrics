import { Activity, BodyPartMetrics } from "../types";
import { FieldName } from "../types/fieldOptions";
import { FilterValueType } from "../types/filterValueType";

export const fieldFilterer = (selecteField: FieldName) => {
    switch (selecteField) {
        case "name":
            return filterStrings
        case 'notes':
            return filterStrings
        case 'activities': 
            return filterStringsArray
        case 'completedOn':
            return filterDateRange
        case 'loads':
            return filterMetricAverageRange
        case 'duration':
            return filterNumberRange
    }
};

export const filterStrings = (str: string | null, filterValue: FilterValueType): boolean => {
    const substring = filterValue.text;
    if (str && substring) {
        return str.toLowerCase().includes(substring.toLowerCase());
    } else return false;
};

export const filterStringsArray = (arr: Activity[], filterValue: FilterValueType) => {
    const substring = filterValue.text;
    if (arr && substring) return arr.some((element: Activity) => element.name.toLowerCase().includes(substring.toLowerCase()));
    else return false;
}

/**
 * To be used in call of the filter method. Returns true when the date is within the min and max.
 * @param min ISO format date string representing the minimum date.
 * @param max ISO format date string representing the maximum date.
 * @param date ISO format date string to be checked.
 * @returns boolean True if the date is within the range, inclusive.
 */
export const filterDateRange = (date: string, filterValue: FilterValueType): boolean => {
    if (filterValue.min && filterValue.max) {
        const dateTimestamp = new Date(date).getTime();
        const minTimestamp = new Date(filterValue.min).getTime();
        const maxTimestamp = new Date(filterValue.max).getTime();
        return dateTimestamp >= minTimestamp && dateTimestamp <= maxTimestamp;
    } else return true;
};

export const filterMetricAverageRange = (metric: BodyPartMetrics, filterValue: FilterValueType) => {
    const avg = (metric.fingers + metric.upperBody + metric.lowerBody) / 3;
    if ( filterValue.min && filterValue.max) { return ( avg > filterValue.min && avg < filterValue.max); }
    else return true;
}
export const filterNumberRange = (num: number, filterValue: FilterValueType) => {
    if ( filterValue.min && filterValue.max) { return ( num > filterValue.min && num < filterValue.max); }
    else return true;
}