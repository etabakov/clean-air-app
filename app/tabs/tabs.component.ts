import { Component, OnInit } from "@angular/core";
import { isAndroid } from "platform";
import {
    SelectedIndexChangedEventData,
    TabView,
    TabViewItem
} from "tns-core-modules/ui/tab-view";
import { Page } from "ui/page";

@Component({
    selector: "TabsComponent",
    moduleId: module.id,
    templateUrl: "./tabs.component.html",
    styleUrls: ["./tabs.component.css"]
})
export class TabsComponent implements OnInit {
    selectedIndex = 0;

    constructor(private _page: Page) {
        /************************************************************
         * Use the constructor to inject app services that will be needed for
         * the whole tab navigation layout as a whole.
         *************************************************************/
    }

    ngOnInit(): void {
        this._page.actionBarHidden = false;
    }

    onSelectedIndexChanged(args: SelectedIndexChangedEventData) {
        this.selectedIndex = args.newIndex;
    }
}
