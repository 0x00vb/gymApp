import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';

async function openDatabase(){
    if(!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists){
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
    }
    await FileSystem.downloadAsync(
        Asset.fromModule(require("../assets/database.db")).uri,
        FileSystem.documentDirectory + 'SQLite/database.db'
    )
    .then(({ uri }) => {
        console.log('Downloaded to: ', uri);
    })
    .catch( error => {
        console.log(error)
    })
    return SQLite.openDatabase('database.db')
}

export default openDatabase;