var enedisParser = {
    parseCSV: function (csv) {
        const result = [];

        const lines = csv.split("\n");

        //Les données débutent à partir de la 3ème ligne
        for (let i = 3; i < lines.length; i++) {
            const currentline = lines[i].split(";");
            result.push(currentline);
        }
        return result;
    },
    loadData: function (rows) {
        let data = [];

        rows.reverse().forEach(row => {
            if (row.length > 1) {
                const [date, time] = row[0].replace(/\+0.:00/g, "").split("T");
                const value = row[1];

                let formattedDate = date.replace(/-/g, "/");

                let [hours, minutes, seconds] = time.split(':');

                if (hours == "00" && minutes == "00") {
                    hours = "24";
                    let isoDate = new Date(date);
                    isoDate.setDate(isoDate.getDate() - 1);
                    formattedDate = isoDate.toISOString().split("T")[0].replace(/-/g, "/");
                }
                const formattedTime = `${hours}:${minutes}:00`;

                const day = data.find(d => d.date === formattedDate);
                if (day) {
                    //On vérifie si on n'a pas de doublons. Cela ne s'est pas produit chez ENEDIS.
                    if (!day.hours.some(hour => hour[0] == formattedTime)) {
                        day.hours.push([formattedTime, value]);
                    }
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


