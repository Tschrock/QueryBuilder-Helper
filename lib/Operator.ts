/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { OperatorOverload } from "./OperatorOverload";

export class Operator {

    public readonly id: string;

    private overloads = new Map<string, OperatorOverload>();
    public registerOverload(overload: OperatorOverload) {
        this.overloads.set(overload.leftHandTypeId, overload);
    }
    public getOverloadFor(leftHandTypeId: string) {
        return this.overloads.get(leftHandTypeId);
    }

    constructor(id: string, overloads: OperatorOverload[]) {
        this.id = id;
        overloads.forEach(o => this.registerOverload(o));
    }

}
