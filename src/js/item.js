var arr;

class itemArray {
    constructor() {
        this.data = [];
        if (!this.data.length) {
            this.addItem();
            this.addItem();
        }
    }

    rateRedir(id) {
        this.data[id].rateImpl();
    }

    addItem() {
        this.data.push(new item(this.data.length));
    }
}

class item {
    constructor(id) {
        this.id = id;
        this.createHTML(id);
    }

    createHTML(id) {
        // read from template block
        this.element = document.createElement("div");
        this.element.id = "block" + id;
        this.element.className = "datablock";
        this.element.innerHTML = document.getElementById("datablockTemplate").innerHTML;
        this.element.innerHTML = this.element.innerHTML.replace("rate(-1)", "rate(" + id + ")");
        this.element.innerHTML = this.element.innerHTML.replace("rst", "rst" + id);
        document.getElementById("grid-container").appendChild(this.element);
    }

    rateImpl() {
        var result = document.getElementById("rst" + this.id);
        result.style.display='block';
        result.innerHTML = evaluate(this.element);
    }
}

function init() {
    arr = new itemArray();
}

function rate(id) {
    arr.rateRedir(id);
}

function add() {
    arr.addItem();
}