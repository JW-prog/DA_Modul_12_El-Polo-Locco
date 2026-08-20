class AudioManager {
    /** Creates all game sounds and restores mute state. */
    constructor() {
        this.createSounds();
        this.isWalkingSoundActive = false;
        this.isMuted = localStorage.getItem('elPolloLocoMuted') === 'true';
        this.applyMuteState();
    }


    /**
     * Creates the game's audio objects.
     * @returns {void}
     */
    createSounds() {
        this.music = this.createAudio('audio/Hintergrundmusik.mp3', 0.25, true);
        this.landingSound = this.createAudio('audio/Sprung auf den Boden.mp3', 0.5);
        this.coinSound = this.createAudio('audio/coins einsammeln.mp3');
        this.jumpSound = this.createAudio('audio/Pepe springt in die Luft.mp3', 0.5);
        this.createActionSounds();
        this.createEnemySounds();
        this.createResultSounds();
    }


    /**
     * Creates collectible and player-action sounds.
     * @returns {void}
     */
    createActionSounds() {
        this.bottleBreakSound = this.createAudio('audio/Flaschen zerbersten.mp3');
        this.bottleCollectSound = this.createAudio('audio/Flaschen sammeln.mp3');
        this.characterHitSound = this.createAudio('audio/freesound_community-human-roar-1-39402.mp3');
        this.walkingSound = this.createAudio('audio/audiopapkin-running-on-gravel-301880.mp3', 0.35, true);
    }


    /**
     * Creates chicken and endboss sounds.
     * @returns {void}
     */
    createEnemySounds() {
        this.smallChickenHitSound = this.createAudio('audio/freesound_community-weird-scream-83171.mp3');
        this.normalChickenHitSound = this.createAudio('audio/freesound_community-short-ah-yell-103092.mp3');
        this.endbossHitSound = this.createAudio('audio/freesound_community-chicken-squawk-72188.mp3');
        this.endbossSound = this.createAudio('audio/ribhavagrawal-chicken-cluking-type-3-293320.mp3', 0.45, true);
    }


    /**
     * Creates win and loss sounds.
     * @returns {void}
     */
    createResultSounds() {
        this.lostSound = this.createAudio('audio/Lost.mp3', 0.6);
        this.wonSound = this.createAudio('audio/freesound_community-gewonnen-87838.mp3', 0.6);
    }


    /**
     * Creates a configured audio element.
     * @param {string} path - Audio path.
     * @param {number} volume - Volume.
     * @param {boolean} loop - Loop state.
     * @returns {HTMLAudioElement} Audio.
     */
    createAudio(path, volume = 0.55, loop = false) {
        const audio = new Audio(path);
        audio.preload = 'auto';
        audio.volume = volume;
        audio.loop = loop;
        return audio;
    }


    /**
     * Returns all managed sounds.
     * @returns {HTMLAudioElement[]} Sounds.
     */
    getAllSounds() {
        return [this.music, this.landingSound, this.coinSound, this.jumpSound,
            this.bottleBreakSound, this.bottleCollectSound, this.characterHitSound,
            this.walkingSound, this.smallChickenHitSound, this.normalChickenHitSound,
            this.endbossHitSound, this.endbossSound, this.lostSound, this.wonSound];
    }


    /**
     * Applies the current mute state to all sounds.
     * @returns {void}
     */
    applyMuteState() {
        this.getAllSounds().forEach((sound) => sound.muted = this.isMuted);
    }


    /**
     * Starts background music.
     * @returns {void}
     */
    start() {
        this.playSound(this.music, 'Die Hintergrundmusik');
    }


    /**
     * Toggles and persists global mute state.
     * @returns {boolean} New mute state.
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.applyMuteState();
        localStorage.setItem('elPolloLocoMuted', this.isMuted);
        return this.isMuted;
    }


    /**
     * Pauses sounds and remembers which ones were playing.
     * @returns {void}
     */
    pauseGameAudio() {
        this.pausedSounds = this.getAllSounds().filter((sound) => !sound.paused);
        this.pausedSounds.forEach((sound) => sound.pause());
    }


    /**
     * Resumes sounds which were active before pausing.
     * @returns {void}
     */
    resumeGameAudio() {
        (this.pausedSounds || []).forEach((sound) => {
            sound.play().catch((error) => console.warn('Ein pausierter Sound konnte nicht fortgesetzt werden:', error));
        });
        this.pausedSounds = [];
    }


    /**
     * Plays a sound from its beginning.
     * @param {HTMLAudioElement} sound - Sound.
     * @param {string} label - Warning label.
     * @returns {void}
     */
    playSound(sound, label) {
        sound.currentTime = 0;
        sound.play().catch((error) => console.warn(`${label} konnte nicht abgespielt werden:`, error));
    }


    /**
     * Stops and rewinds a sound.
     * @param {HTMLAudioElement} sound - Sound.
     * @returns {void}
     */
    stopSound(sound) {
        sound.pause();
        sound.currentTime = 0;
    }


    /**
     * Plays Pepe's landing sound.
     * @returns {void}
     */
    playLandingSound() { this.playSound(this.landingSound, 'Das Landegeräusch'); }


    /**
     * Plays the coin collection sound.
     * @returns {void}
     */
    playCoinSound() { this.playSound(this.coinSound, 'Das Münzgeräusch'); }


    /**
     * Plays Pepe's jump sound.
     * @returns {void}
     */
    playJumpSound() { this.playSound(this.jumpSound, 'Der Sprung-Sound'); }


    /**
     * Plays the bottle impact sound.
     * @returns {void}
     */
    playBottleBreakSound() { this.playSound(this.bottleBreakSound, 'Der Flaschentreffer-Sound'); }


    /**
     * Plays the bottle collection sound.
     * @returns {void}
     */
    playBottleCollectSound() { this.playSound(this.bottleCollectSound, 'Der Flaschensammel-Sound'); }


    /**
     * Plays the small chicken hit sound.
     * @returns {void}
     */
    playSmallChickenHitSound() { this.playSound(this.smallChickenHitSound, 'Der kleine-Huhn-Sound'); }


    /**
     * Plays the normal chicken hit sound.
     * @returns {void}
     */
    playNormalChickenHitSound() { this.playSound(this.normalChickenHitSound, 'Der normale-Huhn-Sound'); }


    /**
     * Plays Pepe's hit sound.
     * @returns {void}
     */
    playCharacterHitSound() { this.playSound(this.characterHitSound, 'Pepes Verletzungs-Sound'); }


    /**
     * Stops Pepe's hit sound.
     * @returns {void}
     */
    stopCharacterHitSound() { this.stopSound(this.characterHitSound); }


    /**
     * Plays the endboss hit sound.
     * @returns {void}
     */
    playEndbossHitSound() { this.playSound(this.endbossHitSound, 'Der Endboss-Verletzungs-Sound'); }


    /**
     * Stops the endboss hit sound.
     * @returns {void}
     */
    stopEndbossHitSound() { this.stopSound(this.endbossHitSound); }


    /**
     * Synchronizes the looping walking sound.
     * @param {boolean} isWalking - Walking state.
     * @returns {void}
     */
    setWalkingSound(isWalking) {
        if (isWalking === this.isWalkingSoundActive) return;
        this.isWalkingSoundActive = isWalking;
        if (isWalking) this.startWalkingSound();
        else this.stopSound(this.walkingSound);
    }


    /**
     * Starts walking audio and recovers from playback errors.
     * @returns {void}
     */
    startWalkingSound() {
        this.walkingSound.play().catch((error) => {
            this.isWalkingSoundActive = false;
            console.warn('Das Laufgeräusch konnte nicht abgespielt werden:', error);
        });
    }


    /**
     * Starts the endboss ambience once.
     * @returns {void}
     */
    startEndbossSound() {
        if (this.endbossSound.paused) this.playSound(this.endbossSound, 'Das Endboss-Geräusch');
    }


    /**
     * Stops the endboss ambience.
     * @returns {void}
     */
    stopEndbossSound() { this.stopSound(this.endbossSound); }


    /**
     * Plays the loss sound.
     * @returns {void}
     */
    playLostSound() { this.playSound(this.lostSound, 'Der Verloren-Sound'); }


    /**
     * Plays the victory sound.
     * @returns {void}
     */
    playWonSound() { this.playSound(this.wonSound, 'Der Gewonnen-Sound'); }


    /**
     * Stops persistent gameplay audio.
     * @returns {void}
     */
    stop() {
        this.stopSound(this.music);
        this.setWalkingSound(false);
        this.stopEndbossSound();
    }


    /**
     * Stops and rewinds all audio before a new game round.
     * @returns {void}
     */
    reset() {
        this.getAllSounds().forEach((sound) => this.stopSound(sound));
        this.isWalkingSoundActive = false;
        this.pausedSounds = [];
    }
}

const audioManager = new AudioManager();
