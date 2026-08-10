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
        this.jumpSound = new Audio('audio/Pepe springt in die Luft.mp3');
        this.jumpSound.preload = 'auto';
        this.jumpSound.volume = 0.5;
        this.bottleBreakSound = new Audio('audio/Flaschen zerbersten.mp3');
        this.bottleBreakSound.preload = 'auto';
        this.bottleBreakSound.volume = 0.55;
        this.bottleCollectSound = new Audio('audio/Flaschen sammeln.mp3');
        this.bottleCollectSound.preload = 'auto';
        this.bottleCollectSound.volume = 0.55;
        this.smallChickenHitSound = new Audio('audio/freesound_community-weird-scream-83171.mp3');
        this.smallChickenHitSound.preload = 'auto';
        this.smallChickenHitSound.volume = 0.55;
        this.normalChickenHitSound = new Audio('audio/freesound_community-short-ah-yell-103092.mp3');
        this.normalChickenHitSound.preload = 'auto';
        this.normalChickenHitSound.volume = 0.55;
        this.walkingSound = new Audio('audio/audiopapkin-running-on-gravel-301880.mp3');
        this.walkingSound.loop = true;
        this.walkingSound.preload = 'auto';
        this.walkingSound.volume = 0.35;
        this.isWalkingSoundActive = false;
        this.endbossSound = new Audio('audio/ribhavagrawal-chicken-cluking-type-3-293320.mp3');
        this.endbossSound.loop = true;
        this.endbossSound.preload = 'auto';
        this.endbossSound.volume = 0.45;
        this.lostSound = new Audio('audio/Lost.mp3');
        this.lostSound.preload = 'auto';
        this.lostSound.volume = 0.6;
        this.wonSound = new Audio('audio/freesound_community-gewonnen-87838.mp3');
        this.wonSound.preload = 'auto';
        this.wonSound.volume = 0.6;
        this.isMuted = localStorage.getItem('elPolloLocoMuted') === 'true';
        this.music.muted = this.isMuted;
        this.landingSound.muted = this.isMuted;
        this.coinSound.muted = this.isMuted;
        this.jumpSound.muted = this.isMuted;
        this.bottleBreakSound.muted = this.isMuted;
        this.bottleCollectSound.muted = this.isMuted;
        this.smallChickenHitSound.muted = this.isMuted;
        this.normalChickenHitSound.muted = this.isMuted;
        this.walkingSound.muted = this.isMuted;
        this.endbossSound.muted = this.isMuted;
        this.lostSound.muted = this.isMuted;
        this.wonSound.muted = this.isMuted;
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
        this.jumpSound.muted = this.isMuted;
        this.bottleBreakSound.muted = this.isMuted;
        this.bottleCollectSound.muted = this.isMuted;
        this.smallChickenHitSound.muted = this.isMuted;
        this.normalChickenHitSound.muted = this.isMuted;
        this.walkingSound.muted = this.isMuted;
        this.endbossSound.muted = this.isMuted;
        this.lostSound.muted = this.isMuted;
        this.wonSound.muted = this.isMuted;
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

    playJumpSound() {
        this.jumpSound.currentTime = 0;
        this.jumpSound.play().catch(error => {
            console.warn('Der Sprung-Sound konnte nicht abgespielt werden:', error);
        });
    }

    playBottleBreakSound() {
        this.bottleBreakSound.currentTime = 0;
        this.bottleBreakSound.play().catch(error => {
            console.warn('Der Flaschentreffer-Sound konnte nicht abgespielt werden:', error);
        });
    }

    playBottleCollectSound() {
        this.bottleCollectSound.currentTime = 0;
        this.bottleCollectSound.play().catch(error => {
            console.warn('Der Flaschensammel-Sound konnte nicht abgespielt werden:', error);
        });
    }

    playSmallChickenHitSound() {
        this.smallChickenHitSound.currentTime = 0;
        this.smallChickenHitSound.play().catch(error => {
            console.warn('Der Sound für das kleine Huhn konnte nicht abgespielt werden:', error);
        });
    }

    playNormalChickenHitSound() {
        this.normalChickenHitSound.currentTime = 0;
        this.normalChickenHitSound.play().catch(error => {
            console.warn('Der Sound für das normale Huhn konnte nicht abgespielt werden:', error);
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

    playLostSound() {
        this.lostSound.currentTime = 0;
        this.lostSound.play().catch(error => {
            console.warn('Der Verloren-Sound konnte nicht abgespielt werden:', error);
        });
    }

    playWonSound() {
        this.wonSound.currentTime = 0;
        this.wonSound.play().catch(error => {
            console.warn('Der Gewonnen-Sound konnte nicht abgespielt werden:', error);
        });
    }

    stop() {
        this.music.pause();
        this.music.currentTime = 0;
        this.setWalkingSound(false);
        this.stopEndbossSound();
    }
}

const audioManager = new AudioManager();
