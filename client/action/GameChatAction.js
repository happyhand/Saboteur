class GameChatAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof GameChatAction
     */
    action(data) {
        Socket.getInstance().requestGameChat(data);
    }

    /**
     * 回覆
     * @param {object} data
     * @memberof GameChatAction
     */
    response(data) {
        this.do(ActionType.GAME_CHAT, data);
    }
}