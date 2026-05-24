package com.clofit.dao;

import java.util.logging.Logger;

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  DESIGN PATTERN: SINGLETON                                   ║
 * ║  Ensures only ONE database connection exists in the JVM.     ║
 * ║  Thread-safe via double-checked locking.                     ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 *  In production replace the mock with a real JDBC datasource:
 *    e.g. HikariCP + PostgreSQL
 */
public class DatabaseConnection {

    private static final Logger LOG = Logger.getLogger(DatabaseConnection.class.getName());

    // volatile guarantees visibility across threads
    private static volatile DatabaseConnection instance;

    private final String url;
    private boolean connected;

    /* Private constructor prevents external instantiation */
    private DatabaseConnection() {
        this.url = "jdbc:postgresql://localhost:5432/clofit_db";
        connect();
    }

    /**
     * Returns the single shared instance (double-checked locking).
     */
    public static DatabaseConnection getInstance() {
        if (instance == null) {
            synchronized (DatabaseConnection.class) {
                if (instance == null) {
                    instance = new DatabaseConnection();
                    LOG.info("[Singleton] DatabaseConnection created.");
                }
            }
        }
        return instance;
    }

    private void connect() {
        // Simulate connection — replace with real JDBC logic
        this.connected = true;
        LOG.info("[DB] Connected to: " + url);
    }

    public boolean isConnected() { return connected; }
    public String  getUrl()      { return url; }

    /**
     * Execute a simulated query — returns a generic result string.
     * Replace with PreparedStatement in a real implementation.
     */
    public String query(String sql) {
        if (!connected) throw new IllegalStateException("Not connected to database.");
        LOG.fine("[DB] Executing: " + sql);
        return "ResultSet[mock]"; // Real impl: return ResultSet
    }

    @Override
    public String toString() {
        return "DatabaseConnection{url='" + url + "', connected=" + connected + "}";
    }
}
