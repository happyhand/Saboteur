class AppointActionAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof AppointActionAction
     */
    action(data) {}

    /**
     * 回覆
     * @param {object} data
     * @memberof AppointActionAction
     */
    response(data) {
        this.do(ActionType.ACTION_ANIMS, data);
    }
}