class MapActionAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof MapActionAction
     */
    action(data) {}

    /**
     * 回覆
     * @param {object} data
     * @memberof MapActionAction
     */
    response(data) {
        let type = data[0];
        let position = data[1];
        switch (type) {
            case 1:
                this.do(ActionType.DIG_ANIMS, position);
                break;
            case 2:
                this.do(ActionType.COLLAPSE_ANIMS, position);
                break;
            case 3:
                this.do(ActionType.WATCH_CARD, position);
                break;
        }
    }
}