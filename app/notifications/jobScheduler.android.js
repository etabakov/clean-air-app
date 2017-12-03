function scheduleJob(context) {
    var component = new android.content.ComponentName(context, com.tns.notifications.NotificationsJobService.class);
    const builder = new android.app.job.JobInfo.Builder(1, component);

    builder.setPeriodic(60 * 60 * 1000);

    const jobScheduler = context.getSystemService(android.content.Context.JOB_SCHEDULER_SERVICE);
    console.log("Job Scheduled: " + jobScheduler.schedule(builder.build()));
}

module.exports.scheduleJob = scheduleJob;