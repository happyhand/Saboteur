class CreateGameAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof CreateGameAction
     */
    action(data) {
        Socket.getInstance().requestCreateGame();
    }

    /**
     * 回覆
     * @param {object} data
     * @memberof CreateGameAction
     */
    response(data) {
        switch (data) {
            case 1:
                this.do(ActionType.CREATE_GAME);
                break;
            case -1:
                new MessageAction().action(MessageType.SYS_CREATE_GAME_ERROR_FOR_PLAYER_NOT_READY);
                this.do(ActionType.CREATE_GAME_ERROR);
                break;
        }
    }
}