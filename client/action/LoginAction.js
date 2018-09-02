class LoginAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof LoginAction
     */
    action(data) {
        Socket.getInstance().requestLogin(data);
    }

    /**
     * 回覆
     * @param {object} data
     * @memberof LoginAction
     */
    response(data) {
        if (data[0] === 1) {
            PlayerData.getInstance().nickname = data[1];
        } else {
            new MessageAction().action([MessageType.SYS_LOGIN_FAIL]);
            this.do(ActionType.LOGIN_ERROR);
        }
    }
}