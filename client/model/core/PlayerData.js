const PLAYER_DATA_INSTANCE = Symbol('instance');
class PlayerData {
    constructor() {
        let Class = new.target; // or this.constructor
        if(!Class[PLAYER_DATA_INSTANCE]) {
            Class[PLAYER_DATA_INSTANCE] = this;
            this.nickname = '';
        }
        
        return Class[PLAYER_DATA_INSTANCE];
    }

    /**
     * 玩家資訊單例
     * @static
     * @returns
     * @memberof PlayerData
     */
    static getInstance() {
        if (!this[PLAYER_DATA_INSTANCE]) {
            this[PLAYER_DATA_INSTANCE] = new PlayerData();
        }

        return this[PLAYER_DATA_INSTANCE];
    }
}