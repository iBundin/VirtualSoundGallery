WebVRManager.prototype.anyModeToVR_ = function() {
    // Don't do orientation locking for consistency.
    //this.requestOrientationLock_();
    this.requestFullscreen_();
    if (!isMobile()) {
        this.effect.setFullScreen(true);
    }
    this.wakelock.request();
    this.distorter.patch();
};