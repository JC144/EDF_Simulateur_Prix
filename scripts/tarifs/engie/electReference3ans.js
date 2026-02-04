abonnements.push(
    {
        name: "Engie - Elec Référence 3 ans",
        lastUpdate: "2026-02-04",
        subscription_url: "https://particuliers.engie.fr/electricite.html",
        price_url: "https://particuliers.engie.fr/content/dam/pdf/fiches-descriptives/fiche-descriptive-elec-reference-3-ans.pdf",
        prices: [
            // tableau "Fourniture comptage simple (CS)", colonne "Abonnement", en TTC
            // + tableau "Acheminement sans différenciation temporelle - courte utilisation (CU)", colonne "Abonnement", en TTC
            { puissance: 3, abonnement: (47.88 + 99.37) / 12 },
            { puissance: 6, abonnement: (48.43 + 145.20) / 12 },
            { puissance: 9, abonnement: (50.69 + 191.03) / 12 },
            { puissance: 12, abonnement: (52.24 + 236.86) / 12 },
            { puissance: 15, abonnement: (51.05 + 282.69) / 12 },
            { puissance: 18, abonnement: (51.31 + 328.52) / 12 },
            { puissance: 24, abonnement: (57.29 + 420.18) / 12 },
            { puissance: 30, abonnement: (55.79 + 511.84) / 12 },
            { puissance: 36, abonnement: (54.85 + 603.50) / 12 }
        ].map(item => {
            // tableau "Fourniture comptage simple (CS)", colonne "Prix par kWh", en TTC
            const fourniture = 0.13474;
            // tableau "Acheminement sans différenciation temporelle - courte utilisation (CU)", colonne "Prix par kWh", en TTC
            const acheminement = 0.05808; 
            // tableau "Obligation comptage simple (CS)", colonne "Prix par kWh à la souscription", en TTC
            const obligation = item.puissance <= 6 ? 0.01447 : 0.01486;
            return {
                ...item,
                bleu: {
                        prixKwhHC: (fourniture + acheminement + obligation) * 100,
                        prixKwhHP: (fourniture + acheminement + obligation) * 100
                    }
            };
        }),
        hc: [{
            start: {hour:0, minute:0},
            end: {hour:24, minute:0}
        }],
        hasHCCustom: false,
        specialDays: [],
        getDayType: function (day) {
            let dayType = "bleu";
            return dayType;
        }
    }
);

abonnements.push(
    {
        name: "Engie - Elec Référence 3 ans HC",
        lastUpdate: "2026-02-04",
        subscription_url: "https://particuliers.engie.fr/electricite.html",
        price_url: "https://particuliers.engie.fr/content/dam/pdf/fiches-descriptives/fiche-descriptive-elec-reference-3-ans.pdf",
        prices: [
            // tableau "Fourniture comptage Heures pleines/Heures creuses (HP/HC)", colonne "Abonnement", en TTC
            // + tableau "Acheminement à 2 plages temporelles - moyenne utilisation (MUDT)", colonne "Abonnement", en TTC
            { puissance: 6, abonnement: (43.16 + 165.24) / 12 },
            { puissance: 9, abonnement: (44.53 + 221.09) / 12 },
            { puissance: 12, abonnement: (44.03 + 276.94) / 12 },
            { puissance: 15, abonnement: (40.80 + 332.79) / 12 },
            { puissance: 18, abonnement: (39.00 + 388.64) / 12 },
            { puissance: 24, abonnement: (40.88 + 500.33) / 12 },
            { puissance: 30, abonnement: (35.28 + 612.03) / 12 },
            { puissance: 36, abonnement: (30.24 + 723.73) / 12 }
        ].map(item => {
            // tableau "Fourniture comptage Heures pleines/Heures creuses (HP/HC)", colonne "Prix par kWh", en TTC
            const fournitureHC = 0.11579;
            const fournitureHP = 0.13222;
            // tableau "Acheminement à 2 plages temporelles - moyenne utilisation (MUDT)", colonne "Prix par kWh", en TTC
            const acheminementHC = 0.04200;
            const acheminementHP = 0.05928;
            // tableau "Obligation Heures pleines/Heures creuses (HP/HC)", colonne "Prix par kWh à la souscription", en TTC
            const obligation = 0.01489;
            return {
                ...item,
                bleu: { 
                    prixKwhHC: (fournitureHC + acheminementHC + obligation) * 100,
                    prixKwhHP: (fournitureHP + acheminementHP + obligation) * 100
                }
            };
        }),
        hc: [{
            start: { hour: 22, minute: 0 },
            end: { hour: 24, minute: 0 }
        },
        {
            start: { hour: 0, minute: 0 },
            end: { hour: 6, minute: 0 }
        }],
        hasHCCustom: false,
        hasSpecialDaysCustom: false,
        specialDays: [],
        getDayType: function (day) {
            let dayType = "bleu";
            return dayType;
        }
    }
);
