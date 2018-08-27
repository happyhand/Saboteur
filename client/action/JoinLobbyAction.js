class JoinLobbyAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof JoinLobbyAction
     */
    action(data) {}

    /**
     * 回覆
     * @param {object} data
     * @memberof JoinLobbyAction
     */
    response(data) {
        this.do(ActionType.JOIN_LOBBY);
    }
}