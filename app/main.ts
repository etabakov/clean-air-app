// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";

import { AppModule } from "./app.module";
import { registerElement } from "nativescript-angular/element-registry";

registerElement(
    "MapView",
    () => require("nativescript-google-maps-sdk").MapView
);
platformNativeScriptDynamic().bootstrapModule(AppModule);
