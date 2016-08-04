
import mongodb from 'mongodb';
const MongoClient = mongodb.MongoClient;

const URL = 'mongodb://localhost:27017/microcosm';

let dbPromise;

export default function() {
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
