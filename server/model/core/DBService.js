const DBSERVICE_INSTANCE = Symbol('instance');
const DBBASE_URL = 'mongodb://localhost:27017';
const MIN_POOL = 10;
class DBService {
    constructor() {
        let Class = new.target; // or this.constructor
        if (!Class[DBSERVICE_INSTANCE]) {
            Class[DBSERVICE_INSTANCE] = this;
            this.idlePools = null;
            this.actionQueue = null;
            this.isCreateConnect = false;
            this.memberDB = null;
        }

        return Class[DBSERVICE_INSTANCE];
    }
    //#region 請求動作
    onInit() {
        if (!this.memberDB) {
            let memberBaseClass = require('./db/MemberBase.js');
            this.memberDB = new memberBaseClass();
        }

        this.idlePools = [];
        this.actionQueue = [];
        this.doCreateConnect(MIN_POOL);
    }

    onLogin(account, callBack) {
        if (!this.hasIdleConnect(this.onLogin, account, callBack)) {
            return;
        }
        
        let client = this.idlePools.pop();
        let db = client.db(require('./db/MemberBase.js').baseName);
        let dbDataClass = require('./db/DBData.js');
        let dbData = new dbDataClass(db, callBack);
        this.memberDB.onLogin(dbData, account, this.receiveLogin);
    }

    onLogout(account, callBack) {
        if (!this.hasIdleConnect(this.onLogout, account, callBack)) {
            return;
        }
        
        let client = this.idlePools.pop();
        let db = client.db(require('./db/MemberBase.js').baseName);
        let dbDataClass = require('./db/DBData.js');
        let dbData = new dbDataClass(db, callBack);
        this.memberDB.onLogout(dbData, account, this.receiveLogin);
    }
    //#endregion

    //#region 接收 DBBase 回覆
    receiveLogin(dbData, result)
    {
        dbData.onReceiveResult(result);
    }

    receiveLogot(dbData, result)
    {
        // dbData.onReceiveResult(result);
    }
    //#endregion

    //#region 執行動作
    /**
     * 創建連線
     * @param {int} number
     * @memberof MemberBase
     */
    doCreateConnect(number) {
        let self = this;
        let remainNo = number;
        let mongoClient = require('mongodb').MongoClient;
        this.isCreateConnect = true;
        for (let i = 1; i <= number; i++) {
            mongoClient.connect(DBBASE_URL, {
                useNewUrlParser: true
            }, function (err, client) {
                if (err) throw err;
                self.idlePools.push(client);
                remainNo--;
                if (remainNo === 0) {
                    self.isCreateConnect = false;
                    self.doActionQueue();
                }
            });
        }
    }

    /**
     * 執行動作序列
     * @memberof DBService
     */
    doActionQueue() {
        let actionQueue = this.actionQueue.splice(0);
        let noOfActionQueue = actionQueue.length;
        for (let i = 0; i < noOfActionQueue; i++) {
            let action = actionQueue.shift();
            let doFun = action.doFun;
            let doParameters = action.doParameters;
            if (this.hasIdleConnect(doFun, doParameters)) {
                doFun.apply(this, doParameters);
            }
        }
    }
    //#endregion

    //#region 輔助動作
    /**
     * 確認是否還存在閒置連線
     * @param {function} doFun
     * @param {array} doParameters
     * @returns bool
     * @memberof DBService
     */
    hasIdleConnect(doFun, ...doParameters) {
        if (this.idlePools.length === 0) {
            this.actionQueue.push({
                doFun: doFun,
                doParameters: doParameters
            });
            if (!this.isCreateConnect) {
                this.doCreateConnect(MIN_POOL);
            }

            return false;
        }

        return true;
    }
    //#endregion

    static getInstance() {
        if (!this[DBSERVICE_INSTANCE]) {
            this[DBSERVICE_INSTANCE] = new DBService();
        }

        return this[DBSERVICE_INSTANCE];
    }
}

module.exports = DBService;