import {
    MongoClient,
    Db,
    ObjectID,
    InsertOneWriteOpResult,
    DeleteWriteOpResultObject,
} from 'mongodb'
import { IGameInformation } from '../data'

export default class Galgame {
    private db: Db
    private dbname: string

    constructor(db: Db, dbname: string) {
        this.db = db
        this.dbname = dbname
    }

    public static connect() {
        return new Promise((resolve, reject) => {
            MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true })
                .then((client: MongoClient) => {
                    const db: Db = client.db('stars-2dfan')
                    resolve(db)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    public all(): Promise<Array<IGameInformation>> {
        return this.db
            .collection(this.dbname)
            .find()
            .sort({ name: 1 })
            .toArray()
    }

    public find(id: any): Promise<Array<IGameInformation> | null> {
        let findID: ObjectID
        if (typeof id !== 'object') {
            findID = new ObjectID(id)
        } else {
            findID = id
        }
        return this.db.collection(this.dbname).findOne({ _id: findID })
    }

    public create(data: IGameInformation): Promise<InsertOneWriteOpResult> {
        return this.db.collection(this.dbname).insertOne(data, { w: 1 })
    }

    public delete(id: string | ObjectID): Promise<DeleteWriteOpResultObject> {
        let findID: ObjectID
        if (typeof id !== 'object') {
            findID = new ObjectID(id)
        } else {
            findID = id
        }
        return this.db.collection(this.dbname).deleteOne({ _id: findID }, { w: 1 })
    }
}
