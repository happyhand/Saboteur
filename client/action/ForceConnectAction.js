class ForceConnectAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof ForceConnectAction
     */
    action(data) {
        new MessageAction().action([MessageType.SYS_FORCE_DISCONNECTED]);
        Socket.getInstance().onClose();
        this.do(ActionType.GAME_INIT);
    }

    /**
     * 回覆
     * @param {object} data
     * @memberof ForceConnectAction
     */
    response(data) {}
}