class StatusBarCoin extends StatusBar {
    collectedCoins = 0;
    totalCoins = 0;

    /** Creates the coin progress bar. */
    constructor() {
        super([
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
        ], 20, 120, 0);
    }

    /**
     * Updates the collected coin progress.
     * @param {number} collected - Collected coins.
     * @param {number} total - Total coins.
     * @returns {void}
     */
    setProgress(collected, total) {
        this.collectedCoins = collected;
        this.totalCoins = total;
        this.setPercentage(total > 0 ? collected / total * 100 : 0);
    }

    /**
     * Shows 100 percent only after the final coin.
     * @returns {number} Image index.
     */
    resolveImageIndex() {
        if (this.percentage <= 0) return 0;
        if (this.collectedCoins >= this.totalCoins && this.totalCoins > 0) return 5;
        return Math.min(4, Math.ceil(this.percentage / 20));
    }
}
