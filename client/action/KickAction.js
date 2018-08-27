class KickAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof KickAction
     */
    action(data) {
        Socket.getInstance().requestKick(data);
    }

    /**
     * 回覆
     * @param {object} data
     * @memberof KickAction
     */
    response(data) {}
}