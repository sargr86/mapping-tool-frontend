import {ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';


interface Circle {
    radius: number;
    color?: string;
    x?: number;
    y?: number;
}

interface Rectangular {
    height: number;
    width: number;
    color?: string;
    x?: number;
    y?: number;
}

interface Line {
    borderSize: number;
    borderColor?: string;
    x0?: number;
    y0?: number;
    x1?: number;
    y1?: number;
}

@Component({
    selector: 'app-mapping-tool',
    templateUrl: './mapping-tool.component.html',
    styleUrls: ['./mapping-tool.component.scss']
})
export class MappingToolComponent implements OnInit {
    @ViewChild('svgContainer') d1: ElementRef;
    /**
     * Globally used variables within the component.
     */
    private circles: Circle[] = [];
    private lines: Line[] = [];
    private lineCoordinates = {borderSize: 0, borderColor: 'silver'};
    lineDot = 0;
    circleX = 20;
    circleY = 20;
    htmltoAdd = '';

    lineX1;
    lineX2;
    lineY1;
    lineY2;

    dragOffset;

    svgEl; // Svg element


    addNode = true;
    addLink = false;
    moveNode = false;
    nodeMoving = false;

    elClicked = false; // Svg Element clicked

    sidebarLinks = ['addNode', 'addLink', 'moveNode'];


    public rectangulars: Rectangular[] = [];

    /**
     * Creates circle component object instance.
     */
    constructor(
        private cdRef: ChangeDetectorRef,
        private renderer: Renderer2
    ) {
    }

    ngOnInit(): void {

    }

    /**
     * Adds new circle element.
     */
    addNew() {

        this.svgEl = document.getElementsByTagName('svg')[0];

        this.circleX += 20;
        this.circleY += 30;

        this.circles.push({
            radius: 20,
            color: 'red',
            x: this.circleX,
            y: this.circleY
        });

        this.rectangulars.push({
            height: 398,
            width: 398,
            color: 'rgba(125, 125, 32, 0.5)',
            x: 50,
            y: 50
        });
    }


    /**
     * Toggles sidebar links status between active/inactive
     * @param link
     */
    toggleSidebarLinks(link) {
        const self = this;

        // Toggling the current link status
        this[link] = !this[link];

        // Changing the rest links status to inactive
        this.sidebarLinks.filter(l => l !== link).map(l => {
            self[l] = false;
        });
    }


    circleClicked(e) {

        const moving = this.svgEl.getAttribute('moving')
        this.elClicked = true;

        // Adding move node drag/drop functionality
        if (this.svgEl && this.moveNode) {


            this.svgEl.addEventListener('mousedown', this.startDrag.bind(this));
            this.svgEl.addEventListener('mousemove', this.drag.bind(this));
            this.svgEl.addEventListener('mouseup', this.endDrag.bind(this));
            this.svgEl.addEventListener('mouseleave', this.endDrag.bind(this));
        }

        if (this.addLink) {


            // First click for line start
            if (this.lineDot === 0) {
                this.lineX1 = e.offsetX;
                this.lineY1 = e.offsetY;
                this.lineCoordinates['x' + this.lineDot] = this.lineX1;
                this.lineCoordinates['y' + this.lineDot] = this.lineY1;
                ++this.lineDot;

                // Next click for line end
            } else {
                this.lineX2 = e.offsetX;
                this.lineY2 = e.offsetY;
                this.lineCoordinates['x' + this.lineDot] = this.lineX1;
                this.lineCoordinates['y' + this.lineDot] = this.lineY2;
                this.lineCoordinates.borderSize = 2;
                this.lineCoordinates.borderColor = 'silver';
                this.lineDot = 0;
                this.lines.push(this.lineCoordinates);
                this.lineCoordinates = {borderSize: 0, borderColor: 'silver'};

                const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path'); // Create a path in SVG's namespace
                const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker'); // Create a path in SVG's namespace
                pathElement.setAttribute('d', 'M' + this.lineX1 + ',' + this.lineY1 + 'L' + this.lineX2 + ',' + this.lineY2); // Set path's data
                pathElement.style.stroke = 'silver'; // Set stroke colour
                pathElement.style.strokeWidth = '2px'; // Set stroke width
                marker.setAttribute('id', 'arrow');
                marker.setAttribute('refX', '4');
                marker.setAttribute('refY', '6.5');
                // marker.setAttribute('markerUnits', 'strokeWidth');
                marker.setAttribute('markerWidth', '10');
                marker.setAttribute('markerHeight', '12');
                marker.setAttribute('orient', 'auto');
                // svg.appendChild(marker);
                const trianglePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                trianglePath.setAttribute('d', 'M2,4 L2,4 L6,6 L2,9'); // Set path's data
                // trianglePath.style.stroke = 'silver'; // Set stroke colour
                trianglePath.style.strokeWidth = '0.25px'; // Set stroke width
                trianglePath.style.fill = 'silver';
                pathElement.style.markerEnd = 'url(#arrow)';
                this.svgEl.appendChild(defs);
                defs.appendChild(marker);
                marker.appendChild(trianglePath);
                this.svgEl.appendChild(pathElement);
                this.lineX1 = null;
                this.lineY1 = null;
                this.lineX2 = null;
                this.lineY2 = null;
            }
        }
    }


    /**
     * Retrieves the maximum height of all elements.
     * @returns Height of the container.
     */
    getHeight(): number {
        return Math.max.apply(Math, this.circles.map(el => el.radius * 2 + el.y)) + 20;
    }

    /**
     * Removes specific circle element.
     * @param index - Index of circle, which needs to be removed.
     */
    removeRow(index: number) {
        this.circles.splice(index, 1);
    }


    /**
     * Marks the drag starting event
     * @param e
     */
    startDrag(e) {
        this.nodeMoving = true;

        // const CTM = this.svgEl.getScreenCTM();
        // this.dragOffset = {
        //     x: (e.clientX - CTM.e) / CTM.a,
        //     y: (e.clientY - CTM.f) / CTM.d
        // };
    }

    drag(e) {
        if (this.nodeMoving && this.moveNode) {
            e.preventDefault();

            // var dragX = e.clientX;
            // var dragY = e.clientY;

            const coordinates = this.getMousePosition(e);


            if (e.target.instance && e.target.instance.type !== 'svg') {

                e.target.setAttributeNS(null, 'cx', coordinates.x);
                e.target.setAttributeNS(null, 'cy', coordinates.y);

            }
        }


    }

    /**
     * Gets current mouse position
     * @param evt event
     */
    getMousePosition(evt) {
        const svg = document.getElementsByTagName('svg')[0];
        const CTM = svg.getScreenCTM();
        return {
            x: (evt.clientX - CTM.e) / CTM.a,
            y: (evt.clientY - CTM.f) / CTM.d
        };
    }

    /**
     * Dragging stopped event
     */
    endDrag(): void {
        this.nodeMoving = false;
        this.elClicked = false;
    }
}
