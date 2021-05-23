var arr;

class itemArray {
    constructor() {
        this.data = [];
        if (!this.data.length) {
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
        this.element.innerHTML = this.element.innerHTML.replace("rst-curr", "rst-curr" + id);
        this.element.innerHTML = this.element.innerHTML.replace("rst-min", "rst-min" + id);
        this.element.innerHTML = this.element.innerHTML.replace("rst-exp", "rst-exp" + id);
        this.element.innerHTML = this.element.innerHTML.replace("rst-max", "rst-max" + id);

        for (let i = 1; i < 5; ++i)
            this.element.innerHTML = this.element.innerHTML.replace("rolls" + i, "rolls_" + id + "_" + i);

        if (id)
            for (let i = 1; i < 7; ++i)
                this.element.querySelector("#tss" + i).value = arr.data[id - 1].element.querySelector("#tss" + i).value;

        document.getElementById("grid-container").appendChild(this.element);
    }

    rateImpl() {
        var result = evaluate(this.element, this.id);
        var el = document.getElementById("rst-curr" + this.id);
        el.style.display='inline';
        el.innerHTML = result[0].toFixed(2);
        el = document.getElementById("rst-min" + this.id);
        el.style.display='inline';
        el.innerHTML = result[1].toFixed(2);
        el = document.getElementById("rst-exp" + this.id);
        el.style.display='inline';
        el.innerHTML = result[2].toFixed(2);
        el = document.getElementById("rst-max" + this.id);
        el.style.display='inline';
        el.innerHTML = result[3].toFixed(2);
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