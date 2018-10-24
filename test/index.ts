/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { QueryBuilder } from '../lib/QueryBuilder';
import { Filter } from '../lib/Filter';

const item = {
    name: "Test Item",
    quantity: 5,
    weight: 3.56,
    id: "asdfg",
    sellBy: new Date()
};

const rules = {
    condition: 'AND',
    rules: [
        {
            id: "item.name",
            operator: "equals",
            value: "Test Item"
        },
        {
            id: "item.quantity",
            operator: "between",
            value: "3, 6"
        },
        {
            id: "item.quantity",
            operator: "between",
            value: "3, 6"
        },
        {
            id: "item.quantity",
            operator: "between",
            value: "3, 6"
        },
        {
            id: "item.quantity",
            operator: "between",
            value: "3, 6"
        },
        {
            id: "item.quantity",
            operator: "between",
            value: "3, 6"
        }
    ]
};

const qb = new QueryBuilder();

qb.registerFilter(new Filter("item.name",     "string",  {}, (i: typeof item) => i.name));
qb.registerFilter(new Filter("item.quantity", "integer", {}, (i: typeof item) => i.quantity));
qb.registerFilter(new Filter("item.weight",   "double",  {}, (i: typeof item) => i.weight));
qb.registerFilter(new Filter("item.id",       "string",  {}, (i: typeof item) => i.id));
qb.registerFilter(new Filter("item.sellBy",   "date",    {}, (i: typeof item) => i.sellBy));

const validation = { maxRules: 5 };
console.log(qb.runQuery(item, rules, validation));
console.log(validation);

