var homeAssistantParser = {
    parseCSV: function (csv) {
        const result = [];

        const lines = csv.split("\n");

        //Les données débutent à partir de la 3ème ligne
        for (let i = 3; i < lines.length; i++) {
            const currentline = lines[i].split(",");
            result.push(currentline);
        }
        return result;
    },
    loadData: function (rows) {
        let data = [];
        let refValue = null;

        rows.sort((a, b) => a[1] - b[1]).forEach(row => {
            if (row.length > 1) {
                let [name, value, date] = row;
                if (value !== "unavailable") {
                    value = parseFloat(value) * 1000; 
                
                    // ignore first row to get reference
                    if (refValue === null) {
                        refValue = value;
                    }
                    else {
                        let isoDate = new Date(date);
                        let formattedDate = isoDate.toISOString().split("T")[0].replace(/-/g, "/");
                        let [hours, minutes] = [ ("0" + isoDate.getHours()).slice(-2), ("0" + isoDate.getMinutes()).slice(-2)];
                        const formattedTime = `${hours}:00:00`;
        
                        const day = data.find(d => d.date === formattedDate);
                        if (day) {
                            const hour = day.hours.find(d => d[0] === formattedTime);
                            if (hour) {
                                hour[1] = hour[1] + (value - refValue);
                            }
                            else
                            {
                                day.hours.push([formattedTime, value - refValue]);
                            }
                        } else {
                            let newDay = {};
                            newDay.date = formattedDate;
                            newDay.hours = [];
                            newDay.hours.push([formattedTime, value - refValue]);
                            data.push(newDay);
                        }
        
                        refValue = value;
                    }   
                }
            }
        });

        return data;
    }
};


