abonnements.push(
    {
        name: "OHM Energie - Offre Hyper Eco",
        offer_type: "Marché",
        lastUpdate: "2024-07-01",
        subscription_url: "https://ohm-energie.com/offre/electricite",
        price_url: "https://ohm-energie.com/grilles/elec/2024/06/HYPER-ECO-FIXE.pdf",
        prices: [
    { puissance: 3, abonnement: 9.63 },
    { puissance: 6, abonnement: 12.60 },
    { puissance: 9, abonnement: 15.79 },
    { puissance: 12, abonnement: 19.04 },
    { puissance: 15, abonnement: 22.07 },
    { puissance: 18, abonnement: 25.08 },
    { puissance: 24, abonnement: 31.76 },
    { puissance: 30, abonnement: 37.44 },
    { puissance: 36, abonnement: 44.15 },
].map(item => ({
    ...item,
    bleu: { prixKwhHC: 20.64 }
})),

        hc: [{
            start: {hour: 0, minute: 0},
            end: {hour: 24, minute: 0}
        }],
        hasHCCustom: false,
        specialDays: [],
        getDayType: function (day) {
            let dayType = "bleu";
            return dayType;
        }
    }
);

