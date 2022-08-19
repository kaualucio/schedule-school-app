import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase("db.notebook_app")

export default db