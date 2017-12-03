import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { MapComponent } from "./map/map.component";
import { SettingsComponent } from "./settings/settings.component";
import { TabsRoutingModule } from "./tabs-routing.module";
import { TabsComponent } from "./tabs.component";
import { FavouritesComponent } from "./favourites/favourites.component";
import { SensorDetailsComponent } from "./sensor-details/sensor-details.component";

@NgModule({
    imports: [
        NativeScriptModule, 
        NativeScriptFormsModule,
        TabsRoutingModule],
    declarations: [
        TabsComponent,
        MapComponent,
        SettingsComponent,
        FavouritesComponent,
        SensorDetailsComponent
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class TabsModule {}
