const SOUND_SERVICE_INSTANCE = Symbol('instance');
class SoundService {
    constructor(name) {
        let Class = new.target; // or this.constructor
        if (!Class[SOUND_SERVICE_INSTANCE]) {
            Class[SOUND_SERVICE_INSTANCE] = this;
            this.sounds = {};
            this.volume = 0.5;
        }

        return Class[SOUND_SERVICE_INSTANCE];
    }

    /**
     * 註冊音效
     * @param {string} key
     * @param {Sound} sound
     * @memberof SoundService
     */
    onRegister(key, sound) {
        if(!this.sounds[key])
        {
            sound.volume = this.volume;
            this.sounds[key] = sound;
        }
    }

    /**
     * 播放音效
     * @param {string} key
     * @param {bool} isLoop
     * @param {function} completeCallBack
     * @memberof SoundService
     */
    onPlay(key, isLoop, completeCallBack) {
        let sound = this.sounds[key];
        if (sound) {
            sound.play();
            sound.loop = isLoop;
            if (completeCallBack) {
                sound.on('ended', completeCallBack);
            }
        }
    }

    /**
     * 停止音效
     * @param {string} key
     * @memberof SoundService
     */
    onStop(key) {
        let sound = this.sounds[key];
        if (sound) {
            sound.stop();
        }
    }

    /**
     * 檢查是否播放音效
     * @param {string} key
     * @returns bool
     * @memberof SoundService
     */
    isPlaying(key) {
        let sound = this.sounds[key];
        if (sound) {
            return sound.isPlaying;
        }

        return false;
    }

    /**
     * 調整音量
     * @param {number} value
     * @memberof SoundService
     */
    onHandleVolume(value) {
        this.volume = value;
        for (let key in this.sounds) {
            let sound = this.sounds[key];
            sound.volume = value;
        }
    }

    /**
     * 取得當前音量
     * @returns number
     * @memberof SoundService
     */
    getCurrentVolume()
    {
        return this.volume;
    }

    /**
     * 音效總管單例
     * @static
     * @returns SoundService
     * @memberof SoundService
     */
    static getInstance() {
        if (!this[SOUND_SERVICE_INSTANCE]) {
            this[SOUND_SERVICE_INSTANCE] = new SoundService();
        }

        return this[SOUND_SERVICE_INSTANCE];
    }
}