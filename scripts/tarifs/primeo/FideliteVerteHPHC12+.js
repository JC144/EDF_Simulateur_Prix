abonnements.push({
    name: "Primeo - Fidelite verte HP/HC - Anciennete + de 12 mois",
    lastUpdate: "2024-01-30",
    prices: [
		{
            puissance: 3,
            abonnement: 10.41,
            bleu: {
                prixKwhHP: 17.10,
                prixKwhHC: 13.73
            }
        },
        {
            puissance: 6,
            abonnement: 13.73,
            bleu: {
                prixKwhHP: 17.10,
                prixKwhHC: 13.73
            }
        },
        {
            puissance: 9,
            abonnement: 17.27,
            bleu: {
                prixKwhHP: 17.10,
                prixKwhHC: 13.73
            }
        },
        {
            puissance: 12,
            abonnement: 20.86,
            bleu: {
                prixKwhHP: 17.10,
                prixKwhHC: 13.73
            }
        },
        {
            puissance: 15,
            abonnement: 24.20,
            bleu: {
                prixKwhHP: 17.10,
                prixKwhHC: 13.73
            }
        },
        {
            puissance: 18,
            abonnement: 27.39,
            bleu: {
                prixKwhHP: 17.10,
                prixKwhHC: 13.73
            }
        },
        {
            puissance: 24,
            abonnement: 34.68,
            bleu: {
                prixKwhHP: 17.10,
                prixKwhHC: 13.73
            }
        },
        {
            puissance: 30,
            abonnement: 41.99,
            bleu: {
                prixKwhHP: 17.10,
                prixKwhHC: 13.73
            }
        },
        {
            puissance: 36,
            abonnement: 48.39,
            bleu: {
                prixKwhHP: 17.10,
                prixKwhHC: 13.73
            }
        }],
    hc: [],
    hasHCCustom: true,
    hasSpecialDaysCustom: false,
    specialDays: [],
    getDayType: function (day) {
        let dayType = "bleu";
        return dayType;
    }
});