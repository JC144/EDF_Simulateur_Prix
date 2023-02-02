var parser = {
    parseCSV: function (csv) {
        const result = [];

        const lines = csv.split("\n");

        for (let i = 0; i < lines.length; i++) {
            const currentline = lines[i].split(";");
            result.push(currentline);
        }
        return result;
    },
    loadData: function (csv) {
        let data = [];
        let day = {};

        for (let index = 0; index < csv.length; index++) {
            let line = csv[index];
            if (csv[index].length > 0) {
                if (csv[index][0].includes("/")) {
                    day = {};
                    data.push(day);
                    day.date = csv[index][0];
                    day.hours = [];
                }
                else if (csv[index][0].includes(":")) {
                    day.hours.push([csv[index][0], csv[index][1]]);
                }
            }
        }
        return data;
    }
};


