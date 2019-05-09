import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-add-nodes-form',
    templateUrl: './add-nodes-form.component.html',
    styleUrls: ['./add-nodes-form.component.scss']
})
export class AddNodesFormComponent implements OnInit {
    nodesForm: FormGroup;
    @Output() addNode = new EventEmitter();

    constructor(
        private fb: FormBuilder
    ) {
        this.nodesForm = this.fb.group({
            type: [''],
            name: ['', Validators.required],
            file_path: [''],
            description: ['']
        });
    }

    ngOnInit() {
    }

    addNewNode() {
        this.addNode.emit(this.nodesForm.value);
    }

}
