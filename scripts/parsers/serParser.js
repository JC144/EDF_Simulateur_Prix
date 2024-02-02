// Strasbourg Electricité Réseaux
var serParser = {
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
        let dates = [];
        let day = {};

        for (let index = 0; index < rows.length; index++) {
            let line = rows[index];
            if (line.length > 0) {
                // on s'assure que la colonne dont on va rechercher la date existe bien, puis si la donnée contient ce qu'on souhaite
                if (line[0] !== undefined && line[0].search(/\//) !== -1) {
                    let date = line[0].replace('"', '').split("/");
                    let isoDate = date[2] + "/" + date[1] + "/" + date[0];
                    const [hours, minutes] = line[1].split(':');
                    // on remplace les caratères bizarres 65533 (question mark).
                    let conso = Number(line[4].replace('"', '').replace(String.fromCharCode(65533), ''));

                    // si date pas encore traitée
                    if (!dates.find((elm) => elm == isoDate)) {
                        dates.push(isoDate);

                        day = {};
                        data.push(day);
                        day.date = isoDate;
                        day.hours = [];
                    }

                    day.hours.push([`${hours}:${minutes}:00`, conso]);
                }
            }
        }
        return data;
    }
};
