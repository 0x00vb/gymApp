import React, { createContext, useContext, useEffect, useState } from 'react';
import { openDatabaseAsync } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

// Create context
const DatabaseContext = createContext(null);

// Export hook for component use
export const useDatabase = () => useContext(DatabaseContext);

/**
 * Helper to safely interpolate parameters into SQL queries
 */
const interpolateQuery = (query, params) => {
  let index = 0;
  return query.replace(/\?/g, () => {
    const val = params[index++];
    if (typeof val === 'number') return val;
    if (val === null) return 'NULL';
    return `'${String(val).replace(/'/g, "''")}'`; // escape single quotes
  });
};

/**
 * Database Provider Component
 */
export const DatabaseProvider = ({ children }) => {
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let dbInstance = null;
    
    const initDb = async () => {
      try {
        setLoading(true);
        
        // Ensure database directory exists
        const dbDirectory = FileSystem.documentDirectory + 'SQLite/';
        const dbFilePath = dbDirectory + 'database.db';
        const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
        console.log('DB file exists?', fileInfo.exists, dbFilePath);
        
        // Copy database from assets if it doesn't exist
        if (!fileInfo.exists) {
          await FileSystem.makeDirectoryAsync(dbDirectory, { intermediates: true });
        
          const asset = Asset.fromModule(require("../assets/database.db"));
          await asset.downloadAsync(); // ensure it's available locally
          console.log('Asset localUri:', asset.localUri); // This should be a file URI
          if (!asset.localUri) throw new Error('Database asset localUri is null');
          await FileSystem.copyAsync({
            from: asset.localUri,
            to: dbFilePath,
          });
        
          console.log('Database copied to:', dbFilePath);
        }        
        // Open database connection
        dbInstance = await openDatabaseAsync('database.db');
        
        // Enable foreign keys
        await dbInstance.execAsync(`PRAGMA foreign_keys = ON;`);
        
        // Create database helpers
        const dbHelpers = {
          // Query for SELECT statements that return results
          executeQuery: async (sql, params = []) => {
            try {
              return await dbInstance.getAllAsync(sql, params);
            } catch (error) {
              console.error(`Query error: ${sql}`, error);
              throw new Error(`Database query failed: ${error.message}`);
            }
          },
          
          // Execute for statements that modify data (INSERT, UPDATE, DELETE)
          executeRun: async (sql, params = []) => {
            try {
              // Validate parameters
              const safeParams = params.map(p => {
                if (typeof p === 'function') {
                  throw new Error('Functions cannot be used as SQL parameters');
                }
                return p ?? null;
              });
              
              // Use interpolation for execAsync
              const interpolatedQuery = interpolateQuery(sql, safeParams);
              await dbInstance.execAsync(interpolatedQuery);
              return true;
            } catch (error) {
              console.error(`Execution error: ${sql}`, error);
              throw new Error(`Database execution failed: ${error.message}`);
            }
          },
          
          // Run multiple statements in a transaction
          withTransaction: async (callback) => {
            try {
              await dbInstance.execAsync('BEGIN TRANSACTION');
              
              const txContext = {
                query: async (sql, params = []) => await dbInstance.getAllAsync(sql, params),
                execute: async (sql, params = []) => {
                  const safeParams = params.map(p => p ?? null);
                  const interpolatedQuery = interpolateQuery(sql, safeParams);
                  await dbInstance.execAsync(interpolatedQuery);
                  return true;
                }
              };
              
              const result = await callback(txContext);
              await dbInstance.execAsync('COMMIT');
              return result;
            } catch (error) {
              await dbInstance.execAsync('ROLLBACK');
              console.error('Transaction error:', error);
              throw new Error(`Transaction failed: ${error.message}`);
            }
          },
          
          // Convenience method to get a record by ID
          getById: async (table, id, idField = 'id') => {
            const results = await dbInstance.getAllAsync(
              `SELECT * FROM ${table} WHERE ${idField} = ? LIMIT 1`, 
              [id]
            );
            return results[0] || null;
          },
          
          // Close the database connection
          close: async () => {
            if (dbInstance) {
              await dbInstance.closeAsync();
              dbInstance = null;
            }
          }
        };
        
        setDb(dbHelpers);
        setLoading(false);
      } catch (err) {
        console.error('Database initialization error:', err);
        setError(err);
        setLoading(false);
      }
    };
    
    initDb();
    
    // Cleanup function
    return () => {
      if (dbInstance) {
        dbInstance.closeAsync()
          .catch(err => console.error('Error closing database:', err));
      }
    };
  }, []);

  // Simple placeholder components
  if (loading) return null;
  if (error) return null;

  return (
    <DatabaseContext.Provider value={db}>
      {children}
    </DatabaseContext.Provider>
  );
};