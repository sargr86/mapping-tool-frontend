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
    private arrows = [];
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
    deleteNode = false;
    deleteLink = false;

    elClicked = false; // Svg Element clicked

    sidebarLinks = ['addNode', 'addLink', 'moveNode', 'deleteNode', 'deleteLink'];


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
     * Adds a new circle element.
     */
    addNew() {

        this.svgEl = document.getElementsByTagName('svg')[0];

        // Adding move node drag/drop functionality
        if (this.svgEl) {

            this.svgEl.addEventListener('mousedown', this.startDrag.bind(this));
            this.svgEl.addEventListener('mousemove', this.drag.bind(this));
            this.svgEl.addEventListener('mouseup', this.endDrag.bind(this));
            this.svgEl.addEventListener('mouseleave', this.endDrag.bind(this));
        }

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
     * @param link sidebar link name
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

    /**
     * Svg element click handler
     * @param e mouse click event
     * @param index element index in the elements array
     */
    elClick(e, index) {

        // Marking the element click
        if (this.moveNode) {
            this.elClicked = true;
            // Removing current clicked node
        } else if (this.deleteNode) {
            this.removeNode(index);
            // Removing current clicked link
        } else if (this.deleteLink) {
            this.removeLink(index);
        }

        // Adds the link
        if (this.addLink) {

            // First click for line start
            if (this.lineDot === 0) {
                this.lineX1 = e.offsetX;
                this.lineY1 = e.offsetY;
                ++this.lineDot;

                // Next click for line end
            } else {
                this.lineX2 = e.offsetX;
                this.lineY2 = e.offsetY;
                this.lineDot = 0;


                // Create a marker in SVG's namespace
                const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
                const markerOptions = {
                    id: 'arrow',
                    refX: 4,
                    refY: 6.5,
                    markerWidth: 10,
                    markerHeight: 12,
                    orient: 'auto'
                };
                Object.keys(markerOptions).forEach((key) => {
                    marker.setAttribute(key, markerOptions[key].toString());
                });

                // Creates a triangle of the arrow
                const trianglePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                // trianglePath.setAttribute('d', 'M2,4 L2,4 L6,6 L2,9'); // Set path's data
                trianglePath.setAttribute('d', 'M2,4 L2,2 L6,6 L2,11'); // Set path's data
                Object.assign(trianglePath.style, {fill: 'silver', strokeWidth: '0.25px'});

                // Creating a path in SVG's namespace, setting its data, stroke colour & width
                const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                pathElement.setAttribute('d', `M ${this.lineX1},${this.lineY1},L${this.lineX2},${this.lineY2}`);
                Object.assign(pathElement.style, {
                    stroke: 'silver',
                    strokeWidth: '2px',
                    markerEnd: 'url(#arrow)'
                });
                pathElement.setAttribute('id', 'arrow' + index)
                pathElement.addEventListener('click', this.removeLink.bind(this, index));
                this.arrows.push(index)

                // Creating svg xml
                this.svgEl.appendChild(defs);
                defs.appendChild(marker);
                marker.appendChild(trianglePath);
                this.svgEl.appendChild(pathElement);

                // Resetting line/path coordinates
                this.lineX1 = null;
                this.lineY1 = null;
                this.lineX2 = null;
                this.lineY2 = null;
            }
        }
    }


    /**
     * Removes specific circle element.
     * @param index - Index of circle, which needs to be removed.
     */
    removeNode(index: number): void {
        this.circles.splice(index, 1);
    }

    /**
     * Removes the selected link
     * @param index link index
     */
    removeLink(index: number): void {
        const link = document.getElementById('arrow' + index);
        link.remove();
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
