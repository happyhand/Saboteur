class FinishGameAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof FinishGameAction
     */
    action(data) {}

    /**
     * 回覆
     * @param {object} data
     * @memberof FinishGameAction
     */
    response(data) {
        switch (data[0]) {
            case -1:
                new MessageAction().action([MessageType.SYS_THE_GAME_HAS_BEEN_CLOSED]);
                new LoadAction().action();
                break;
            case 1:
            case 2:
                this.do(ActionType.GAME_OVER, data);
                break;
        }
    }
}