/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

type Evaluator = (lhs: any, rhs: any) => boolean;

export class OperatorOverload {

    public readonly leftHandTypeId: string;
    public readonly rightHandTypeId: string;

    public readonly evaluate: Evaluator;

    constructor(leftHandTypeId: string, rightHandTypeId: string, evaluator: Evaluator) {
        this.leftHandTypeId = leftHandTypeId;
        this.rightHandTypeId = rightHandTypeId;
        this.evaluate = evaluator;
    }

}
