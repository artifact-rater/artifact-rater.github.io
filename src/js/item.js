var arr;

function init() {
    arr = new itemArray();
}

class itemArray {
    constructor() {
        this.data = [];
        if (!this.data.length) {
            this.data.push(new item(this.data.length));
            this.data.push(new item(this.data.length));
        }
    }

    rateRedir(id) {
        this.data[id].rateImpl();
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

function rate(id) {
    arr.rateRedir(id);
}