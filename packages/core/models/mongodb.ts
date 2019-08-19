import {
    MongoClient,
    Db,
    ObjectID,
    InsertOneWriteOpResult,
    DeleteWriteOpResultObject,
} from 'mongodb'
import Config from '../../config.json'

export class Mongodb {
    public db: Db
    public collectionName: string

    constructor(db: Db, collectionName: string) {
        this.db = db
        this.collectionName = collectionName
    }

    public static async connection(collectionName: string) {
        try {
            const client: MongoClient = await MongoClient.connect(Config.mongodb.localhost, {
                useNewUrlParser: true,
            })
            const db: Db = client.db(Config.mongodb.connection)
            return new Mongodb(db, collectionName)
        } catch (err) {
            throw err
        }
    }

    public all(): Promise<Array<object>> {
        return this.db
            .collection(this.collectionName)
            .find()
            .sort({ name: 1 })
            .toArray()
    }

    public find(where: object): Promise<Array<object> | null> {
        return this.db
            .collection(this.collectionName)
            .find(where)
            .toArray()
    }

    public insert(data: object): Promise<InsertOneWriteOpResult> {
        return this.db.collection(this.collectionName).insertOne(data, { w: 1 })
    }

    public delete(id: string | ObjectID): Promise<DeleteWriteOpResultObject> {
        let findID: ObjectID
        if (typeof id !== 'object') {
            findID = new ObjectID(id)
        } else {
            findID = id
        }
        return this.db.collection(this.collectionName).deleteOne({ _id: findID }, { w: 1 })
    }
}
