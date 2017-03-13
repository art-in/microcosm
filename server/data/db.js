
import mongodb from 'mongodb';
const MongoClient = mongodb.MongoClient;

const URL = 'mongodb://localhost:27017/microcosm';

let dbPromise;

/**
 * Connects to database
 * @return {promise.<Db>}
 */
export function connect() {
    if (!dbPromise) {
        dbPromise = MongoClient
            .connect(URL)
            .then(db => {
                console.log('Connected to DB on', URL);
                return db;
            });
    }
    
    return dbPromise;
}