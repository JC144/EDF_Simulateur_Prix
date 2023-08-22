var edfParser = {
    parseCSV: function (csv) {
        const result = [];

        const lines = csv.split("\n");

        for (let i = 0; i < lines.length; i++) {
            const currentline = lines[i].split(";");
            result.push(currentline);
        }
        return result;
    },
    loadData: function (rows) {
        let data = [];
        let day = {};

        for (let index = 0; index < rows.length; index++) {
            let line = rows[index];
            if (rows[index].length > 0) {
                if (rows[index][0].includes("/")) {
                    let date = rows[index][0].split("/");
                    let isoDate = date[2] + "/" + date[1] + "/" + date[0];

                    day = {};
                    data.push(day);
                    day.date = isoDate;
                    day.hours = [];
                }
                else if (rows[index][0].includes(":")) {
                    day.hours.push([rows[index][0], rows[index][1]]);
                }
            }
        }
        return data;
    }
};


