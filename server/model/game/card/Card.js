class Card {
    constructor(type) {
        this.no = -1;
        this.type = type;
        this.road = null; //// road:[up, right, left, down]
        this.fixOrAtk = null;
        this.isReverse = false;
        this.isBack = false;
        switch (type) {
            case Card.BADROAD_TYPE_11:
                this.road = [0, 1, 0, 0];
                this.typeIndex = 0;
                this.cardType = 0;
                break;
            case Card.BADROAD_TYPE_12:
                this.road = [1, 0, 0, 0];
                this.typeIndex = 1;
                this.cardType = 0;
                break;
            case Card.BADROAD_TYPE_21:
                this.road = [0, 1, 0, 1];
                this.typeIndex = 2;
                this.cardType = 0;
                break;
            case Card.BADROAD_TYPE_22:
                this.road = [0, 1, 1, 0];
                this.typeIndex = 3;
                this.cardType = 0;
                break;
            case Card.BADROAD_TYPE_23:
                this.road = [0, 0, 1, 1];
                this.typeIndex = 4;
                this.cardType = 0;
                break;
            case Card.BADROAD_TYPE_24:
                this.road = [1, 0, 0, 1];
                this.typeIndex = 5;
                this.cardType = 0;
                break;
            case Card.BADROAD_TYPE_31:
                this.road = [1, 1, 0, 1];
                this.typeIndex = 6;
                this.cardType = 0;
                break;
            case Card.BADROAD_TYPE_32:
                this.road = [1, 1, 1, 0];
                this.typeIndex = 7;
                this.cardType = 0;
                break;
            case Card.BADROAD_TYPE_41:
                this.road = [1, 1, 1, 1];
                this.typeIndex = 8;
                this.cardType = 0;
                break;
            case Card.GOODROAD_TYPE_11:
                this.road = [0, 1, 1, 0];
                this.typeIndex = 9;
                this.cardType = 1;
                break;
            case Card.GOODROAD_TYPE_12:
                this.road = [1, 0, 0, 1];
                this.typeIndex = 10;
                this.cardType = 1;
                break;
            case Card.GOODROAD_TYPE_21:
                this.road = [0, 0, 1, 1];
                this.typeIndex = 11;
                this.cardType = 1;
                break;
            case Card.GOODROAD_TYPE_22:
                this.road = [0, 1, 0, 1];
                this.typeIndex = 12;
                this.cardType = 1;
                break;
            case Card.GOODROAD_TYPE_31:
                this.road = [0, 1, 1, 1];
                this.typeIndex = 13;
                this.cardType = 1;
                break;
            case Card.GOODROAD_TYPE_32:
                this.road = [1, 0, 1, 1];
                this.typeIndex = 14;
                this.cardType = 1;
                break;
            case Card.GOODROAD_TYPE_41:
                this.road = [1, 1, 1, 1];
                this.typeIndex = 15;
                this.cardType = 1;
                break;
            case Card.STARTROAD_TYPE:
                this.road = [1, 1, 1, 1];
                this.typeIndex = 16;
                this.cardType = 1;
                break;
            case Card.ENDROAD_TYPE_1:
                this.road = [1, 1, 1, 1];
                this.typeIndex = 17;
                this.cardType = 1;
                break;
            case Card.ENDROAD_TYPE_2:
                this.road = [1, 0, 1, 0];
                this.typeIndex = 18;
                this.cardType = 1;
                break;
            case Card.ENDROAD_TYPE_3:
                this.road = [0, 0, 1, 1];
                this.typeIndex = 19;
                this.cardType = 1;
                break;
            case Card.ENDROAD_BACK_TYPE:
                this.typeIndex = 31;
                this.cardType = -1;
                break;
            case Card.FIX_LIGHT:
                this.fixOrAtk = [1, 0, 0];
                this.typeIndex = 20;
                this.cardType = 2;
                break;
            case Card.FIX_MATTOCK:
                this.fixOrAtk = [0, 1, 0];
                this.typeIndex = 21;
                this.cardType = 2;
                break;
            case Card.FIX_MINECAR:
                this.fixOrAtk = [0, 0, 1];
                this.typeIndex = 22;
                this.cardType = 2;
                break;
            case Card.FIX_LIGHT_MATTOCK:
                this.fixOrAtk = [1, 1, 0];
                this.typeIndex = 23;
                this.cardType = 2;
                break;
            case Card.FIX_LIGHT_MINECAR:
                this.fixOrAtk = [1, 0, 1];
                this.typeIndex = 24;
                this.cardType = 2;
                break;
            case Card.FIX_MATTOCK_MINECAR:
                this.fixOrAtk = [0, 1, 1];
                this.typeIndex = 25;
                this.cardType = 2;
                break;
            case Card.BREAK_LIGHT:
                this.fixOrAtk = [-1, 0, 0];
                this.typeIndex = 26;
                this.cardType = 3;
                break;
            case Card.BREAK_MATTOCK:
                this.fixOrAtk = [0, -1, 0];
                this.typeIndex = 27;
                this.cardType = 3;
                break;
            case Card.BREAK_MINECAR:
                this.fixOrAtk = [0, 0, -1];
                this.typeIndex = 28;
                this.cardType = 3;
                break;
            case Card.COLLAPSE:
                this.typeIndex = 29;
                this.cardType = 4;
                break;
            case Card.MAP:
                this.typeIndex = 30;
                this.cardType = 5;
                break;
        }
    }

    /**
     * 設定卡牌編號
     * @param {int} no
     * @memberof Card
     */
    setNo(no) {
        this.no = no;
    }


    /**
     * 設定卡牌翻轉
     * @param {bool} isReverse
     * @memberof Card
     */
    setReverse(isReverse) {
        if (this.type !== Card.ENDROAD_BACK_TYPE) {
            this.isReverse = isReverse;
        }
    }

    /**
     * 設定卡牌背面
     * @param {bool} isBack
     * @memberof Card
     */
    setBack(isBack) {
        if (this.type !== Card.ENDROAD_BACK_TYPE) {
            this.isBack = isBack;
        }
    }

    /**
     * 取得 Road
     * @returns array
     * @memberof Card
     */
    getRoad() {
        return this.isReverse ? this.road.concat().reverse() : this.road.concat();
    }

    //#region road type
    /**
     * Bad Road Type 11
     * @readonly
     * @static
     * @memberof Card
     */
    static get BADROAD_TYPE_11() {
        return 'BADROAD_TYPE_11';
    }

    /**
     * Bad Road Type 12
     * @readonly
     * @static
     * @memberof Card
     */
    static get BADROAD_TYPE_12() {
        return 'BADROAD_TYPE_12';
    }

    /**
     * Bad Road Type 21
     * @readonly
     * @static
     * @memberof Card
     */
    static get BADROAD_TYPE_21() {
        return 'BADROADTYPE_21';
    }

    /**
     * Bad Road Type 22
     * @readonly
     * @static
     * @memberof Card
     */
    static get BADROAD_TYPE_22() {
        return 'BADROAD_TYPE_22';
    }

    /**
     * Bad Road Type 23
     * @readonly
     * @static
     * @memberof Card
     */
    static get BADROAD_TYPE_23() {
        return 'BADROAD_TYPE_23';
    }

    /**
     * Bad Road Type 24
     * @readonly
     * @static
     * @memberof Card
     */
    static get BADROAD_TYPE_24() {
        return 'BADROAD_TYPE_24';
    }

    /**
     * Bad Road Type 31
     * @readonly
     * @static
     * @memberof Card
     */
    static get BADROAD_TYPE_31() {
        return 'BADROAD_TYPE_31';
    }

    /**
     * Bad Road Type 32
     * @readonly
     * @static
     * @memberof Card
     */
    static get BADROAD_TYPE_32() {
        return 'BADROAD_TYPE_32';
    }

    /**
     * Bad Road Type 41
     * @readonly
     * @static
     * @memberof Card
     */
    static get BADROAD_TYPE_41() {
        return 'BADROAD_TYPE_41';
    }

    /**
     * Good Road Type 11
     * @readonly
     * @static
     * @memberof Card
     */
    static get GOODROAD_TYPE_11() {
        return 'GOODROAD_TYPE_11';
    }

    /**
     * Good Road Type 12
     * @readonly
     * @static
     * @memberof Card
     */
    static get GOODROAD_TYPE_12() {
        return 'GOODROAD_TYPE_12';
    }

    /**
     * Good Road Type 21
     * @readonly
     * @static
     * @memberof Card
     */
    static get GOODROAD_TYPE_21() {
        return 'GOODROAD_TYPE_21';
    }

    /**
     * Good Road Type 22
     * @readonly
     * @static
     * @memberof Card
     */
    static get GOODROAD_TYPE_22() {
        return 'GOODROAD_TYPE_22';
    }

    /**
     * Good Road Type 31
     * @readonly
     * @static
     * @memberof Card
     */
    static get GOODROAD_TYPE_31() {
        return 'GOODROAD_TYPE_31';
    }

    /**
     * Good Road Type 32
     * @readonly
     * @static
     * @memberof Card
     */
    static get GOODROAD_TYPE_32() {
        return 'GOODROAD_TYPE_32';
    }

    /**
     * Good Road Type 41
     * @readonly
     * @static
     * @memberof Card
     */
    static get GOODROAD_TYPE_41() {
        return 'GOODROAD_TYPE_41';
    }

    /**
     * Start Road Type
     * @readonly
     * @static
     * @memberof Card
     */
    static get STARTROAD_TYPE() {
        return 'STARTROAD_TYPE';
    }

    /**
     * End Road Type 1
     * @readonly
     * @static
     * @memberof Card
     */
    static get ENDROAD_TYPE_1() {
        return 'ENDROAD_TYPE_1';
    }

    /**
     * End Road Type 2
     * @readonly
     * @static
     * @memberof Card
     */
    static get ENDROAD_TYPE_2() {
        return 'ENDROAD_TYPE_2';
    }

    /**
     * End Road Type 3
     * @readonly
     * @static
     * @memberof Card
     */
    static get ENDROAD_TYPE_3() {
        return 'ENDROAD_TYPE_3';
    }

    /**
     * End Road Back Type
     * @readonly
     * @static
     * @memberof Card
     */
    static get ENDROAD_BACK_TYPE() {
        return 'ENDROAD_BACK_TYPE';
    }
    //#endregion

    //#region action type
    /**
     * Action Type Fix Light
     * @readonly
     * @static
     * @memberof Card
     */
    static get FIX_LIGHT() {
        return 'FIX_LIGHT';
    }

    /**
     * Action Type Fix Mattock
     * @readonly
     * @static
     * @memberof Card
     */
    static get FIX_MATTOCK() {
        return 'FIX_MATTOCK';
    }

    /**
     * Action Type Fix Minecar
     * @readonly
     * @static
     * @memberof Card
     */
    static get FIX_MINECAR() {
        return 'FIX_MINECAR';
    }

    /**
     * Action Type Fix Light Mattock
     * @readonly
     * @static
     * @memberof Card
     */
    static get FIX_LIGHT_MATTOCK() {
        return 'FIX_LIGHT_MATTOCK';
    }

    /**
     * Action Type Fix Light Minecar
     * @readonly
     * @static
     * @memberof Card
     */
    static get FIX_LIGHT_MINECAR() {
        return 'FIX_LIGHT_MINECAR';
    }

    /**
     * Action Type Fix Mattock Minecar
     * @readonly
     * @static
     * @memberof Card
     */
    static get FIX_MATTOCK_MINECAR() {
        return 'FIX_MATTOCK_MINECAR';
    }

    /**
     * Action Type Break Light
     * @readonly
     * @static
     * @memberof Card
     */
    static get BREAK_LIGHT() {
        return 'BREAK_LIGHT';
    }

    /**
     * Action Type Break Mattock
     * @readonly
     * @static
     * @memberof Card
     */
    static get BREAK_MATTOCK() {
        return 'BREAK_MATTOCK';
    }

    /**
     * Action Type Break Minecar
     * @readonly
     * @static
     * @memberof Card
     */
    static get BREAK_MINECAR() {
        return 'BREAK_MINECAR';
    }

    /**
     * Action Type Collapse
     * @readonly
     * @static
     * @memberof Card
     */
    static get COLLAPSE() {
        return 'COLLAPSE';
    }

    /**
     * Action Type Map
     * @readonly
     * @static
     * @memberof Card
     */
    static get MAP() {
        return 'MAP';
    }
    //#endregion

    //#region direction type
    /**
     * Direction Type Up
     * @readonly
     * @static
     * @memberof Card
     */
    static get DIRECTION_UP() {
        return 'DIRECTION_UP';
    }

    /**
     * Direction Type Right
     * @readonly
     * @static
     * @memberof Card
     */
    static get DIRECTION_RIGHT() {
        return 'DIRECTION_RIGHT';
    }

    /**
     * Direction Type Left
     * @readonly
     * @static
     * @memberof Card
     */
    static get DIRECTION_LEFT() {
        return 'DIRECTION_LEFT';
    }

    /**
     * Direction Type Down
     * @readonly
     * @static
     * @memberof Card
     */
    static get DIRECTION_DOWN() {
        return 'DIRECTION_DOWN';
    }
    //#endregion
}

module.exports = Card;