/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

/**
 * An object that maps language codes to their translations. `en` is required.
 */
export interface LocalizationMap {
    en: string;
    [languageCode: string]: string;
}

/**
 * The options for a new query builder.
 *
 * See: https://querybuilder.js.org/#options
 *
 * Usage:
 ```
 $('#qbelement').queryBuilder({ QueryBuilderOptions });
 ```
 */
export interface QueryBuilderOptions {
    /** Array of filters to show in the builder. */
    filters: FilterOptions[];
    /** Configuration for some plugins. See: https://querybuilder.js.org/plugins.html */
    plugins?: {};
    /** The initial set of rules. Equivilent to calling `setRules` after setup. */
    rules?: Group;
    /** A map of labels for the optgroups used in filter/operator dropdowns. */
    optgroups?: {
        [key: string]: string | LocalizationMap
    };
    /** The id of the default filter for a new rule. */
    default_filter?: string;
    /** Set to `true` to sort filters alphabetically, or provide an `Array.sort()`-compatable sort function. */
    sort_filters?: boolean | ((a: any, b: any) => number);
    /** The maximum depth for groups. Set to `true` for no limit. */
    allow_groups?: number | boolean;
    /** Allow the builder to be completely empty. */
    allow_empty?: boolean;
    /** Show errors. */
    display_errors?: boolean;
    /** An array of available conditions. */
    conditions?: string[];
    /** The default condition. */
    default_condition?: string;
    /** The html to insert between input fields when an operator needs multiple inputs (Like `between`). */
    inputs_separator?: string;
    /** Display an empty option in the filter selector. */
    display_empty_filter?: boolean;
    /** The label for the empty option in the filter selector. */
    select_placeholder?: string;
    /** Custom configuration for operators. */
    operators?: Array<string | OperatorOptions>;
    /** The language to use. */
    lang_code: string;
    /** A custom translation. */
    lang: TranslationMap;
    /** Custom icons. */
    icons: Icons;
    /** Custom templates. */
    templates: Templates;
}

/**
 * An object that provides translations for various strings.
 *
 * See: https://querybuilder.js.org/#lang
 */
export interface TranslationMap {
    __locale: string;
    __author: string;
    [item: string]: string | { [item: string]: string; };
}

/**
 * The options for a filter.
 *
 * See: https://querybuilder.js.org/#filters
 */
export interface FilterOptions {
    /** A unique identifier for the filter. */
    id: string;
    /** The id of the field the filter is for. Defaults to the filter's `id`. */
    field?: string;
    /** The label for the field. Can be either a string or a map of translations. */
    label?: string | LocalizationMap;
    /** The id of the optgroup to put this filter under in the filters dropdown. */
    optgroup?: string;
    /** The type of field. */
    type?: string;
    /** The type of input, or a function that generates html for an input control. */
    input?: string | ((rule: CSSConditionRule, input_name: string) => string);
    /** An array or object to use as values for radio/checkbox/select inputs. */
    values?: string[];
    /** The seperator used to split/join text values when an operator allows multiple values. */
    value_separator?: string;
    /** The default value. */
    default_value?: string;
    /** A space-separated list of DOM events to listen to for changes. */
    input_event?: string;
    /** The horizontal size of a `text` or `textarea` input. */
    size?: number;
    /** The vertical size of a `textarea` input. */
    rows?: number;
    /** If a `select` input should accept multiple values. */
    multiple?: boolean;
    /** The placeholder to use for `text` and `textarea` inputs. */
    placeholder?: string;
    /** If `checkbox` inputs should be vertical or inline. */
    vertical?: boolean;
    /** Options for validating the input. */
    validation?: InputValidationOptions;
    /** An array of operator types to use for this filter. */
    operators?: string[];
    /** The default operator. */
    default_operator?: string;
    /** The name of a jQuery plugin to apply on the input. */
    plugin?: string;
    /** A config object to pass to the plugin. */
    plugin_config?: {};
    /** Additional data that will be attached to the output rules. */
    data?: {};
    /** A custom function to set the value of the input. */
    valueSetter: (rule: Rule, value: any) => void;
    /** A custom function to get the value of the input. */
    valueGetter: (rule: Rule) => any;
}

export interface InputValidationOptions {
    format?: string;
    min?: number | string;
    max?: number | string;
    step?: number;
    messages: {
        [key: string]: string;
    };
    allow_empty_value: boolean;
    callback: (value: number | string, rule: Rule) => boolean;
}

export interface Icons {
    add_group: string;
    add_rule: string;
    remove_group: string;
    remove_rule: string;
    error: string;
}

export interface Templates {
    group: string;
    rule: string;
    filterSelect: string;
    operatorSelect: string;
    ruleValueSelect: string;
}

export interface OperatorOptions {
    type: string;
    optgroup: string;
    nb_inputs: number;
    multiple: boolean;
    apply_to: string[];
}

export type RuleSet = Array<Rule | Group>;

export interface Group {
    condition: string;
    rules: RuleSet;
    valid?: boolean;
    flags?: Flags;
    readonly?: boolean;
}

export interface Rule {
    id: string;
    field: string;
    type: string;
    input: string;
    operator: string;
    value: string | number;
    flags?: Flags;
}

export interface GroupFlags {
    condition_readonly?: boolean;
    no_add_rule?: boolean;
    no_add_group?: boolean;
    no_delete?: boolean;
}

export interface RuleFlags {
    filter_readonly?: boolean;
    operator_readonly?: boolean;
    value_readonly?: boolean;
    no_delete?: boolean;
}

export interface Flags extends GroupFlags, RuleFlags { }
