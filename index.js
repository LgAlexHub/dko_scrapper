const dkoParser = require('./modules/parser');
const helper = require('./modules/helper');

/**
 * Async main
 */
(async () => {
    let exportPath = process.argv[2] ?? `${helper.rootPath()}\\export`;
    let scrappedData = await dkoParser.parse();
    for (const [modeName, modeLeaderboard] of Object.entries(scrappedData)){
        helper.writeCSV(`${exportPath}\\${helper.todayDateToString()}_${modeName}_export.csv`, [
            { id: "name", title: "Username" },
            { id: "1st_main", title: "1st main" },
            { id: "2nd_main", title: "2nd main" },
            { id: "3rd_main", title: "3rd main" },
        ], scrappedData[modeName]);
    }
})();
