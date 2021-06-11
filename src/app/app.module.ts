import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PaintComponent } from './components/paint/paint.component';
import { FabricCanvasComponent } from './components/paint/fabric-canvas/fabric-canvas.component';
import { GraphicalToolbarComponent } from './components/paint/toolbar/toolbar.component';
import { ColourPaletteComponent } from './components/paint/toolbar/colour-palette/colour-palette.component';
import { ThicknessSliderComponent } from './components/paint/toolbar/thickness-slider/thickness-slider.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { EventHandlerService } from './components/paint/event-handler.service';
import { FabricShapeService } from './components/paint/shape.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { AuthService } from './shared/auth.service';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
@NgModule({
  declarations: [
    AppComponent,
    PaintComponent,
    FabricCanvasComponent,
    GraphicalToolbarComponent,
    ColourPaletteComponent,
    ThicknessSliderComponent,
    DashboardComponent,
    LogInComponent
  ],
  imports: [
    BrowserModule, 
    InputsModule, 
    BrowserAnimationsModule, 
    FormsModule,
    AppRoutingModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireDatabaseModule
  ],
    providers: [EventHandlerService, FabricShapeService, AuthService,FabricCanvasComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }
