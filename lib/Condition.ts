/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

type Evaluator = (ruleset: boolean[]) => boolean;

export class Condition {

    public readonly id: string;

    public readonly evaluate: Evaluator;

    constructor(id: string, evaluator: Evaluator) {
        this.id = id;
        this.evaluate = evaluator;
    }

}
