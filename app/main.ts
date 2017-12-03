// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import "./rxjs-operators";

import { AppModule } from "./app.module";
import { isAndroid } from "platform";
var jobScheduler = require("./notifications/jobScheduler");
var utils = require("utils/utils");

platformNativeScriptDynamic().bootstrapModule(AppModule);

if (isAndroid) {
    jobScheduler.scheduleJob(utils.ad.getApplicationContext());
}