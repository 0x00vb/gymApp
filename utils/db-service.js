import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';

async function openDatabase() {
    const dbDirectory = FileSystem.documentDirectory + 'SQLite/';
    const dbFilePath = dbDirectory + 'database.db';

    try {
        const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
        if (!fileInfo.exists) {
            // Directory or database file doesn't exist, create directory and download
            await FileSystem.makeDirectoryAsync(dbDirectory, { intermediates: true });
            await FileSystem.downloadAsync(
                Asset.fromModule(require("../assets/database.db")).uri,
                dbFilePath
            );
            console.log('Database downloaded to: ', dbFilePath);
        } else {
            console.log('Database already exists at: ', dbFilePath);
        }
        return SQLite.openDatabase('database.db');
    } catch (error) {
        console.log('Error opening database:', error);
        throw error;
    }
}

export default openDatabase;
