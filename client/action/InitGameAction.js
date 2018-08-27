class InitGameAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof InitGameAction
     */
    action(data) {
        this.do(ActionType.GAME_INIT);
    }

    /**
     * 回覆
     * @param {object} data
     * @memberof InitGameAction
     */
    response(data) {}
}