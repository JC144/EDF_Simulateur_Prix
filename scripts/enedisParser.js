var enedisParser = {
    parseCSV: function (csv) {
        const result = [];

        const lines = csv.split("\n");

        //We start at the third line
        for (let i = 3; i < lines.length; i++) {
            if (lines.length > 0) {
                const currentline = lines[i].split(";");
                result.push(currentline);
            }
        }
        return result;
    },
    loadData: function (rows) {
        let data = [];

        rows.reverse().forEach(row => {
            if (row.length > 1) {
                const date = row[0];
                const value = row[1];

                const [isoDate, time] = date.split('T');
                const [hours, minutes, seconds] = time.slice(0, -6).split(':');

                const formattedDate = isoDate.replace(/-/g, '/');
                const formattedTime = `${hours}:${minutes}:${seconds}`;

                const day = data.find(d => d.date === formattedDate);
                if (day) {
                    day.hours.push([formattedTime, value]);
                } else {
                    let newDay = {};
                    newDay.date = formattedDate;
                    newDay.hours = [];
                    newDay.hours.push([formattedTime, value]);
                    data.push(newDay);
                }
            }
        });

        return data;
    }
};


