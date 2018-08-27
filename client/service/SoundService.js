const SOUND_SERVICE_INSTANCE = Symbol('instance');
class SoundService {
    constructor(name) {
        let Class = new.target; // or this.constructor
        if (!Class[SOUND_SERVICE_INSTANCE]) {
            Class[SOUND_SERVICE_INSTANCE] = this;
            this.sounds = {};
        }

        return Class[SOUND_SERVICE_INSTANCE];
    }

    onRegister(key, sound) {
        this.sounds[key] = sound;
    }

    onPlay(key, isLoop, completeCallBack) {
        let sound = this.sounds[key];
        if(sound)
        {
            sound.play();
            sound.loop = isLoop;
            if(completeCallBack)
            {
                sound.on('ended', completeCallBack);
            }
        }
    }

    onStop(key)
    {
        let sound = this.sounds[key];
        if(sound)
        {
            sound.stop();
        }
    }

    isPlaying(key)
    {
        let sound = this.sounds[key];
        if(sound)
        {
            return sound.isPlaying;
        }

        return false;
    }

    /**
     * 音效總管單例
     * @static
     * @returns
     * @memberof SoundService
     */
    static getInstance() {
        if (!this[SOUND_SERVICE_INSTANCE]) {
            this[SOUND_SERVICE_INSTANCE] = new SoundService();
        }

        return this[SOUND_SERVICE_INSTANCE];
    }
}