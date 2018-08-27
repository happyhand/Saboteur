const INIT = 1;
const PREPARE = 2;
const READY = 3;
class BaseScene extends Phaser.Scene {
    constructor(name) {
        super(name);
        this.status = INIT;
        this.actionQueues = [];
    }

    /**
     * Phaser-create
     * @memberof BaseScene
     */
    create() {
        if (this.status === PREPARE) {
            let self = this;
            this.scene.sleep();
            this.sys.events.once('sleep', function () {
                self.status = READY;
                for (let action of self.actionQueues) {
                    self.action(action.type, action.data);
                }
            });
        }
    }

    /**
     * 執行動作事件 (初始化))
     * @param {string} type
     * @param {object} data
     * @returns bool
     * @memberof BaseScene
     */
    action(type, data) {
        //// 處於未建立狀態
        if (this.status !== READY) {
            //// 暫存 action
            this.actionQueues.push({
                type: type,
                data: data
            });
            //// scene 建立
            if (this.status === INIT) {
                //// scene 建立
                this.status = PREPARE;
                this.scene.start();
            }

            return false;
        }

        return true;
    }

    /**
     * 喚醒場景
     * @returns bool
     * @memberof BaseScene
     */
    onWake() {
        if (this.status !== READY) {
            console.log(this.sys.config + ' Wake Error :: The scene is not ready.');
            return false;
        }

        if (this.scene.isSleeping()) {
            GAME.scene.wake(this.sys.config);
        }

        return true;
    }

    /**
     * 休眠場景
     * @returns bool
     * @memberof BaseScene
     */
    onSleep() {
        if (this.status !== READY) {
            console.log(this.sys.config + ' Sleep Error :: The scene is not ready.');
            return false;
        }

        if (!this.scene.isSleeping()) {
            GAME.scene.sleep(this.sys.config);
        }

        return true;
    }
}