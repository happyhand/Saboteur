const MEMBER_DATA_NAME = 'Member';
const ASSERT = require('assert');
class MemberBase {
    constructor() {}
    //#region 請求動作
    onLogin(dbData, account, callBack) {
        let self = this;
        let db = dbData.db;
        db.collection(MEMBER_DATA_NAME, function (err, collection) {
            collection.findOne({
                'account': account
            }, function (err, item) {
                if (item) {
                    if (!item.isLogin) {
                        if (item.account === account) {
                            collection.updateOne({
                                'account': account
                            }, {
                                $set: {
                                    'isLogin': true
                                }
                            }, function (err, result) {
                                callBack.call(null, dbData, 1);
                            });
                        } else {
                            callBack.call(null, dbData, -1);
                        }
                    } else {
                        callBack.call(null, dbData, -1);
                    }
                } else {
                    collection.insertOne({
                        'account': account,
                        'isLogin': true
                    });

                    callBack.call(null, dbData, 1);
                }
            });
        });
    }

    onLogout(dbData, account, callBack) {
        let self = this;
        let db = dbData.db;
        db.collection(MEMBER_DATA_NAME, function (err, collection) {
            collection.findOne({
                'account': account
            }, function (err, item) {
                if (item) {
                    if (item.isLogin) {
                        if (item.account === account) {
                            collection.updateOne({
                                'account': account
                            }, {
                                $set: {
                                    'isLogin': false
                                }
                            }, function (err, result) {
                                callBack.call(null, dbData, 1);
                            });
                        } else {
                            callBack.call(null, dbData, -1);
                        }
                    } else {
                        callBack.call(null, dbData, -1);
                    }
                } else {
                    callBack.call(null, dbData, -1);
                }
            });
        });
    }
    //#endregion

    //#region get and set
    getMemberData(db, account, callBack) {
        db.collection(MEMBER_DATA_NAME, function (err, collection) {
            collection.findOne({
                'account': account
            }, function (err, item) {
                callBack.call(null, item); //// 無法用 apply，傳回 item 參數會是 undefined
            });
        });
    }

    static get baseName() {
        return 'MemberBase';
    }
    //#endregion
}

module.exports = MemberBase;