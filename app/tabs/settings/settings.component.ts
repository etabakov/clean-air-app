import { Component, OnInit } from "@angular/core";
import * as appSettings from "application-settings";

const SETTINGS_KEY_NOTIFICATIONS_POLUTION_ENABLED: string = "settings.notifications.polutionEnabled";
const SETTINGS_KEY_NOTIFICATIONS_POLUTION_THRESHOLD: string = "settings.notifications.polutionThreshold";
const SETTINGS_KEY_NOTIFICATIONS_POLUTION_SILENCE: string = "settings.notifications.silenceInHours";

@Component({
    selector: "Settings",
    moduleId: module.id,
    templateUrl: "./settings.component.html"
})
export class SettingsComponent implements OnInit {
    sliderPolutionValue: number = 30;
    sliderSilenceValue: number = 1;
    notificationEnabled: boolean;

    constructor() {
        /* ***********************************************************
        * Use the constructor to inject services.
        *************************************************************/
    }

    ngOnInit(): void {
        this.loadSettings();
    }

    saveSettings(): void {
        console.log("Save settings");

        appSettings.setBoolean(SETTINGS_KEY_NOTIFICATIONS_POLUTION_ENABLED, this.notificationEnabled);
        
        if (this.notificationEnabled) {    
            appSettings.setNumber(SETTINGS_KEY_NOTIFICATIONS_POLUTION_THRESHOLD, this.sliderPolutionValue);
            appSettings.setNumber(SETTINGS_KEY_NOTIFICATIONS_POLUTION_SILENCE, this.sliderSilenceValue);
        } else {
            appSettings.remove(SETTINGS_KEY_NOTIFICATIONS_POLUTION_THRESHOLD);
            appSettings.remove(SETTINGS_KEY_NOTIFICATIONS_POLUTION_SILENCE);
        }

        // TODO: Create job for notification
    }

    private loadSettings(): void {
        this.notificationEnabled = appSettings.getBoolean(SETTINGS_KEY_NOTIFICATIONS_POLUTION_ENABLED);

        if (this.notificationEnabled) {
            this.sliderPolutionValue = appSettings.getNumber(SETTINGS_KEY_NOTIFICATIONS_POLUTION_THRESHOLD);
            this.sliderSilenceValue = appSettings.getNumber(SETTINGS_KEY_NOTIFICATIONS_POLUTION_SILENCE);
        }
    }
}
