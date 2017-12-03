android.app.job.JobService.extend("com.tns.notifications.NotificationsJobService", {
    onStartJob: function(params) {       
        console.log("Job execution ...");

        // Do something useful here, fetch data and show notification for example
        return false;
    },
    
    onStopJob: function() {
        console.log("Stopping job ...");
    }
});
