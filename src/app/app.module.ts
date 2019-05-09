import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {NgxSvgModule} from 'ngx-svg';
import {NgxGraphModule } from '@swimlane/ngx-graph';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MappingToolComponent } from './mapping_tool/mapping-tool/mapping-tool.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AddNodesFormComponent } from './mapping_tool/add-nodes-form/add-nodes-form.component';

@NgModule({
    declarations: [
        AppComponent,
        MappingToolComponent,
        AddNodesFormComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgxSvgModule,
        FormsModule,
        ReactiveFormsModule,
        NgxGraphModule,
        BrowserAnimationsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
