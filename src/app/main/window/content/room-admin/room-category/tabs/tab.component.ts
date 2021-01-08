import { Input, OnInit } from '@angular/core';

import { RoomCategory } from '../models';

export abstract class TabComponent implements OnInit {

    @Input() category!: RoomCategory;

    constructor() { }

    ngOnInit() {
    }

}
