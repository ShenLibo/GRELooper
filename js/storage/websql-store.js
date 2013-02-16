var WebSqlStore = function(successCallback, errorCallback) {

    this.initializeDatabase = function(successCallback, errorCallback) {
        var self = this;
        this.db = window.openDatabase("GREVocabularyDB", "1.0", "GRE vocabulary DB", 200000);
        var GREVocabularyDB = this.db;
        this.db.transaction(
            function(tx) {
                self.createTable(tx);
                self.addSampleData(tx);
            },
            function(error) {
                console.log('Transaction error: ' + error);
                if (errorCallback) errorCallback();
            },
            function() {
                console.log('Transaction success');
                if (successCallback) successCallback();
            }
        )

        
    }

    this.createTable = function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS vocabulary');
        var sql = "CREATE TABLE IF NOT EXISTS vocabulary ( " +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "English VARCHAR(50), " +
            "Chinese VARCHAR(50), " +
            "list INTEGER, " +
            "hardness INTEGER )";
        tx.executeSql(sql, null,
                function() {
                    console.log('Create table success');
                },
                function(tx, error) {
                    alert('Create table error: ' + error.message);
                });
    }

    this.addSampleData = function(tx) {

        var l = vocabulary_init.length;
        var sql = "SELECT COUNT(*) AS number FROM vocabulary";
        tx.executeSql(sql,null,function(tx, result){
            if (result.rows.item(0).number == 0) {
                sql = "INSERT OR REPLACE INTO vocabulary " +
                    "(English, Chinese, list, hardness) " +
                    "VALUES (?, ?, ?, ?)";
                var e;
                for (var i = 0; i < l; i++) {
                    e = vocabulary_init[i];
                    tx.executeSql(sql, [e.English, e.Chinese, e.list, e.hardness],
                        function() {
                            console.log('INSERT success');
                        },
                        function(tx, error) {
                            alert('INSERT error: ' + error.message);
                        });
                }
            }
        })
    }

    this.findByListAndHandness = function(list, hardness, callback) {
        this.db.transaction(
            function(tx) {

                var sql = "SELECT id, English, Chinese, list, hardness " +
                    "FROM vocabulary WHERE list = ? AND hardness >= ?";

                tx.executeSql(sql, [list, hardness], function(tx, results) {
                    var words = [];
                    for (var i = 0; i < results.rows.length; i++) {
                        words[i] = results.rows.item(i);
                    };
                    callback(words);
                });
            },
            function(error) {
                alert("Transaction Error: " + error.message);
            }
        )
    }

    // this.findByName = function(searchKey, callback) {
    //     this.db.transaction(
    //         function(tx) {

    //             var sql = "SELECT e.id, e.firstName, e.lastName, e.title, count(r.id) reportCount " +
    //                 "FROM employee e LEFT JOIN employee r ON r.managerId = e.id " +
    //                 "WHERE e.firstName || ' ' || e.lastName LIKE ? " +
    //                 "GROUP BY e.id ORDER BY e.lastName, e.firstName";

    //             tx.executeSql(sql, ['%' + searchKey + '%'], function(tx, results) {
    //                 var len = results.rows.length,
    //                     employees = [],
    //                     i = 0;
    //                 for (; i < len; i = i + 1) {
    //                     employees[i] = results.rows.item(i);
    //                 }
    //                 callback(employees);
    //             });
    //         },
    //         function(error) {
    //             alert("Transaction Error: " + error.message);
    //         }
    //     );
    // }

    this.findById = function(id, callback) {
        this.db.transaction(
            function(tx) {

                var sql = "SELECT id, English, Chinese, list, hardness " +
                    "FROM vocabulary " +
                    "WHERE id = ?";

                tx.executeSql(sql, [id], function(tx, results) {
                    callback(results.rows.length === 1 ? results.rows.item(0) : null);
                });
            },
            function(error) {
                alert("Transaction Error: " + error.message);
            }
        );
    };

    this.updateHardnessById = function(id, hardness) {
        this.db.transaction(
            function(tx) {
                var sql = "UPDATE vocabulary SET hardness = ? WHERE id = ?";
                tx.executeSql(sql, [hardness, id], null);
            })
    }

    this.initializeDatabase(successCallback, errorCallback);

}
