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
            if (rows[index].length > 0) {
                if (rows[index][0].includes("/")) {
                    let date = rows[index][0].split("/");
                    let isoDate = date[2] + "/" + date[1] + "/" + date[0];

                    day = {};
                    data.push(day);
                    day.date = isoDate;
                    day.hours = [];
                }
                //On vérifie si on a bien une donnée
                else if (rows[index][0].includes(":")) {
                    let minutes = rows[index][0].split(":")[1];
                    //Vérification si les minutes sont bien 00 ou 30
                    if (minutes == "00" || minutes == "30") {
                        //Vérification si ce n'est pas un doublon
                        if (!day.hours.some(hour => hour[0] == rows[index][0])) {
                            let hours = rows[index][0].split(":")[0];
                            if (hours == "00" && minutes == "00") {
                                hours = "24";
                            }
                            day.hours.push([`${hours}:${minutes}:00`, rows[index][1]]);
                        }
                    }
                }
            }
        }
        return data;
    }
};


