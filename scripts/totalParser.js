var totalParser = {
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
        let dates = [];
        let day = {};

        for (let index = 0; index < rows.length; index++) {
            let line = rows[index];
            if (line.length > 0) {
                // on s'assure que la colonne dont on va rechercher la date existe bien, puis si la donnée contient ce qu'on souhaite
                if (line[1] !== undefined && line[1].search(/\//) !== -1) {
                    let date = line[1].replace('"', '').split("/");
                    let tmpHoursDate = date[2].replace('"', '').split(" ");
                    let isoDate = tmpHoursDate[0] + "/" + date[1] + "/" + date[0];
                    let hour = tmpHoursDate[1].split(":");
                    let consoRegex = /(kWh)|(\s+)|(\")/ig;
                    // on remplace ce dont on a pas besoin, pour uniquement garder le nombre
                    // on transforme notre string en Number pour pouvoir additionner la conso plus tard, et le transformons en Wh au lieu du kWh
                    let conso = Number(line[2].replace(consoRegex, "")) * 1000;

                    // si date pas encore traitée
                    if(!dates.find((elm) => elm == isoDate)) {
                        console.log(isoDate);
                        day = {};
                        data.push(day);
                        day.date = isoDate;
                        day.hours = [];
                    }

                    // on regarde si l'heure a déjà été utilisée
                    if(!day.hours.find((elm) => elm[0] == hour[0])) {
                        day.hours.push([hour[0], conso]);
                    } else {
                        // on recherche pour calculer le total sur l'heure
                        let hourIndex = day.hours.findIndex((elm) => elm[0] == hour[0]);

                        // on s'assure tout de même qu'on a bien réussi à trouver le résultat, même si on est pas censé avoir un résultat négatif là-dessus
                        if(hourIndex !== -1) {
                            day.hours[hourIndex][1] += conso;
                        }
                    }

                    dates.push(isoDate);
                }
            }
        }
        return data;
    }
};
