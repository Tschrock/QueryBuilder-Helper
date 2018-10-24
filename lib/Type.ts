/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { ValueConverter } from './Converters';

export class Type<T> {

    public readonly id: string;

    public readonly convert: ValueConverter<T>;

    constructor(id: string, converter: ValueConverter<T>) {
        this.id = id;
        this.convert = converter;
    }

}
