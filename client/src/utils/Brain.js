function sigmoid(z) {
    return 1 / (1 + Math.exp(-z));
}

class Brain {
    constructor(inputCount, hiddenCount, outputCount){
        this.weightsIH = Array.from({ length: hiddenCount }, () => {
            return Array.from({ length: inputCount }, () => {
                return Math.random() * 2 - 1;
            });
        });

        this.biasH = Array.from({ length: hiddenCount }, () => Math.random() * 2 - 1);

        this.weightsHO = Array.from({ length: outputCount }, () => {
            return Array.from({ length: hiddenCount }, () => {
                return Math.random() * 2 - 1;
            });
        });

        this.biasO = Array.from({ length: outputCount }, () => Math.random() * 2 - 1);
    }

    predict(inputs) {
        const hidden = this.weightsIH.map((wRow, i) => {
            let sum = wRow.reduce((acc, w, j) => acc + w * inputs[j], 0) + this.biasH[i];
            return sigmoid(sum);
        });

        const outputs = this.weightsHO.map((wRow, i) => {
            let sum = wRow.reduce((acc, w, j) => acc + w * hidden[j], 0) + this.biasO[i];
            return sigmoid(sum);
        });

        return outputs;
    }

    copy() {
        const clone = new Brain(this.weightsIH[0].length, this.weightsIH.length, this.weightsHO.length);
        clone.weightsIH = this.weightsIH.map(row => [...row]);
        clone.biasH = [...this.biasH];
        clone.weightsHO = this.weightsHO.map(row => [...row]);
        clone.biasO = [...this.biasO];
        return clone;
    }

    mutate(rate) {
        const mutateValue = (value) => {
            if(Math.random() < rate){
                return value + (Math.random() * 0.4 - 0.2);
            }

            return value;
        }

        this.weightsIH = this.weightsIH.map(row => row.map(mutateValue));
        this.biasH = this.biasH.map(mutateValue);
        this.weightsHO = this.weightsHO.map(row => row.map(mutateValue));
        this.biasO = this.biasO.map(mutateValue);
    }
}

export default Brain;