class PutCardAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof PutCardAction
     */
    action(data) {
        let type = data[0];
        switch (type) {
            case -1:
                new MessageAction().action([MessageType.SYS_NOT_APPOINT_PUT_CARD]);
                break;
            case 0:
                Socket.getInstance().requestGiveUpCard(data[1]);
                break;
            case 1:
                Socket.getInstance().requestDigCard(data[1]);
                break;
            case 2:
                Socket.getInstance().requestFixCard(data[1]);
                break;
            case 3:
                Socket.getInstance().requestAtkCard(data[1]);
                break;
            case 4:
                Socket.getInstance().requestCollapseCard(data[1]);
                break;
            case 5:
                Socket.getInstance().requestWatchCard(data[1]);
                break;
        }
    }

    /**
     * 回覆
     * @param {object} data
     * @memberof PutCardAction
     */
    response(data) {
        this.do(ActionType.PUT_CARD, data);
    }
}