class AddRobotAction extends Action {
    /**
     * 執行
     * @param {object} data
     * @memberof AddRobotAction
     */
    action(data) {
        Socket.getInstance().requestAddRobot(data);
    }

    /**
     * 回覆
     * @param {object} data
     * @memberof AddRobotAction
     */
    response(data) {
        switch (data) {
            case -1:
                new MessageAction().action([MessageType.SYS_ADD_ROBOT_FAIL]);
                break;
        }
    }
}