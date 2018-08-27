class ActionAnims extends BaseModule {
    constructor(scene) {
        super(scene);

        this.actionAnimsContainer = null;
    }

    /**
     * 初始元件
     * @memberof ActionAnims
     */
    onInit() {
        this.onCreateActionAnims();
    }

    /**
     * 創建指定動作動畫
     * @memberof ActionAnims
     */
    onCreateActionAnims() {
        let self = this;
        let createActionAnims = function (key, frames) {
            self.scene.anims.create({
                key: key,
                frames: self.scene.anims.generateFrameNumbers(key, {
                    start: frames[0],
                    end: frames[1]
                }),
                frameRate: 6,
                showOnStart: true,
                hideOnComplete: true
            });
        };

        createActionAnims('gameActionAnimsA1', [0, 8]);
        createActionAnims('gameActionAnimsA2', [0, 8]);
        createActionAnims('gameActionAnimsA3', [0, 6]);
        createActionAnims('gameActionAnimsF1', [0, 8]);
        createActionAnims('gameActionAnimsF2', [0, 8]);
        createActionAnims('gameActionAnimsF3', [0, 8]);
        this.actionAnimsContainer = this.scene.add.container();
    }

    /**
     * 播放指定動作動畫
     * @param {int} 
     * -1:Break Light, -2:Break Mattock, -3:Break Minecar, 
     * 1:Fix Light, 2:Fix Mattock, 3:Fix Minecar, 
     * @memberof MainPlayerInfo
     */
    onPlayActionAnims(type) {
        let self = this;
        let playAnims = function (key) {
            let anims = self.scene.add.sprite(859.5, 704, key);
            anims.on('animationcomplete', function () {
                self.actionAnimsContainer.remove(anims);
                anims.destroy();
            });
            anims.anims.play(key);
            self.actionAnimsContainer.addAt(anims, 0);
        };

        switch (type) {
            case -1:
                playAnims('gameActionAnimsA1');
                break;
            case -2:
                playAnims('gameActionAnimsA2');
                break;
            case -3:
                playAnims('gameActionAnimsA3');
                break;
            case 1:
                playAnims('gameActionAnimsF1');
                break;
            case 2:
                playAnims('gameActionAnimsF2');
                break;
            case 3:
                playAnims('gameActionAnimsF3');
                break;
        }
    }
}