abonnements.push(
{
        name: "Enercoop - Flexibilité - nuit & week-end",
        offer_type: "Marché",
        lastUpdate: "2026-02-16",
        isCommunity: true,
        subscription_url: "https://souscription.enercoop.fr/",
        price_url: "https://www.faq.enercoop.fr/hc/fr/articles/360024967152-Annexes-tarifaires",
		prices: [
		        { puissance: 1, abonnement: 6.19 },
		        { puissance: 2, abonnement: 7.92 },
		        { puissance: 3, abonnement: 9.65 },
		        { puissance: 4, abonnement: 11.64 },
		        { puissance: 5, abonnement: 13.43 },
		        { puissance: 6, abonnement: 15.23 },
		        { puissance: 7, abonnement: 17.03 },
		        { puissance: 8, abonnement: 18.83 },
		        { puissance: 9, abonnement: 20.63 },
		        { puissance: 10, abonnement: 22.42 },
		        { puissance: 11, abonnement: 24.22 },
		        { puissance: 12, abonnement: 26.02 },
		        { puissance: 13, abonnement: 27.75 },
		        { puissance: 14, abonnement: 29.54 },
		        { puissance: 15, abonnement: 31.33 },
		        { puissance: 16, abonnement: 33.12 },
		        { puissance: 17, abonnement: 34.91 },
		        { puissance: 18, abonnement: 36.7 },
		        { puissance: 19, abonnement: 38.49 },
		        { puissance: 20, abonnement: 40.28 },
		        { puissance: 21, abonnement: 42.08 },
		        { puissance: 22, abonnement: 43.87 },
		        { puissance: 23, abonnement: 45.66 },
		        { puissance: 24, abonnement: 48.24 },
		        { puissance: 25, abonnement: 50.06 },
		        { puissance: 26, abonnement: 51.89 },
		        { puissance: 27, abonnement: 53.71 },
		        { puissance: 28, abonnement: 55.54 },
		        { puissance: 29, abonnement: 57.36 },
		        { puissance: 30, abonnement: 59.19 },
		        { puissance: 31, abonnement: 61.01 },
		        { puissance: 32, abonnement: 62.83 },
		        { puissance: 33, abonnement: 64.66 },
		        { puissance: 34, abonnement: 66.48 },
		        { puissance: 35, abonnement: 68.31 },
		        { puissance: 36, abonnement: 70.13 }
		].map(item => ({
		    ...item,
		    bleu: {
		        prixKwhHP: 29.286, prixKwhHC: 16.357
		    },
		    weekend: {
		        prixKwhHP: 16.357, prixKwhHC: 16.357
		    }
		})),
		hc: [{
		    start: { hour: 23, minute: 0 },
		    end: { hour: 24, minute: 0 }
		},
		{
		    start: { hour: 0, minute: 0 },
		    end: { hour: 5, minute: 59 }
		}],
		hasHCCustom: true,
		hasSpecialDaysCustom: false,
		specialDays: [0, 6],
		getDayType: function (day) {
		    let dayType = "bleu";

		    const isoDate = new Date(day.date);
		    const dayOfWeek = isoDate.getDay();

		    if (this.specialDays.includes(dayOfWeek)) {
		        dayType = "weekend";
		    }

		    return dayType;
		}
	});
