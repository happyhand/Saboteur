class JoinGameAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof JoinGameAction
     */
    action(data) {}

    /**
     * 回覆
     * @param {object} data
     * @memberof JoinGameAction
     */
    response(data) {
        new LoadAction().action();
        this.do(ActionType.JOIN_GAME, data);
    }
}