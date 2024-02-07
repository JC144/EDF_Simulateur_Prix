abonnements.push(
    {
        name: "Engie - Elec Tranquillité 1 an",
        lastUpdate: "2024-02-01",
        subscription_url: "https://particuliers.engie.fr/electricite.html",
        price_url: "https://particuliers.engie.fr/content/dam/pdf/fiches-descriptives/fiche-descriptive-elec-tranquillite.pdf",
        prices: [{
            puissance: 3,
            abonnement: 9.69,
            bleu: {
                prixKwhHC: 25.164
            }
        },
        {
            puissance: 6,
            abonnement: 12.71,
            bleu: {
                prixKwhHC: 25.164
            }
        },
        {
            puissance: 9,
            abonnement: 15.95,
            bleu: {
                prixKwhHC: 25.164
            }
        },
        {
            puissance: 12,
            abonnement: 19.26,
            bleu: {
                prixKwhHC: 25.164
            }
        },
        {
            puissance: 15,
            abonnement: 22.35,
            bleu: {
                prixKwhHC: 25.164
            }
        },
        {
            puissance: 18,
            abonnement: 25.41,
            bleu: {
                prixKwhHC: 25.164
            }
        },
        {
            puissance: 24,
            abonnement: 32.20,
            bleu: {
                prixKwhHC: 25.164
            }
        },
        {
            puissance: 30,
            abonnement: 38.00,
            bleu: {
                prixKwhHC: 25.164
            }
        },
        {
            puissance: 36,
            abonnement: 44.82,
            bleu: {
                prixKwhHC: 25.164
            }
        }],
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

