class DBData {
    constructor(db, callBack) {
        this.db = db;
        this.callBack = callBack;
    }

    onReceiveResult(...result)
    {
        this.callBack.apply(null, result);
    }
}

module.exports = DBData;