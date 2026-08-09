class AudioManager {
    constructor() {
        this.music = new Audio('audio/Hintergrundmusik.mp3');
        this.music.loop = true;
        this.music.preload = 'auto';
        this.music.volume = 0.25;
        this.landingSound = new Audio('audio/Sprung auf den Boden.mp3');
        this.landingSound.preload = 'auto';
        this.landingSound.volume = 0.5;
        this.coinSound = new Audio('audio/coins einsammeln.mp3');
        this.coinSound.preload = 'auto';
        this.coinSound.volume = 0.55;
        this.walkingSound = new Audio('audio/audiopapkin-running-on-gravel-301880.mp3');
        this.walkingSound.loop = true;
        this.walkingSound.preload = 'auto';
        this.walkingSound.volume = 0.35;
        this.isWalkingSoundActive = false;
        this.endbossSound = new Audio('audio/ribhavagrawal-chicken-cluking-type-3-293320.mp3');
        this.endbossSound.loop = true;
        this.endbossSound.preload = 'auto';
        this.endbossSound.volume = 0.45;
        this.isMuted = localStorage.getItem('elPolloLocoMuted') === 'true';
        this.music.muted = this.isMuted;
        this.landingSound.muted = this.isMuted;
        this.coinSound.muted = this.isMuted;
        this.walkingSound.muted = this.isMuted;
        this.endbossSound.muted = this.isMuted;
    }

    start() {
        this.music.currentTime = 0;
        this.music.play().catch(error => {
            console.warn('Die Hintergrundmusik konnte nicht gestartet werden:', error);
        });
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.music.muted = this.isMuted;
        this.landingSound.muted = this.isMuted;
        this.coinSound.muted = this.isMuted;
        this.walkingSound.muted = this.isMuted;
        this.endbossSound.muted = this.isMuted;
        localStorage.setItem('elPolloLocoMuted', this.isMuted);
        return this.isMuted;
    }

    playLandingSound() {
        this.landingSound.currentTime = 0;
        this.landingSound.play().catch(error => {
            console.warn('Das Landegeräusch konnte nicht abgespielt werden:', error);
        });
    }

    playCoinSound() {
        this.coinSound.currentTime = 0;
        this.coinSound.play().catch(error => {
            console.warn('Das Münzgeräusch konnte nicht abgespielt werden:', error);
        });
    }

    setWalkingSound(isWalking) {
        if (isWalking === this.isWalkingSoundActive) {
            return;
        }
        this.isWalkingSoundActive = isWalking;
        if (isWalking) {
            this.walkingSound.play().catch(error => {
                this.isWalkingSoundActive = false;
                console.warn('Das Laufgeräusch konnte nicht abgespielt werden:', error);
            });
        } else {
            this.walkingSound.pause();
            this.walkingSound.currentTime = 0;
        }
    }

    startEndbossSound() {
        if (!this.endbossSound.paused) {
            return;
        }
        this.endbossSound.currentTime = 0;
        this.endbossSound.play().catch(error => {
            console.warn('Das Endboss-Geräusch konnte nicht abgespielt werden:', error);
        });
    }

    stopEndbossSound() {
        this.endbossSound.pause();
        this.endbossSound.currentTime = 0;
    }

    stop() {
        this.music.pause();
        this.music.currentTime = 0;
        this.setWalkingSound(false);
        this.stopEndbossSound();
    }
}

const audioManager = new AudioManager();
