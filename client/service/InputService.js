class InputService {
    /**
     * 縮減文字欄可顯示文字
     * @static
     * @param {Phaser-txt} txt
     * @param {string} input
     * @param {number} maxWidth
     * @returns string
     * @memberof InputService
     */
    static onReduceTxtInput(txt, input, maxWidth) {
        let txtWidth = txt.setText(input).width;
        if (txtWidth >= maxWidth) {
            for (let i = input.length - 2; i >= 0; i--) {
                let reduceInput = input.substring(0, i) + "...";
                txtWidth = txt.setText(reduceInput).width;
                if (txtWidth < maxWidth) {
                    input = reduceInput;
                    break;
                }
            }
        }

        return input;
    }

    /**
     * 分行文字欄顯示文字
     * @static
     * @param {Phaser-txt} txt
     * @param {string} input
     * @param {number} maxWidth
     * @returns string
     * @memberof InputService
     */
    static onBreakTxtInput(txt, input, maxWidth) {
        let word = '';
        let inputs = [];
        for (let i = 0; i < input.length; i++) {
            let addWord = input.charAt(i);
            let combineWord = word + addWord;
            let width = txt.setText(combineWord).width;
            if (width >= maxWidth) {
                inputs.push(word);
                word = addWord;
            } else {
                word = combineWord;
            }
        }

        if (word) {
            inputs.push(word);
        }

        return inputs;
    }
}