/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

type ValueRetriever = (entity: any) => unknown;

export class Filter {

    public readonly id: string;

    public readonly typeAliasId: string;

    public readonly clientOptions: {};

    public readonly getValue: ValueRetriever;

    constructor(id: string, typeAliasId: string, clientOptions: {}, getValue: ValueRetriever) {
        this.id = id;
        this.typeAliasId = typeAliasId;
        this.clientOptions = clientOptions;
        this.getValue = getValue;
    }

}
