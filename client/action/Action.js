class Action {
    /**
     * 分派
     * @param {string} type
     * @param {object} data
     * @memberof Action
     */
    do(type, data) {
        let scenes = GAME.scene.scenes;
        for (let scene of scenes) {
            if (scene.action) {
                scene.action(type, data);
            }
        }
    }
}