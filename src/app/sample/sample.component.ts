/**
 * @Author: Alex Sorafumo
 * @Date:   17/10/2016 4:10 PM
 * @Email:  alex@yuion.net
 * @Filename: simple.component.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 01/02/2017 1:37 PM
 */

import { CommsService } from '@acaprojects/ngx-composer';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { AppService } from '../services/app.service';

@Component({
    selector: 'sample',
    styleUrls: ['./sample.style.scss'],
    templateUrl: './sample.template.html',
})
export class SampleComponent {
    public system = '';
    public input: any = {
        sys: '',
    };

    public data: any = {
        name: '',
    };

    public icon: any = {
        play: 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik04IDV2MTRsMTEtN3oiLz4KICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz4KPC9zdmc+',
        stop: 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz4KICAgIDxwYXRoIGQ9Ik02IDZoMTJ2MTJINnoiLz4KPC9zdmc+',
        mute: 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMDAwMDAwIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0xNi41IDEyYzAtMS43Ny0xLjAyLTMuMjktMi41LTQuMDN2Mi4yMWwyLjQ1IDIuNDVjLjAzLS4yLjA1LS40MS4wNS0uNjN6bTIuNSAwYzAgLjk0LS4yIDEuODItLjU0IDIuNjRsMS41MSAxLjUxQzIwLjYzIDE0LjkxIDIxIDEzLjUgMjEgMTJjMC00LjI4LTIuOTktNy44Ni03LTguNzd2Mi4wNmMyLjg5Ljg2IDUgMy41NCA1IDYuNzF6TTQuMjcgM0wzIDQuMjcgNy43MyA5SDN2Nmg0bDUgNXYtNi43M2w0LjI1IDQuMjVjLS42Ny41Mi0xLjQyLjkzLTIuMjUgMS4xOHYyLjA2YzEuMzgtLjMxIDIuNjMtLjk1IDMuNjktMS44MUwxOS43MyAyMSAyMSAxOS43M2wtOS05TDQuMjcgM3pNMTIgNEw5LjkxIDYuMDkgMTIgOC4xOFY0eiIvPgogICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4=',
        unmute: 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMDAwMDAwIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0zIDl2Nmg0bDUgNVY0TDcgOUgzem0xMy41IDNjMC0xLjc3LTEuMDItMy4yOS0yLjUtNC4wM3Y4LjA1YzEuNDgtLjczIDIuNS0yLjI1IDIuNS00LjAyek0xNCAzLjIzdjIuMDZjMi44OS44NiA1IDMuNTQgNSA2Ljcxcy0yLjExIDUuODUtNSA2LjcxdjIuMDZjNC4wMS0uOTEgNy00LjQ5IDctOC43N3MtMi45OS03Ljg2LTctOC43N3oiLz4KICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz4KPC9zdmc+',
    };

    constructor(private app_service: AppService, private route: ActivatedRoute, private http: CommsService) {
        this.route.params.subscribe((params) => {
            if (params.sys_id) {
                this.system = params.sys_id;
            }
        });
    }

}
