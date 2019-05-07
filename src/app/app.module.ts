import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {NgxSvgModule} from 'ngx-svg';
import {NgxGraphModule } from '@swimlane/ngx-graph';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MappingToolComponent } from './mapping-tool/mapping-tool.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        AppComponent,
        MappingToolComponent
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
