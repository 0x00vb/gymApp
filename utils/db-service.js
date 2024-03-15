import * as SQLite from 'expo-sqlite';

const dbConnection = SQLite.openDatabase('workout_logger.db');

export default dbConnection;