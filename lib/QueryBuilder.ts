/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Condition } from "./Condition";
import { Type } from "./Type";
import { convertString, convertNumber, convertDate, convertBoolean, convertStringArray, convertNumberArray, convertDateArray } from "./Converters";
import { Operator } from "./Operator";
import { OperatorOverload } from "./OperatorOverload";
import { Filter } from "./Filter";
import { Group, Rule } from "./client/ClientInterfaces";


export class QueryBuilder {

    private types = new Map<string, Type<unknown>>();
    public registerType(type: Type<unknown>) {
        this.types.set(type.id, type);
    }

    private typeAliases = new Map<string, string>();
    public registerTypeAlias(fieldTypeId: string, dataTypeId: string) {
        this.typeAliases.set(fieldTypeId, dataTypeId);
    }

    private operators = new Map<string, Operator>();
    public registerOperator(operator: Operator) {
        this.operators.set(operator.id, operator);
    }

    private conditions = new Map<string, Condition>();
    public registerCondition(condition: Condition) {
        this.conditions.set(condition.id, condition);
    }

    private filters = new Map<string, Filter>();
    public registerFilter(filter: Filter) {
        this.filters.set(filter.id, filter);
    }

    constructor() {

        // Default conditions
        this.registerCondition(new Condition("AND", x => x.every(y => y)));
        this.registerCondition(new Condition("OR", x => x.some(y => y)));

        // Default types
        this.registerType(new Type("string", convertString));
        this.registerType(new Type("number", convertNumber));
        this.registerType(new Type("datetime", convertDate));
        this.registerType(new Type("boolean", convertBoolean));

        // Special types (used for some operators)
        this.registerType(new Type("stringarray", convertStringArray));
        this.registerType(new Type("numberarray", convertNumberArray));
        this.registerType(new Type("datetimearray", convertDateArray));

        // Filters use a diferent typeset, so we have to alias them to their real type
        this.registerTypeAlias("string", "string");
        this.registerTypeAlias("integer", "number");
        this.registerTypeAlias("double", "number");
        this.registerTypeAlias("date", "datetime");
        this.registerTypeAlias("time", "datetime");
        this.registerTypeAlias("datetime", "datetime");
        this.registerTypeAlias("boolean", "boolean");

        // Default operators
        this.registerOperator(new Operator("equal", [
            new OperatorOverload("string", "string", (a, b) => a === b),
            new OperatorOverload("number", "number", (a, b) => a === b),
            new OperatorOverload("boolean", "boolean", (a, b) => a === b),
            new OperatorOverload("datetime", "datetime", (a: Date, b: Date) => a.getTime() === b.getTime())
        ]));
        this.registerOperator(new Operator("not_equal", [
            new OperatorOverload("string", "string", (a, b) => a !== b),
            new OperatorOverload("number", "number", (a, b) => a !== b),
            new OperatorOverload("boolean", "boolean", (a, b) => a !== b),
            new OperatorOverload("datetime", "datetime", (a: Date, b: Date) => a.getTime() !== b.getTime())
        ]));
        this.registerOperator(new Operator("in", [
            new OperatorOverload("number", "numberarray", (a: number, b: number[]) => b.includes(a)),
            new OperatorOverload("string", "stringarray", (a: string, b: string[]) => b.includes(a))
        ]));
        this.registerOperator(new Operator("not_in", [
            new OperatorOverload("number", "numberarray", (a: number, b: number[]) => !b.includes(a)),
            new OperatorOverload("string", "stringarray", (a: string, b: string[]) => !b.includes(a))
        ]));
        this.registerOperator(new Operator("less", [
            new OperatorOverload("number", "number", (a: number, b: number) => a < b),
            new OperatorOverload("datetime", "datetime", (a: Date, b: Date) => a.getTime() < b.getTime())
        ]));
        this.registerOperator(new Operator("less_or_equal", [
            new OperatorOverload("number", "number", (a: number, b: number) => a <= b),
            new OperatorOverload("datetime", "datetime", (a: Date, b: Date) => a.getTime() <= b.getTime())
        ]));
        this.registerOperator(new Operator("greater", [
            new OperatorOverload("number", "number", (a: number, b: number) => a > b),
            new OperatorOverload("datetime", "datetime", (a: Date, b: Date) => a.getTime() > b.getTime())
        ]));
        this.registerOperator(new Operator("greater_or_equal", [
            new OperatorOverload("number", "number", (a: number, b: number) => a >= b),
            new OperatorOverload("datetime", "datetime", (a: Date, b: Date) => a.getTime() >= b.getTime())
        ]));
        this.registerOperator(new Operator("between", [
            new OperatorOverload("number", "numberarray", (a: number, b: number[]) => (!(0 in b) || a > b[0]) && (!(1 in b) || a < b[1])),
            new OperatorOverload("datetime", "datetimearray", (a: Date, b: Date[]) => (!(0 in b) || a > b[0]) && (!(1 in b) || a < b[1]))
        ]));
        this.registerOperator(new Operator("not_between", [
            new OperatorOverload("number", "numberarray", (a: number, b: number[]) => !(!(0 in b) || a > b[0]) && (!(1 in b) || a < b[1])),
            new OperatorOverload("datetime", "datetimearray", (a: Date, b: Date[]) => !(!(0 in b) || a > b[0]) && (!(1 in b) || a < b[1]))
        ]));
        this.registerOperator(new Operator("begins_with", [
            new OperatorOverload("string", "string", (a: string, b: string) => a.startsWith(b))
        ]));
        this.registerOperator(new Operator("not_begins_with", [
            new OperatorOverload("string", "string", (a: string, b: string) => !a.startsWith(b))
        ]));
        this.registerOperator(new Operator("contains", [
            new OperatorOverload("string", "string", (a: string, b: string) => a.includes(b))
        ]));
        this.registerOperator(new Operator("not_contains", [
            new OperatorOverload("string", "string", (a: string, b: string) => !a.includes(b))
        ]));
        this.registerOperator(new Operator("ends_with", [
            new OperatorOverload("string", "string", (a: string, b: string) => a.endsWith(b))
        ]));
        this.registerOperator(new Operator("not_ends_with", [
            new OperatorOverload("string", "string", (a: string, b: string) => !a.endsWith(b))
        ]));
        this.registerOperator(new Operator("is_empty", [
            new OperatorOverload("string", "*", (a: string, b) => a.length === 0)
        ]));
        this.registerOperator(new Operator("is_not_empty", [
            new OperatorOverload("string", "*", (a: string, b) => a.length !== 0)
        ]));
        this.registerOperator(new Operator("is_null", [
            new OperatorOverload("*", "*", (a, b) => a === null)
        ]));
        this.registerOperator(new Operator("is_not_null", [
            new OperatorOverload("*", "*", (a, b) => a !== null)
        ]));

    }

    public runQuery(entity: unknown, rules: any, validationOptions?: ValidationOptions): boolean {
        return this.evaluateRuleOrGroup(entity, rules, validationOptions);
    }

    private evaluateRuleOrGroup(entity: unknown, ruleOrGroup: any, vopts?: ValidationCounter): boolean {
        if (isValidGroup(ruleOrGroup)) return this.evaluateGroup(entity, ruleOrGroup, vopts);
        if (isValidRule(ruleOrGroup)) return this.evaluateRule(entity, ruleOrGroup, vopts);
        else throw new Error("Invalid object in ruleset.");
    }

    private evaluateRule(entity: unknown, rule: Rule, vopts?: ValidationCounter): boolean {
        if (vopts) {
            vopts.ruleCount = (vopts.ruleCount || 0) + 1;
            if (vopts.maxRules && vopts.ruleCount > vopts.maxRules) {
                throw new Error(`Validation Error: Too many rules. The maximum number of rules is ${vopts.maxRules}.`);
            }
        }

        const filter = this.filters.get(rule.id);
        if (!filter) throw new Error(`Invalid filter '${rule.id}'.`);

        const filterDataType = this.typeAliases.get(filter.typeAliasId);
        if (!filterDataType) {
            throw new Error(`Could not get data type for filter '${rule.id}': filter type '${filter.typeAliasId}' is not mapped to an internal data type.`);
        }

        let operator = this.operators.get(rule.operator);
        if (!operator) {
            operator = this.operators.get('*');
            if (!operator) {
                throw new Error(`Invalid operator '${rule.operator}'.`);
            }
        }

        const overload = operator.getOverloadFor(filterDataType);
        if (!overload) {
            throw new Error(`Operator '${rule.operator}' can not be used with type '${filterDataType}'.`);
        }

        let valueDataType = null;
        if (overload.rightHandTypeId !== '*') {
            valueDataType = this.types.get(overload.rightHandTypeId);
            if (!valueDataType) {
                throw new Error(`Invalid operator '${rule.operator}': The right-hand side's data type '${overload.rightHandTypeId}' does not exist.`);
            }
        }

        if(vopts && vopts.validateOnly) return true;

        const leftValue = filter.getValue(entity);
        const rightValue = valueDataType ? valueDataType.convert(rule.value) : rule.value;

        return overload.evaluate(leftValue, rightValue);
    }

    private evaluateGroup(entity: unknown, group: Group, vopts?: ValidationCounter): boolean {
        if (vopts) {
            vopts.groupCount = (vopts.groupCount || 0) + 1;
            if (vopts.maxGroups && vopts.groupCount > vopts.maxGroups) {
                throw new Error(`Validation Error: Too many groups. The maximum number of groups is ${vopts.maxRulesPerGroup}.`);
            }
            vopts.currentDepth = (vopts.currentDepth || 0) + 1;
            if (vopts.maxDepth && vopts.currentDepth > vopts.maxDepth) {
                throw new Error(`Validation Error: Too many nested groups. The maximum depth is ${vopts.maxRulesPerGroup}.`);
            }
        }

        const condition = this.conditions.get(group.condition);

        if (!condition) {
            throw new Error(`Invalid condition '${group.condition}'.`);
        }

        if (vopts && vopts.maxRulesPerGroup && group.rules.length > vopts.maxRulesPerGroup) {
            throw new Error(`Validation Error: Too many rules in group. The maximum rules per group is ${vopts.maxRulesPerGroup}, you have ${group.rules.length}.`);
        }

        const rtn = condition.evaluate(group.rules.map(r => this.evaluateRuleOrGroup(entity, r, vopts)));

        if (vopts) vopts.currentDepth = (vopts.currentDepth || 0) - 1;

        return rtn;
    }

}

function isValidGroup(thing: Group | Rule): thing is Group {
    return 'condition' in thing
        && 'rules' in thing
        && Array.isArray(thing.rules);
}

function isValidRule(thing: Group | Rule): thing is Rule {
    return 'id' in thing
        && 'operator' in thing
        && 'value' in thing;
}

export interface ValidationOptions {
    maxRulesPerGroup?: number;
    maxRules?: number;
    maxGroups?: number;
    maxDepth?: number;
    validateOnly?: boolean;
}

interface ValidationCounter extends ValidationOptions {
    groupCount?: number;
    ruleCount?: number;
    currentDepth?: number;
}

