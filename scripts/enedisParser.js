var enedisParser = {
    parseCSV: function (csv) {
        const result = [];

        const lines = csv.split("\n");

        //Les données débutent à partir de la 3ème ligne
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
                const date = new Date(row[0].replace("+01:00", "+00:00"));
                const value = row[1];
                // Si la valeur est vide, on ne l'ajoute pas
                if (value === "") {
                    return;
                }

                //la date dans le CSV est la fin de la tranche 
                //(Exemple : 06:00:00 correspond à 5h30 > 6h00)
                //(Exemple2 : le 2024/01/01 00:00:00 Correspond à la période de consommation du 2023/12/31 23h30m00 au 2023/12/31 23h59m59)
                date.setMinutes(date.getMinutes() - 30);

                const [isoDate, time] = date.toISOString().split('T');
                const [hours, minutes, seconds] = time.slice(0, -6).split(':');

                const formattedDate = isoDate.replace(/-/g, '/');
                const formattedTime = `${hours}:${minutes}:${seconds}`;

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


