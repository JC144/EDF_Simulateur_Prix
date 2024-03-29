var viewManager = {
    views: [],
    currentView: 0,
    init: function () {
        const presentationView = document.getElementById("presentationView");
        const importView = document.getElementById("importView");
        const pricesResultView = document.getElementById("pricesResultView");
        this.views["presentation"] = presentationView;
        this.views["import"] = importView;
        this.views["prices"] = pricesResultView;

        this.setAllViewsToNoneExceptFirst();
    },
    setAllViewsToNoneExceptFirst: function () {
        Object.values(this.views)[0].style.display = "block";
        for (let i = 1; i < Object.values(this.views).length; i++) {
            Object.values(this.views)[i].style.display = "none";
        }
    },
    displayNextView: function () {
        if (this.currentView + 1 < Object.values(this.views).length) {
            Object.values(this.views)[this.currentView].style.display = "none";
            this.currentView++;
            Object.values(this.views)[this.currentView].style.display = "block";
        }
    },
    displayPreviousView: function () {
        if (this.currentView - 1 >= 0) {
            Object.values(this.views)[this.currentView].style.display = "none";
            this.currentView--;
            Object.values(this.views)[this.currentView].style.display = "block";
        }
    }
}

