class PlayerInfo extends BaseModule {
    constructor(scene) {
        super(scene);
        this.nickname = null;
        this.locks = null;
        this.isAction = false;
    }

    /**
     * 更新資料
     * @param {array} data
     * @memberof PlayerInfo
     */
    onUpdateData(data) {
        let lockDatas = data.locks;
        //// update lock status
        for (let i = 0; i < 3; i++) {
            let isLock = lockDatas[i];
            let lock = this.locks[i];
            lock.setFrame(isLock ? i : i + 3);
        }
    }

    /**
     * 執行遊戲動作
     * @memberof PlayerInfo
     */
    onAction() {
        this.isAction = true;
    }

    /**
     * 禁止執行遊戲動作
     * @memberof PlayerInfo
     */
    unAction() {
        this.isAction = false;
    }

    /**
     * 檢查是否可以被指定修復或破壞
     * @param {array} lockDatas
     * @memberof PlayerInfo
     */
    onCanFixOrCanAtk(lockDatas) {
        if (!lockDatas) {
            return -1;
        }

        for (let i = 0; i < 3; i++) {
            let isLock = lockDatas[i];
            let lock = this.locks[i];
            let lockStatus = lock.frame.name === i ? -1 : 1;
            switch (isLock) {
                case -1:
                    if (lockStatus === 1) {
                        return 1;
                    }
                    break;
                case 1:
                    if (lockStatus === -1) {
                        return 0;
                    }
                    break;
            }
        }

        return -1; //// -1:None, 0:Fix, 1:Atk
    }
}