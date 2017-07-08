export default class Slider {
    constructor(node, updateFunction) {
        this.node = node;
        this.draggable = false;
        this.updateFunction = updateFunction;
        this.bind();
    }

    bind() {
        this.node.addEventListener('mousedown', (e) => {
            if(e.which === 1) { //left mouse button
                this.draggable = true;
            }
        });

        document.addEventListener('mousemove', (e) => {
            if(this.draggable) {
                this.updateFunction(e);
            }
        });

        document.addEventListener('mouseup', (e) => {
            if(this.draggable) {
                this.draggable = false;
                this.updateFunction(e);
            }
        });
    }
}
