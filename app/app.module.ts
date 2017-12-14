import { NgModule, NgModuleFactoryLoader, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NSModuleFactoryLoader } from "nativescript-angular/router";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { StoreModule, ActionReducer, MetaReducer } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { SensorService } from "./services/sensor.service";
import { LocalStorageService } from "./services/local-storage.service";

import { registerElement } from "nativescript-angular/element-registry";
import { isIOS } from "platform";
import { reducers, metaReducers } from "./store/reducers";
import { FavouritesEffects } from "./store/effects";

// Google Maps Setup
registerElement("MapView", () => require("nativescript-google-maps-sdk").MapView);
declare var GMSServices: any;
const GOOGLE_MAPS_API_KEY = "AIzaSyBCTywD8ZGi6ijdQc9OgpPflpgL54lNeps";
if (isIOS) {
    GMSServices.provideAPIKey(GOOGLE_MAPS_API_KEY);
}

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        NativeScriptModule,
        NativeScriptHttpModule,
        NativeScriptFormsModule,
        AppRoutingModule,
        StoreModule.forRoot(reducers, { metaReducers }),
        EffectsModule.forRoot([FavouritesEffects])
    ],
    declarations: [AppComponent],
    providers: [
        { provide: NgModuleFactoryLoader, useClass: NSModuleFactoryLoader },
        SensorService,
        LocalStorageService
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {}
