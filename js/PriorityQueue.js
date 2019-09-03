class PriorityQueue {
    constructor() {
        this.elements = [];
        this.priorities = [];
    }

    isEmpty() {
        return this.elements.length == 0;
    }

    insertWithPriority(value, priority) {
        this.elements.push(value);
        this.priorities.push(priority);
    }

    pullHighestPriority() {
        let highest = this.peakHighestPriority(),
            priorityElement = this.elements[highest];
        
        this.deleteElement(highest);

        return priorityElement;
    }

    peakHighestPriority() {
        let highest = 0;
        for (let i = 0; i < this.elements.length; i++) {
            if (this.priorities[i] > priorities[highest]) {
                highest = i;
            }
        }

        return highest;
    }

    deleteElement(index) {
        this.elements.splice(index, 1);
        this.values.splice(index, 1);
    }
}