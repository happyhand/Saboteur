const MAX_OF_TEAM = 4;
class GameFinishAnims extends BaseModule {
    constructor(scene) {
        super(scene);
        this.background = null;
        this.goodManMark = null;
        this.goodManAnims = null;
        this.badManMark = null;
        this.badManAnims = null;
        this.infoFrame = null;
        this.goodManTeamTxts = null;
        this.badManTeamTxts = null;
        this.reJoinButton = null;
        this.exitButton = null;
    }

    /**
     * 初始元件
     * @memberof GameFinishAnims
     */
    onInit() {
        this.onCreateBackground();
        this.onCreateMark();
        this.onCreateAnims();
        this.onCreateInfoFrame();
        this.onCreateInfoTxt();
        this.onCreateButton();
        this.unPlay();
    }

    /**
     * 創建背景元件
     * @memberof GameFinishAnims
     */
    onCreateBackground() {
        this.background = this.scene.add.image(525, 400, 'gameFinishBackground').setInteractive(); //// 設定 interactive，防止底下 Game 元件 MouseEvent 觸發
    }

    /**
     * 創建標誌元件
     * @memberof GameFinishAnims
     */
    onCreateMark() {
        this.goodManMark = this.scene.add.image(525, 190, 'gameGoodManWinMark');
        this.badManMark = this.scene.add.image(525, 190, 'gameBadManWinMark');
    }

    /**
     * 創建動畫元件
     * @memberof GameFinishAnims
     */
    onCreateAnims() {
        this.scene.anims.create({
            key: 'GameGoodManWinAnims_1',
            frames: this.scene.anims.generateFrameNumbers('gameGoodManWinAnims', {
                start: 0,
                end: 5
            }),
            frameRate: 4,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'GameGoodManWinAnims_2',
            frames: this.scene.anims.generateFrameNumbers('gameGoodManWinAnims', {
                start: 6,
                end: 7
            }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'GameBadManWinAnims_1',
            frames: this.scene.anims.generateFrameNumbers('gameBadManWinAnims', {
                start: 0,
                end: 5
            }),
            frameRate: 4,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'GameBadManWinAnims_2',
            frames: this.scene.anims.generateFrameNumbers('gameBadManWinAnims', {
                start: 6,
                end: 8
            }),
            frameRate: 6,
        });

        this.scene.anims.create({
            key: 'GameBadManWinAnims_3',
            frames: this.scene.anims.generateFrameNumbers('gameBadManWinAnims', {
                start: 8,
                end: 9
            }),
            frameRate: 5,
            repeat: -1
        });

        this.goodManAnims = this.scene.add.sprite(525, 475, 'gameGoodManWinAnims');
        this.badManAnims = this.scene.add.sprite(525, 475, 'gameBadManWinAnims');
    }

    /**
     * 創建資訊框元件
     * @memberof GameFinishAnims
     */
    onCreateInfoFrame() {
        this.infoFrame = this.scene.add.image(528, 495.5, 'gameFinishInfoFrame');
    }

    /**
     * 創建資訊文字欄元件
     * @memberof GameFinishAnims
     */
    onCreateInfoTxt() {
        this.goodManTeamTxts = [];
        this.badManTeamTxts = [];
        for (let i = 0; i < MAX_OF_TEAM; i++) {
            let goodManTeamTxt = this.scene.add.text(56, 395 + i * 39, '', {
                fontFamily: 'Microsoft JhengHei',
                fontSize: 24,
                color: '#000000',
            });
            this.goodManTeamTxts.push(goodManTeamTxt);

            let badManTeamTxt = this.scene.add.text(786, 395 + i * 39, '', {
                fontFamily: 'Microsoft JhengHei',
                fontSize: 24,
                color: '#000000'
            });
            this.badManTeamTxts.push(badManTeamTxt);
        }
    }


    /**
     * 創建按鈕元件
     * @memberof GameFinishAnims
     */
    onCreateButton() {
        let self = this;
        this.reJoinButton = this.scene.add.image(404.5, 732.5, 'gameFinishReJoinButton').setInteractive();
        this.reJoinButton.on('pointerup', function () {
            self.scene.onRequestReGame();
        });

        this.exitButton = this.scene.add.image(645.5, 732.5, 'gameFinishExitButton').setInteractive();
        this.exitButton.on('pointerup', function () {
            self.scene.onRequestExitGame();
        });
    }

    /**
     * 播放 Good Man Win Anims
     * @param {object} teamData
     * @memberof GameFinishAnims
     */
    onPlayGoodMan(teamData) {
        //// backgrouund
        this.background.visible = true;
        //// mark
        this.goodManMark.visible = false;
        //// anims
        let self = this;
        this.goodManAnims.once('animationcomplete', function () {
            self.onTransformGoodManAnim(self);
        });
        this.goodManAnims.anims.play('GameGoodManWinAnims_1');
        this.goodManAnims.visible = true;
        //// info
        this.onUpdateTeamInfo(teamData);
        this.infoFrame.visible = true;
    }

    /**
     * 播放 Bad Man Win Anims
     * @param {object} teamData
     * @memberof GameFinishAnims
     */
    onPlayBadMan(teamData) {
        //// backgrouund
        this.background.visible = true;
        //// mark
        this.badManMark.visible = false;
        //// anims
        let self = this;
        this.badManAnims.once('animationcomplete', function () {
            self.onTransformBadManAnim(self, 2);
        });
        this.badManAnims.anims.play('GameBadManWinAnims_1');
        this.badManAnims.visible = true;
        //// info
        this.onUpdateTeamInfo(teamData);
        this.infoFrame.visible = true;
    }

    /**
     * 停播 Win Anims
     * @memberof GameFinishAnims
     */
    unPlay() {
        //// backgrouund
        this.background.visible = false;
        //// mark
        this.goodManMark.visible = false;
        this.badManMark.visible = false;
        //// anims
        this.goodManAnims.anims.stop();
        this.goodManAnims.visible = false;
        this.badManAnims.anims.stop();
        this.badManAnims.visible = false;
        //// button
        this.reJoinButton.visible = false;
        this.exitButton.visible = false;
        //// info
        for (let i = 0; i < MAX_OF_TEAM; i++) {
            let goodManTeamTxt = this.goodManTeamTxts[i];
            let badManTeamTxt = this.badManTeamTxts[i];
            goodManTeamTxt.setText('');
            goodManTeamTxt.visible = false;
            badManTeamTxt.setText('');
            badManTeamTxt.visible = false;
        }

        this.infoFrame.visible = false;
    }

    /**
     * 轉換 Good Man Anims
     * @param {GameScene} scene
     * @memberof GameFinishAnims
     */
    onTransformGoodManAnim(scene) {
        scene.scene.time.delayedCall(250, function () {
            scene.goodManMark.visible = true;
            scene.goodManAnims.anims.play('GameGoodManWinAnims_2');
            scene.reJoinButton.visible = true;
            scene.exitButton.visible = true;
        }, scene);
    }

    /**
     * 轉換 Bad Man Anims
     * @param {GameScene} scene
     * @memberof GameFinishAnims
     */
    onTransformBadManAnim(scene, index) {
        if (index == 2) {
            scene.scene.time.delayedCall(250, function () {
                scene.badManAnims.once('animationcomplete', function () {
                    scene.onTransformBadManAnim(scene, 3);
                });
                scene.badManAnims.anims.play('GameBadManWinAnims_2');
            }, scene);
        } else {
            scene.badManMark.visible = true;
            scene.badManAnims.anims.play('GameBadManWinAnims_3');
            scene.reJoinButton.visible = true;
            scene.exitButton.visible = true;
        }
    }

    /**
     * 更新隊伍資訊
     * @param {object} teamData
     * @memberof GameFinishAnims
     */
    onUpdateTeamInfo(teamData) {
        let handleTeamList = function (team, txts, maxWidth) {
            for (let i = 0; i < MAX_OF_TEAM; i++) {
                let man = team[i];
                let txt = txts[i];
                if (man) {
                    txt.setText(InputService.onReduceTxtInput(txt, man, maxWidth));
                    txt.visible = true;
                } else {
                    txt.setText('');
                    txt.visible = false;
                }
            }
        }

        let goodManTeam = teamData.goodManTeam;
        let badManTeam = teamData.badManTeam;
        handleTeamList(goodManTeam, this.goodManTeamTxts, 220);
        handleTeamList(badManTeam, this.badManTeamTxts, 220);
    }
}